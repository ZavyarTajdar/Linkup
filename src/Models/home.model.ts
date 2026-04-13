import mongoose, { Schema, model } from "mongoose";
import { IHome } from "../Interfaces/home.interface";

const homeSchema = new Schema<IHome>({
    feed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }]
}, {
    timestamps: true
});

const Home = model<IHome>('Home', homeSchema);

export default Home;
    