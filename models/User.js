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
        time:{
            type: Date,
            default: Date.now()
        }
    }],
    role:{
        type: String,
        default: 'Seller'
    },
    bannerUrl:{
        type: String,
    },
    status:{
        type: String,
        default: '',
    },
    description:{
        type: String,
        default: ''
    }
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema)