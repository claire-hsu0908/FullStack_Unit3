//importing mongoose
const mongoose = require('mongoose')

//setting strictquery mode as false so 
//will overlook queries for data not conforming to schemas
mongoose.set('strictQuery',false)

//path = Node.js module allowing for us to locate directories
//require('dotenv') imports the dotenv package that allows us to use enviro variables from .env files
//path allows us to locate the exact env file
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../note.env') })

//can use process.env.variable name 
const url = process.env.MONGODB_URI

//uses mongoose library to connect to MongoDB database using url 
mongoose.connect(url).then(()=>{
    console.log('connected to MongoDB')
}).catch(error=>{
    console.log('error connecting to MongoDB:',error.message)
})

//defines structure of collection in database
const noteSchema = new mongoose.Schema({
    name:{
        type:String,
        validate: {
            validator: function (value) {
                if(value.length<3){
                    return false
                }
          },
    },
        required:true
    },
    number:{
        type:String,        
        validate: {
            validator: function (value) {
                if(value.length<8){
                    return false
                }
                if (Array.from(value).every((v)=>v!=="-")){
                    return false
                }
                else{
                    const parts = value.split("-")

                    if(parts[0].length!==2 && parts[0].length!==3){
                        return false
                    }
                    if(parts.length>2){
                        return false
                    }
                    var part0chars = Array.from(parts[0])
                    var part1chars = Array.from(parts[1])
                    if(part0chars.every((char)=> isNaN(parseInt(char,10)))||part1chars.every((char)=>isNaN(parseInt(char,10)))){
                        return false
                    }
                }
          },
    }, 
    required:true
},

})

//revises structure -> converts id from object to string
//deletes unecessary elements 
noteSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}
)

module.exports = mongoose.model('Note',noteSchema)