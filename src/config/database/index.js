const mongoose = require('mongoose');

// Set Mongoose strictQuery option
mongoose.set('strictQuery', true);


const uri = "mongodb+srv://root:ABC123@ga03.dhlfb.mongodb.net/GA03?retryWrites=true&w=majority&appName=GA03";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connect successfully!!!');
    } catch (error) {
        console.error('Connect failure!!!', error);
    }
}

module.exports = { connect };