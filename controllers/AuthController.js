import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import registerSchema from "../validationSchemas/RegisterSchema.js";
import loginSchema from "../validationSchemas/loginSchema.js";

const AuthController = express.Router();

AuthController.post("/register", async (req, res)=>{
    let userData = {
        name: req?.body?.name,
        phone: req?.body?.phone,
        password: req?.body?.password,
        email: req?.body?.email,
    }
    const { error } = registerSchema.validate(userData, { abortEarly: false });
    if(!error){
        const checkUserExistence = await UserModel.count({
            where: [
                {
                    phone: userData?.phone
                }
            ]
        });
        
        if(!(checkUserExistence > 0)){
            userData.password = bcrypt.hashSync(userData.password, 5);
            UserModel.create(userData).then((result)=>{
                return res.status(200).json({
                    dateTime: new Date(),
                    message: "New user has been registered.",
                    insertedId: result?.id,
                });
            }).catch((e)=>{
                return res.status(400).json({
                    dateTime: new Date(),
                    message: "DB Error.",
                    errors: e,
                });
            });
        }else{
            return res.status(400).json({
                dateTime: new Date(),
                message: "User Already registered with this phone number.",
                errors: new Error("User Already registered with this phone number."),
            });
        }
    }else{
        return res.status(400).json({
            dateTime: new Date(),
            message: "Validation error.",
            errors: error.details,
        });
    }
});


AuthController.post("/login", async (req, res)=>{
    let postData = {
        phone: req?.body?.phone,
        password: req?.body?.password
    }
    const { error } = loginSchema.validate(postData, { abortEarly: false });
    if(!error){
        let user = await UserModel.findOne({
            where: [
                {
                    phone: postData?.phone
                }
            ],
            attributes: { include: "password"}
        });
        if(user && bcrypt.compareSync(postData?.password, user?.password)){
            let token = jwt.sign({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email
            }, process.env.SECRET_KEY, { expiresIn: '7d' });
            
            return res.status(200).json({
                dateTime: new Date(),
                message: "Sign in successful.",
                token: token
            });
        }else{
            return res.status(400).json({
                dateTime: new Date(),
                message: "Phone number or password does not matched.",
                errors: new Error("Phone number or password does not matched."),
            });
        }
    }else{
        return res.status(400).json({
            dateTime: new Date(),
            message: "Validation error.",
            errors: error.details,
        });
    }

});

export default AuthController;