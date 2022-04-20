import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  black: mongoose.Types.ObjectId;
  white: mongoose.Types.ObjectId;
  moves: string[];
  result: string;
  isWhiteSenderHand: boolean;
  isBlackSenderHand: boolean;
}

const GameSchema = new Schema({
  black: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
    required: true
  },
  white: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
    required: true,
    validate: [
      function (this: IGame, value: mongoose.Types.ObjectId) {
        return this.black._id !== value;
      },
      "Cannot play game against self"
    ]
  },
  moves: { type: String, default: "" },
  result: {
    type: String,
    enum: ["Black", "White", "Draw", null],
    default: null
  },
  isWhiteSenderHand: { type: Boolean, required: true },
  isBlackSenderHand: { type: Boolean, required: true }
});

export default mongoose.model("Game", GameSchema);
