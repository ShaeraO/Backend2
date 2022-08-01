import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    cards:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }]

})

export default mongoose.model('Favorite', FavoriteSchema)