import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  matches: mongoose.Types.ObjectId[];
  wins: mongoose.Types.ObjectId[];
  losses: mongoose.Types.ObjectId[];
  ties: mongoose.Types.ObjectId[];
  name: string;
  accepted: boolean;
}

export const TeamSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    validate: [
      function (this: ITeam, v: mongoose.Types.ObjectId) {
        return this.sender._id !== v;
      },
      "Please fill a valid email address"
    ]
  },
  matches: { type: Number, required: true, default: 0 },
  wins: {
    type: [mongoose.Types.ObjectId],
    ref: "Game",
    required: true,
    default: []
  },
  losses: {
    type: [mongoose.Types.ObjectId],
    ref: "Game",
    required: true,
    default: []
  },
  ties: {
    type: [mongoose.Types.ObjectId],
    ref: "GameW",
    required: true,
    default: []
  },
  name: { type: String, required: true, default: "Everything is Team Name" },
  accepted: { type: Boolean, required: true, default: false }
});

TeamSchema.index({ sender: 1, recipient: 1 }, { unique: true });
TeamSchema.index({ recipient: 1, sender: 1 }, { unique: true });

export default mongoose.model("Team", TeamSchema);
