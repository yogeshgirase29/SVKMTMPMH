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
AdminSchema.plugin(passportLocalMongoose, {
  findByUsername: function(model, queryParameters) {
    const makeCaseInsensitive = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(makeCaseInsensitive);
      } else {
        for (const key in obj) {
          if (key === 'username' && typeof obj[key] === 'string') {
            const safeUsername = obj[key].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            obj[key] = new RegExp('^' + safeUsername + '$', 'i');
          } else if (typeof obj[key] === 'object') {
            makeCaseInsensitive(obj[key]);
          }
        }
      }
    };
    makeCaseInsensitive(queryParameters);
    return model.findOne(queryParameters);
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
