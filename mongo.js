const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
`mongodb+srv://fullstack:${password}@cluster0.lvg0wbq.mongodb.net/phoneApp?retryWrites=true&w=majority`

// const phoneCollection = require('./phonebook')
//problem:need to find a way to connect with the phonebook collection in the notesApp database 

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Note = mongoose.model('Note', noteSchema)

if(newName && newNumber){
    const note = new Note({
    name:newName,
    number:newNumber
})

note.save().then(result => {
  console.log(`added ${newName} ${newNumber} to phonebook`)
  mongoose.connection.close()
}).catch(error=>{
    'Error saving note', note
    mongoose.connection.close()
})
}
else{
    console.log('Phonebook: ')
    Note.find({}).then(result=>{
    result.forEach(note=>{
        console.log(note.name,note.number)
    })
    mongoose.connection.close()
})
}



// const note = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })



// Note.find({}).then(result=>{
//     result.forEach(note=>{
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

// module.exports=Note