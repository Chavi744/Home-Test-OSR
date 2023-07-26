const mongoose = require('mongoose');

const uri = "mongodb+srv://user1:gMY1WRt9zAzxQLlj@candidatestest.vncftyo.mongodb.net/?retryWrites=true&w=majority"

async function connect() {
    try {
        await mongoose.connect(uri); 
        console.log("connect mongo")
    } catch (error) {
        console.log(error)
    }
}

connect();

