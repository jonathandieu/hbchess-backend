import mongoose from "mongoose";
import isemail from "isemail";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email address is required"],
    validate: [
      function(v: string) {
        return isemail.validate(v);
      },
      "Please fill a valid email address"
    ]
  },
  username: { type: String, trim: true, unique: true, required: true },
  password: {
    type: String,
    required: true,
    match: /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/
  },
  emailToken: { type: String },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
