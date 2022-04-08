import mongoose, { Schema, Document } from "mongoose";
import { TeamSchema, ITeam } from "./team";

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  black: ITeam;
  white: ITeam;
  moves: string[];
  result: string;
}

const GameSchema = new Schema({
  black: {
    type: TeamSchema,
    ref: "Team",
    required: true
  },
  white: {
    type: TeamSchema,
    ref: "Team",
    required: true,
    validate: [
      function (this: IGame, value: ITeam) {
        return this.black !== value;
      },
      "Cannot play game against self"
    ]
  },
  moves: { type: [String], required: true, default: [] },
  result: {
    type: String,
    enum: ["Black", "White", "Draw", null],
    default: null
  },
  isWhiteSenderHand: { type: Boolean, required: true },
  isBlackSenderHand: { type: Boolean, required: true }
});

export default mongoose.model("Game", GameSchema);
