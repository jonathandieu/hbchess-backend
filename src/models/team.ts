import mongoose, { Schema, Document } from "mongoose";
import { UserSchema, IUser } from "./user";

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  sender: IUser;
  recipient: IUser;
  matches: number;
  wins: mongoose.Types.ObjectId[];
  losses: mongoose.Types.ObjectId[];
  ties: mongoose.Types.ObjectId[];
  name: string;
  accepted: boolean;
}

export const TeamSchema = new Schema({
  sender: { type: UserSchema, ref: "User", required: true },
  recipient: {
    type: UserSchema,
    ref: "User",
    required: true,
    validate: [
      function (this: ITeam, v: IUser) {
        return this.sender !== v;
      },
      "Please fill a valid email address"
    ]
  },
  matches: { type: Number, required: true, default: 0 },
  wins: { type: [mongoose.Types.ObjectId], required: true, default: [] },
  losses: { type: [mongoose.Types.ObjectId], required: true, default: [] },
  ties: { type: [mongoose.Types.ObjectId], required: true, default: [] },
  name: { type: String, required: true, default: "Everything is Team Name" },
  accepted: { type: Boolean, required: true, default: false }
});

TeamSchema.index({ sender: 1, recipient: 1 }, { unique: true });
TeamSchema.index({ recipient: 1, sender: 1 }, { unique: true });

export default mongoose.model("Team", TeamSchema);
