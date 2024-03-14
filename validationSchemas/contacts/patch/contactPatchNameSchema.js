import Joi from "joi";

const contactPatchNameSchema = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    name: Joi.string().required()
});


export default contactPatchNameSchema;