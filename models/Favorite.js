import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    card:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }
}, {
    timestamps: true,
})

export default mongoose.model('Favorite', FavoriteSchema)