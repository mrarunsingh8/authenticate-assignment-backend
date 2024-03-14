import Joi from "joi";

const contactPatchEmailSchema = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    email: Joi.string().email().allow(null, '').required()
});


export default contactPatchEmailSchema;