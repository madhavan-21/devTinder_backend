const mongoose = require('mongoose');


const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb://madhavan:madhavan@ac-lpbdy72-shard-00-00.zfkkzl1.mongodb.net:27017,ac-lpbdy72-shard-00-01.zfkkzl1.mongodb.net:27017,ac-lpbdy72-shard-00-02.zfkkzl1.mongodb.net:27017/?ssl=true&replicaSet=atlas-rh6k73-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected...');
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;