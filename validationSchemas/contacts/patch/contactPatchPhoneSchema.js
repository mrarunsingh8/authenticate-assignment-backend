import Joi from "joi";

const contactPatchPhoneSchema = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    phone: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
});


export default contactPatchPhoneSchema;