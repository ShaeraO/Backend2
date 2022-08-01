import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    surname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    shopname: {
        type: String,
        optional: true,
    },
    code:{
        type: String,
    },
    cards: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Card'
    }],
    liked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
    }]
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema)