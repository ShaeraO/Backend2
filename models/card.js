import mongoose from "mongoose";


const CardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    cathegory:{
        type: String,
    },
    size:{
        type: Number,
        required: true,
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: Array,
    },
    viewsCount:{
        type: Number,
        default: 0
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    hashtags:{
        type: [String],
        default: []
    },
    like:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
}, {
    timestamps: true,
});

export default mongoose.model('Card', CardSchema)