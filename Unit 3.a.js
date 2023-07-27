const express = require('express')
const app = express()
//imports the http server from node.js

app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

app.get('/',(request,response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes',(request,response)=>{
    response.json(notes)
})

//handles HTTP GET requests for 
app.get('/api/notes/:id',(request,response)=>{
  const id = Number(request.params.id)
  const note = notes.find(note=>note.id===id)
  if(note){
    response.json(note)
  }
  else{
    response.status(404).end()
    //end method for responding to request without sending data 
    //symbolizes end of request (break)
  }
})

app.delete('/api/notes/:id',(request,response)=>{
  const id = Number(request.params.id)
  notes=notes.filter(note=>note.id!==id)
  response.status(204).end()
})

const generateId = ()=>{
  const maxId = notes.length>0?Math.max(...notes.map(n=>n.id)):0
  //the ... (spread operator) for the notes array spreads it into individual numbers 
  //converting from [#1,#2,#3] to #1,#2,#3
  //copies references to elements from og arrays 
  return maxId+1
}


app.post('/api/notes',(request,response)=>{
  
  const body = request.body

  if(!body.content){
    return response.status(400).json({
      error:'content missing'
    })
}
 
const note = {
  content:body.content,
  important: body.important || false,
  id:generateId(),
}

  notes = notes.concat(note)

  response.json(note)
  // console.log(request.headers)
})

// const PORT = 3001
// app.listen(PORT, ()=>{
//     console.log(`Server running on port ${PORT}`)
// }) //starts server and makes server receptible to incoming requests  

