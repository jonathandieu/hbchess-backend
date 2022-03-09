import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
  emailToken: string | null;
  isVerified: boolean;
}

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailToken: { type: String },
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema);
