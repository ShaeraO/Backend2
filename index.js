import express from "express"
import multer from "multer"
import mongoose from 'mongoose'
import cors from "cors"
import { registerValidator, loginValidator, cardCreateValidation } from './validation.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as CardController from './controllers/CardController.js'
import handleValidErrors from "./utils/handleValidErrors.js"


mongoose.connect(
    'mongodb+srv://TooBears:H9GJTIsIgKFCfrTp@cluster0.vttvd.mongodb.net/toobears?retryWrites=true&w=majority'
    ).then(() => console.log('DB connected'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())

app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidator, handleValidErrors, UserController.register);

app.post('/auth/login', loginValidator, handleValidErrors, UserController.login)

app.get('/auth/me', checkAuth, UserController.getUser)

app.patch('/auth/me', checkAuth, UserController.updateUser)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/market', CardController.getAll)
app.get('/market/:id', CardController.getOne)
app.post('/market', checkAuth, handleValidErrors, cardCreateValidation ,CardController.create)
app.delete('/market/:id', checkAuth , CardController.remove)
app.patch('/market/:id', checkAuth , handleValidErrors, CardController.update)


app.listen(4444, (err) =>{
    if (err) {
        return console.log(err)
    }

    console.log('Server is running')
});