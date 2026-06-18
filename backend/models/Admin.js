const mongoose = require('mongoose');
const passportLocalMongooseObj = require('passport-local-mongoose');
const passportLocalMongoose = passportLocalMongooseObj.default || passportLocalMongooseObj;

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

// passport-local-mongoose automatically adds username, hash, and salt fields
AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminSchema);
