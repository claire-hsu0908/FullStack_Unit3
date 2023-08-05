//import express library in company with Node.js
const express = require('express')
const app = express()
//express.json() = middleware that parses incoming request with json payloads (content in body), displaying it in a structured format 
app.use(express.json())


//import function static in express library
//static function allows interaction with build modules
app.use(express.static('build'))

//imports morgan and cors middleware
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())


//importing note file connecting backend to database in MongoDB
const Note = require('./models/note')

//defines customized token in morgan middleware called content
//returns the content of the new note created as a strong 
morgan.token('content',function(request){
  if(request.method==='POST'){
    return JSON.stringify(request.body)
  }
  else{
    return ''
  }
})

//uses default mode in morgan middleware (prints out all respective tokens + new custom token content)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content' ))

//requestLogger = custom middleware function that prints outs each incoming requests received by the server to the console
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)


//unknownEndpoint custom middleware function that sends out error if the port called does not exist 
//catch all middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}



//default notes 
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

// API endpoints for HTTP GET requests from browser to specific urls/servers
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>').end()
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes=>{
    res.json(notes)
  })
})

app.get('/info',(request,response)=>{
  response.timeStart = new Date()
  Note.countDocuments({}).then((count)=>{
    if(count===1){
      var people = 'person'
    }
    else{
      people = 'people'
    }
    response.send(`<p>Phonebook has info for ${count} ${people}
    <br/>
    ${response.timeStart}
  <p> `)
  }).catch((err)=>{
    console.log('Error counting documents:',err)
  })
  // response.send(`<p>Phonebook has info for ${notes.length} people
  // <br/>
  //   ${response.timeStart}
  // <p> `)
})

//---------------------------------------
//HTTP POST API ENDPOINT
app.post('/api/notes', (request, response,next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  //name and number come from the mongoose.Schema in note.js
  //bosdy.content comes from the note Object in 
  //noteService.create(noteObject) in frontend programming
  
  const note = new Note({
    name: body.content,
    number:body.number
  })

  note.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)  
    response.json(note).end()
  }).catch(error=>{
      console.log('Error saving note', note)
      next(error)
  })

})

//-------------------------------------------------
app.delete('/api/notes/:id', (request, response,next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(()=>{
      response.status(204).end()
    })  
    .catch(error=>{next(error)})

  // notes = notes.filter(note => note.id.toString() !== request.params._id)
  response.status(204).end()
})

//---------------------------------------------------
app.put('/api/notes/:id',(request,response,next)=>{
  const body = request.body

  const note = {
    name: body.name,
    number:body.number
  }

  Note.findByIdAndUpdate(request.params.id,note,{new:true,runValidators: true, context: 'query'})
    .then(updatedNote=>{
      response.json(updatedNote)
    })
    .catch(error=> next(error))
})



app.use(unknownEndpoint)

//error handler middleware called when next(error) is called 
const errorHandler = (error, request, response, next)=>{
  console.log(error.message)

  //CastError = error is invalid ObjectId -> incorrect format or type
  if (error.name==='CastError'){
    return response.status(400).send({error:'malformatted id'})
  }
  //ValidationError = mongoose model's data fails defined schema validation rules 
  else if(error.name==='ValidationError'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}

app.get('/api/notes/:id', (request, response,next) => {
  Note.findById(request.params.id).then(note=>{
    if(note){
      response.json(note)
    }
    else{
      response.status(404).end()
    }
    
  //next function called with parameter = execution continues in error handler middleware
  }).catch(error=>next(error))
})



app.use(errorHandler)
//defining PORT from enviro variable 
const PORT = process.env.PORT 

//sets Node.js application to listen for requests from specified port 
//starts server for specific PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
