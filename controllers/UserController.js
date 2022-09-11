import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try { 
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
 
     const doc = new UserModel({
         role: req.body.role,
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

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)

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

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate('cards').sort({
            createdAt: -1,
        }).exec();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
}

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
            shopname: req.body.shopname,
            bannerUrl: req.body.bannerUrl,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            description: req.body.description,
            username: req.body.username,
            surname: req.body.surname
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
}

export const subscribe = async (req, res) => {
    try{
        UserModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $addToSet: {subscribed: req.userId},
                $inc: { subsCount: 1 }
            },
            {
                new: true
            }).exec((err, result) => {
                
                if(err){
                    return res.status(404).json({error: err}) 
                }
                else{
                    UserModel.findByIdAndUpdate(
                        {
                            _id: req.userId,
                        },
                        {
                            $addToSet: {
                                subscribe: req.params.id,
                            }

                        },
                        ).exec(),
                    res.json(result)
                }
            })
        }catch(err){
            return err
        }
}

export const getMySubs = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        const list = await Promise.all(
            user.subscribe.map((user) => {
                return UserModel.findById(user._id)
            }),
        )
        res.json(list)
    } catch (err) {
        res.json(err)
    }
}
