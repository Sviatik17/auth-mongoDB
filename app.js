const express = require('express');
const mongoose=require('mongoose');
const authRouter=require('./authRouter');
const PORT =3000;

const app = express();
app.use(express.json())
app.use('/auth',authRouter)
const start= async()=>{
    try{
        await mongoose.connect(`mongodb+srv://root:vYHZ7LgfcwehwKIg@cluster0.a3o8lee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        app.listen(PORT,()=>{
            console.log(`Server work on port:${PORT}`);
        })
    }catch(e){
        console.log(e)
    }
}

start();