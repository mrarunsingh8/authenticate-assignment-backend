import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional()
});


export default registerSchema;