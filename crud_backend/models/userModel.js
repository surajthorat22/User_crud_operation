import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    line1: { type: String, required: true, trim: true },
    line2: { type: String, required: true, trim: true },
    city:  { type: String, required: true, trim: true }
  });
  
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is Required!!!'] },
  middlename: { type: String },
  lastname: { type: String, required: true },
  age: { type: Number, required: true },
  phoneno: { type: String, required: true },
  bloodgroup: { type: String, required: true },
  dob: { type: Date, required: true },
  address: {
    required: true,
    type: [addressSchema],
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: 'address is required'
    }
  }
});

const User = mongoose.model('User', userSchema);

export default User;
