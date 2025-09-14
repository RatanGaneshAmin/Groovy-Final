const mongoose = require ('mongoose');

var schema_1 = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
},{collection:'signup'})

const Userdb = mongoose.model('signup',schema_1);
module.exports = {
    Userdb: Userdb,
};