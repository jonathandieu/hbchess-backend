import isemail from "isemail";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
  emailToken: string | null;
  isVerified: boolean;
}

export const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Email address is required"],
    validate: [
      function (v: string) {
        return isemail.validate(v);
      },
      "Please fill a valid email address"
    ]
  },
  username: { type: String, trim: true, required: true },
  password: {
    type: String,
    required: true,
    match: /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/
  },
  emailToken: { type: String },
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema);
