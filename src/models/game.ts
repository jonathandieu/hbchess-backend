import mongoose, { Schema, Document } from "mongoose";
import { TeamSchema, ITeam } from "./team";

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  hostTeam: ITeam;
  guestTeam: ITeam;
}

const GameSchema = new Schema({
  hostTeam: TeamSchema,
  guestTeam: TeamSchema
});

export default mongoose.model("Game", GameSchema);
