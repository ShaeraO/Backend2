import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import UserModel from "../models/User.js";
import CardModel from "../models/card.js";

export const register = async (req, res) => {
    try { 
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
 
     const doc = new UserModel({
         username: req.body.username,
         surname: req.body.surname,
         email: req.body.email,
         passwordHash: hash,
     })
 
     const user = await doc.save();
 
     const token = jwt.sign({
         _id: user._id,
     }, 'secretkey',
     {
         expiresIn: '24h'
     },)
 
     const {passwordHash, ...userData} = user._doc
 
     res.json({
         ...userData,
         token,})
 
    } catch (err) {
     console.log(err)
     res.status(500).json({
         message: "Не удалось зарегистрироваться",
    })
    }
 };

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email})

        if(!user){
            return req.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secretkey',
        {
            expiresIn: '24h'
        })

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token,})

    } catch(err) {
        console.log(err)
        res.status(500).json({
        message: "Не удалось авторизоваться",
   })
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const {passwordHash, ...userData} = user._doc
    

        res.json(userData)
        
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:'Нет доступа'
        })
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        await UserModel.updateOne({
            _id: user
        }, {

            shopname: req.body.shopname

        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить профиль'
        })
    }
}

export const liked = async (req, res) => {
    
    const user = req.userId
    const cardId = req.params.id 



}