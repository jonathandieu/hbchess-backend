import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
    _id: mongoose.Types.ObjectId;
    black: mongoose.Types.ObjectId;
    white: mongoose.Types.ObjectId;
    moves: String;
    result: String;
}

const GameSchema = new Schema({
    black: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true
    },
    white: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
        index: true,
        validate: [
          function (this: IGame, value: mongoose.Types.ObjectId) {
            return this.black !== value;
          },
          "Cannot play game against self"
        ]
    },
    moves: { type: String, required: true, default: "" },
    result: { type: String, enum: ["Black", "White", "Draw", null], default: null }
});

export default module.exports = mongoose.model("Game", GameSchema)