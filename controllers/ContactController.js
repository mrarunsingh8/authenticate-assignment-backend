import express from "express";
import ContactModel from "../models/ContactsModel.js";
import contactPostSchema from "../validationSchemas/contacts/contactPostSchema.js";
import contactPutSchema from "../validationSchemas/contacts/contactPutSchema.js";
import contactPatchNameSchema from "../validationSchemas/contacts/patch/contactPatchNameSchema.js";
import contactPatchPhoneSchema from "../validationSchemas/contacts/patch/contactPatchPhoneSchema.js";
import contactPatchEmailSchema from "../validationSchemas/contacts/patch/contactPatchEmailSchema.js";
import { Op, Sequelize } from "sequelize";
import UserModel from "../models/UserModel.js";
import SpamModel from "../models/SpamModel.js";

const ContactController = express.Router();

ContactController.get("/search/name/:searchQuery", async (req, res) => {
    let { searchQuery } = req.params;

    let startingUsers = await UserModel.findAll({
        attributes: ['name', 'phone', "email", [Sequelize.literal('CASE WHEN spams.phone IS NOT NULL THEN TRUE ELSE FALSE END'), 'isSpam']],
        distinct: true,
        where: {
            name: {
                [Op.like]: `${searchQuery}%`,
            }
        },
        include: [
            {
                model: SpamModel,
                as: 'spams',
                attributes: [],
                required: false,
                on: {
                    'phone': Sequelize.where(Sequelize.col('user.phone'), '=', Sequelize.col('spams.phone'))
                }
            },
        ],
        order: [["name", "ASC"]]
    });

    let startingContacts = await ContactModel.findAll({
        attributes: ['name', 'phone', "email", [Sequelize.literal('CASE WHEN spams.phone IS NOT NULL THEN TRUE ELSE FALSE END'), 'isSpam']],
        where: {
            name: {
                [Op.like]: `${searchQuery}%`
            }
        },
        include: [
            {
                model: SpamModel,
                as: 'spams',
                attributes: [],
                required: false,
                on: {
                    'phone': Sequelize.where(Sequelize.col('user.phone'), '=', Sequelize.col('spams.phone'))
                }
            }
        ],
        order: [["name", "ASC"]]
    });

    return res.status(200).json({
        date: new Date(),
        data: startingContacts
    });

    let containingUsers = await UserModel.findAll({
        where: {
            name: {
                [Op.notLike]: `${searchQuery}%`,
                [Op.like]: `%${searchQuery}%`
            }
        },
        attributes: ["name", "phone", "email"],
        order: [["name", "ASC"]]
    });

    let containingContacts = await ContactModel.findAll({
        where: {
            name: {
                [Op.notLike]: `${searchQuery}%`,
                [Op.like]: `%${searchQuery}%`
            }
        },
        attributes: ["name", "phone", "email"],
        order: [["name", "ASC"]]
    });

    const combinedResults = startingUsers.concat(startingContacts, containingUsers, containingContacts);

    return res.status(200).json({
        date: new Date(),
        data: combinedResults
    });
});

ContactController.get("/", (req, res) => {
    ContactModel.findAndCountAll().then((result) => {
        return res.status(200).json({
            date: new Date(),
            data: result
        });
    }).catch((e) => {
        return res.status(400).json({
            dateTime: new Date(),
            message: e.message,
            errors: e,
        });
    });
});


ContactController.post("/", async (req, res, next) => {
    const { name, phone, email } = req.body;
    const user_id = req.user?.id;
    const { error } = contactPostSchema.validate({ user_id, name, phone, email }, { abortEarly: false });
    if (!error) {
        ContactModel.create({ user_id, name, phone, email }).then((result) => {
            return res.status(201).json({
                date: new Date(),
                insertedId: result?.id,
                message: "A new Contact has been created.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "DB Error.",
                error: err
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


ContactController.put("/:id", async (req, res, next) => {
    const { name, phone, email } = req.body;
    const { id } = req.params;
    const user_id = req.user?.id;
    const { error } = contactPutSchema.validate({ id, user_id, name, phone, email }, { abortEarly: false });
    if (!error) {
        ContactModel.update({ user_id, name, phone, email }, { where: { id, user_id } }).then((result) => {
            return res.status(201).json({
                date: new Date(),
                affectedId: id,
                message: "Contact has been updated.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "DB Error.",
                error: err
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


ContactController.patch("/:id/name", async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const user_id = req.user?.id;
    const { error } = contactPatchNameSchema.validate({ id, user_id, name }, { abortEarly: false });
    if (!error) {
        ContactModel.update({ name }, { where: { id, user_id } }).then((result) => {
            return res.status(201).json({
                date: new Date(),
                affectedId: id,
                message: "Contact name has been updated.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "DB Error.",
                error: err
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

ContactController.patch("/:id/phone", async (req, res, next) => {
    const { id } = req.params;
    const { phone } = req.body;
    const user_id = req.user?.id;
    const { error } = contactPatchPhoneSchema.validate({ id, user_id, phone }, { abortEarly: false });
    if (!error) {
        ContactModel.update({ phone }, { where: { id, user_id } }).then((result) => {
            return res.status(201).json({
                date: new Date(),
                affectedId: id,
                message: "Phone number has been updated.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "DB Error.",
                error: err
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

ContactController.patch("/:id/email", async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;
    const user_id = req.user?.id;
    const { error } = contactPatchEmailSchema.validate({ id, user_id, email }, { abortEarly: false });
    if (!error) {
        ContactModel.update({ email }, { where: { id, user_id } }).then((result) => {
            return res.status(201).json({
                date: new Date(),
                affectedId: id,
                message: "Email has been updated.",
            });
        }).catch((err) => {
            return res.status(400).json({
                dateTime: new Date(),
                message: "DB Error.",
                error: err
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


ContactController.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user?.id;

    ContactModel.destroy({ where: { id, user_id }, force: true }).then((result) => {
        return res.status(201).json({
            date: new Date(),
            deletedId: id,
            message: "Contact has been deleted.",
        });
    }).catch((err) => {
        return res.status(400).json({
            dateTime: new Date(),
            message: "DB Error.",
            error: err
        });
    });
});

export default ContactController;