import express from "express";
import SpamModel from "../models/SpamModel.js";
import spamSchema from "../validationSchemas/spamSchema.js";

const SpamController = express.Router();

SpamController.get("/", (req, res)=>{
    SpamModel.findAndCountAll().then((result)=>{
        return res.status(200).json({
            date: new Date(),
            data: result
        });
    }).catch((e)=>{
        return res.status(400).json({
            dateTime: new Date(),
            message: e.message,
            errors: e,
        });
    });
});


SpamController.post("/", async (req, res, next) => {
    const {phone} = req.body;
    const user_id = req.user?.id;
    const { error } = spamSchema.validate({phone}, { abortEarly: false });
    if (!error) {
        SpamModel.create({user_id, phone}).then((result) => {
            return res.status(201).json({
                date: new Date(),
                insertedId: result?.id,
                message: "Phone number has been marked as spam.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "Phone number already marked as spam.",
                error: new Error("Phone number already marked as spam.")
            });
        });
    } else {
        return res.status(400).json({
            dateTime: new Date(),
            message: "Validation error.",
            error: error.details
        });
    }
});


SpamController.delete("/:phone", async (req, res, next) => {
    const {phone} = req.params;
    const user_id = req.user?.id;
    
    SpamModel.destroy({where: {user_id, phone}, force: true}).then((result) => {
        return res.status(201).json({
            date: new Date(),
            message: "Phone number has been removed from spam.",
        });
    }).catch((err) => {
        return res.status(400).json({
            dateTime: new Date(),
            message: "DB Error.",
            error: err
        });
    });
});

export default SpamController;