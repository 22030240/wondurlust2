const joi=require("joi");
module.exports.listingSchema=joi.object({
    Listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required(),
        location: joi.string().required().min(0),
        image:joi.string().allow("", null),
       

    }).required(),
})

module.exports.reviewSchema=joi.object({
    Review:joi.object({
        name:joi.string().required(),
        rating:joi.number().required(),
        comment:joi.string().required(),

    }).required()
})