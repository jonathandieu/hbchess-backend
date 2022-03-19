import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  accepted: boolean;
}

const TeamSchema = new Schema({
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
  accepted: { type: Boolean, required: true, default: false }
});

TeamSchema.index({ sender: 1, recipient: 1 }, { unique: true });
TeamSchema.index({ recipient: 1, sender: 1 }, { unique: true });

export default mongoose.model("Team", TeamSchema);
