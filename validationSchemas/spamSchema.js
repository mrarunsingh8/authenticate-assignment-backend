import Joi from "joi";

const spamSchema = Joi.object({
    phone: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
});


export default spamSchema;