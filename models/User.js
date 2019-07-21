const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creat Schema
const UserSchema = new Schema({
  name:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true
  },
  identity:{
    type: String,
    require: true
  },
  avatar:{
    type: String
  },
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model("users",UserSchema);