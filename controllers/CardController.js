import CardModel from "../models/card.js"
import UserSchema from '../models/User.js'

export const getAll = async (req, res) => {
    try {
        const cards = await CardModel.find().populate('author').sort({
            createdAt: -1,
        }).exec();
        res.json(cards);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {

    try {

        const cardId = req.params.id
        const card = await CardModel.findByIdAndUpdate( 
        {
            _id: cardId,
        },
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        }).populate('author')
        res.json(card)
    }   catch (err) {
        res.json({message:'Что-то пошло не так'})
    }
    
    // try {
    //     const cardId = req.params.id
        
    //     CardModel.findByIdAndUpdate().populate('author')(
    //     { 
    //         _id: cardId,
    //     },
    //     {
    //         $inc: { viewsCount: 1 },
    //     },
    //     {
    //         returnDocument: 'after',
    //     },
    //     (err, doc) => {
    //         if (err){
    //             console.log(err);
    //             return res.status(500).json({
    //                 message: 'Не удалось получить статью'
    //             })
    //         }
    //         if (!doc) {
    //             return res.status(404).json ({
    //                 message: 'Статья не найдена'
    //             })
    //         }

    //         res.json(doc);
    //     })

    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //         message: 'Не удалось получить статьи'
    //     })
    // }
}

export const remove = async (req, res) => {
    try {
        const cardId = req.params.id
        
        CardModel.findOneAndDelete({
              _id: cardId,
            },
            (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось удалить статью'
                    })
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    success: true,
                })

            })
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CardModel({
            name: req.body.name,
            price: req.body.price,
            cathegory: req.body.cathegory,
            status: req.body.status,
            size: req.body.size,
            description: req.body.description,
            tags: req.body.tags,
            imgUrl: req.body.imgUrl,
            author: req.userId,
            currency: req.body.currency,
            symbol: req.body.symbol,
            destPrice: req.body.destPrice,
            destination: req.body.destination,
            delivery: req.body.delivery,
        })

        await UserSchema.findByIdAndUpdate(req.userId,{
            $push: {cards: doc},
        })

        const post = await doc.save()

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать товар'
        })
    }
}

export const update = async (req, res) => {
    try {
        const cardId = req.params.id;
        
        await CardModel.updateOne({
            _id: cardId
        }, {

            name: req.body.name,
            price: req.body.price,
            cathegory: req.body.cathegory,
            status: req.body.status,
            description: req.body.description,
            tags: req.body.tags,
            imgUrl: req.body.imgUrl,

        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить товар'
        })
    }
}

export const like = async (req, res) => {

    try{
    CardModel.findByIdAndUpdate(
        {
            _id: req.params.id,
        },
        {
            $addToSet: {like: req.userId},
            $inc: { likeCount: 1 }
        },
        {
            new: true
        }).exec(
            (err, result) => {
                if(err){
                    return res.status(404).json({error: err})
                }
                else{
                    UserSchema.findByIdAndUpdate(
                        {
                            _id: req.userId
                        },
                        {
                            $addToSet: {liked: req.params.id}
                        },
                        ).exec()
                    res.json(result)
                }
            }
        )
    } catch (err) {
        return res.json(err)

    }

}


export const likeDelete = async (req, res) => {

    try{
    CardModel.findByIdAndUpdate(
        {
            _id: req.params.id,
        },
        {
            $pull: {like: req.userId},
            $inc: { likeCount: -1 }
        },
        {
            new: true
        }).exec(
            (err, result) => {
                if(err){
                    return res.status(404).json({error: err})
                }
                else{
                    UserSchema.findByIdAndUpdate(
                        {
                            _id: req.userId
                        },
                        {
                            $pull: {liked: req.params.id}
                        },
                        ).exec()
                    res.json(result)
                }
            }
        )
    } catch (err) {
        return res.json(err)

    }

}



export const getMyCards = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        const list = await Promise.all(
            user.cards.map((card) => {
                return CardModel.findById(card._id)
            }),
            )

        res.json(list)
    } catch (err) {
        res.json({message: 'Что-то пошло не так.'})
    }
}

export const getMyFavoriteCards = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId)
        const list = await Promise.all(
            user.liked.map((card) => {
                return CardModel.findById(card._id).populate('author')
            }),
        )
        res.json(list)
    } catch (err) {
        res.json({message: 'Что-то пошло не так.'})
    }
}

export const getUserCards = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.params.id)
        const list = await Promise.all(
            user.cards.map((card) => {
                return CardModel.findById(card._id).populate('author')
            }),
            )

        res.json(list)
    } catch (err) {
        res.json({message: 'Что-то пошло не так.'})
    }
}