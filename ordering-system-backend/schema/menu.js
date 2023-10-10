const joi = require('joi')

const id = joi.number().integer().min(0).required()

exports.menu_schema = {
    params: {
        id
    }
}