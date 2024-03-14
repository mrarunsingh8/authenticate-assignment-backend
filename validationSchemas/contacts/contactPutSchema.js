import Joi from "joi";

const contactPutSchema = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    phone: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    email: Joi.string().email().allow(null, '').optional()
});


export default contactPutSchema;