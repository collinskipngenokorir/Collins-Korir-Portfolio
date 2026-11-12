require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { type } = require('node:os');

const app = express();

//middleware
app.use(cors());
app.use(express.json());//Parses incoming JSON requests

//MONGODB Connection
//Replacing the url below with actual MONGODB connection string(from MongoDb Atlas)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017portfolio_db';

mongoose.connect(MONGO_URL)
.then(() => console.log('Connected to MongoDb'))
.catch((err) => ('MongoDb Connection error:', err));

//Creating a schema for the Contact messages
const contactSchema = new mongoose.Schema({
  name:{type: String, required:true},
  email:{type: String, required:true},
   subject:{type: String, required:true},
   message:{type: String, required:true},
   date:{type: Date, default:Date.now}
});
const Contact = mongoose.model('Contact', contactSchema);

//API Route for Form Submission

app.post('/api/contact', async (req, res) =>{
  try{
    const {name, email, subject, message} = req.body;

    //Basic validation
    if(!name || !email || !subject || !message){
      return res.status(400).json({message:'Please fill all the fields'});
    }
    //save to database
    const newContact = new Contact({name, email, subject, message});
    await newContact.save();

    res.status(201).json({message: 'Message saved successfully'});
  }
  catch (error){
    res.status(500).json({message: 'Server error, please try again later'});
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
  console.log('Server running on port ${PORT}');
});
