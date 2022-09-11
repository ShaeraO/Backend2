import express from "express"
import multer from "multer"
import mongoose from 'mongoose'
import cors from "cors"
import { registerValidator, loginValidator, cardCreateValidation } from './validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as CardController from './controllers/CardController.js'
import handleValidErrors from "./utils/handleValidErrors.js"

// mongodb+srv://TooBears:H9GJTIsIgKFCfrTp@cluster0.vttvd.mongodb.net/toobears?retryWrites=true&w=majority

//mongodb://TooBearsAdmin:2wi9v2e6U{fL23R3@185.130.114.28/TooBears


mongoose.connect(
    'mongodb+srv://TooBears:H9GJTIsIgKFCfrTp@cluster0.vttvd.mongodb.net/toobears?retryWrites=true&w=majority'
    ).then(() => console.log('DB connected'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, files, cb) => {
        cb(null, files.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())

app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidator, handleValidErrors, UserController.register);

app.post('/auth/login', loginValidator, handleValidErrors, UserController.login)

app.get('/auth/me', checkAuth, UserController.getUser)

app.get('/users/:id', UserController.getUserById)

app.get('/users', UserController.getAllUsers)

app.patch('/auth/me', checkAuth, UserController.updateUser)

app.patch('/users/subscribe/:id', checkAuth, UserController.subscribe)

app.get('/users/me/subscribed', checkAuth, UserController.getMySubs)

app.post('/upload', checkAuth, upload.array('images', 6), (req, res) => {
    res.json({
        urls : req.files.map(function(file){
            return `/uploads/${file.originalname}`
        })

    })
})

app.post('/upload/banner', checkAuth, upload.single('banner'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/upload/avatar', checkAuth, upload.single('avatar'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})



app.get('/market', CardController.getAll)
app.get('/market/:id', CardController.getOne)
app.post('/market', checkAuth, handleValidErrors, cardCreateValidation ,CardController.create)
app.delete('/market/:id', checkAuth , CardController.remove)
app.patch('/market/:id', checkAuth , handleValidErrors, CardController.update)
app.get('/market/user/me', checkAuth, CardController.getMyCards)
app.patch('/market/:id/like', checkAuth, CardController.like, )
app.delete('/market/:id/likeremove', checkAuth, CardController.likeDelete, )
app.get('/market/user/me/liked', checkAuth, CardController.getMyFavoriteCards)
app.get('/market/cards/:id', CardController.getUserCards)


app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server is running')
});