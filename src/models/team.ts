import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ITeam extends Document {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  accepted: boolean;
}

const TeamSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: [
      function (this: ITeam, v: mongoose.Types.ObjectId) {
        const existing = this.constructor().findOne({ recipient: v, sender: this.recipient });
        return !existing || existing._id === this._id
      },
      "Recipient has already sent a request to sender"
    ]
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: [
      function (this: ITeam, v: mongoose.Types.ObjectId) {
        return this.sender !== v;
      },
      "Cannot request friendship with self"
    ]
  },
  accepted: { type: Boolean, required: true, default: false }
});

TeamSchema.index({ sender: 1, recipient: 1 }, { unique: true });
TeamSchema.index({ recipient: 1, sender: 1 }, { unique: true });

export default module.exports = mongoose.model("Team", TeamSchema);
