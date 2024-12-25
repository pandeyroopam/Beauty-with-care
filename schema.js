const Joi = require('joi');

module.exports.BlogPostSchema = Joi.object({
    BlogPost : Joi.object({
       title: Joi.string().required(),
       content: Joi.string().required(),
       image: Joi.string().optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});