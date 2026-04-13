import mongoose, {model, Schema} from "mongoose";
import {ISaved} from "../Interfaces/saved.interface";

const savedSchema: Schema = new Schema<ISaved>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});

const Saved = model<ISaved>('Saved', savedSchema);

export default Saved;