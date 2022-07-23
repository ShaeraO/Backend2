import CardModel from "../models/card.js"

export const getAll = async (req, res) => {
    try {
        const cards = await CardModel.find().populate('author').exec();

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
        
        CardModel.findOneAndUpdate(
        { 
            _id: cardId,
        },
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err){
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось получить статью'
                })
            }
            if (!doc) {
                return res.status(404).json ({
                    message: 'Статья не найдена'
                })
            }

            res.json(doc);
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
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