import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  accepted: boolean;
}

export const TeamSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: [
      function (this: ITeam, v: mongoose.Types.ObjectId) {
        return this.sender !== v;
      },
      "Please fill a valid email address"
    ]
  },
  senderUsername: { type: Schema.Types.String, ref: "User", required: true },
  recipientUsername: { type: Schema.Types.String, ref: "User", required: true },
  matches: { type: Number, required: true, default: 0 },
  wins: { type: Number, required: true, default: 0 },
  losses: { type: Number, required: true, default: 0 },
  name: { type: String, required: true, default: "Everything is Team Name" },
  accepted: { type: Boolean, required: true, default: false }
});

TeamSchema.index({ sender: 1, recipient: 1 }, { unique: true });
TeamSchema.index({ recipient: 1, sender: 1 }, { unique: true });

export default mongoose.model("Team", TeamSchema);
