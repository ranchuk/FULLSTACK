const Joi = require("@hapi/joi");
const Subscription = require('../models/subscription');
const Plan = require('../models/plan');
const ValidationError = require('../errors/validation-error');
"use strict"

let validators = {
    "Subscription": {
        scopes: {
            default: Subscription.SubscriptionValidationSchema
        }
    },
    "Plan": Plan.PlanValidationSchema // if only default scope we should write this way (without "scopes" object)
}

function scopeExists(validator, scope) {
    return Object.keys(validator.scopes).find((key)=>key == scope) != undefined;
}

// scopeExists(validators.Subscription, "default") // --> true
// scopeExists(validators.Subscription, "update") // --> false (because "update" not exists)

function getSchema(model, scope) {
    let validator = validators[model];
    if(!validator) {
        throw new Error("Validator does not exist")
    }

    //First check if the given validator has multiple scopes
    if(validator.scopes) {
        //If the caller has passed a value for 'scope'
        if(scope) {
            if(!scopeExists(validator, scope)){
                throw new Error (`Scope ${scope} does not exist in ${model} validator`)
            }
            else {
                return validator.scopes[scope]
            }
        }
        else {
            return validator.scopes.default
        }
    }
    else {
        return validator
    }
}

function validate(model, object, scope) {
    const schema = getSchema(model, scope);
    return  schema.validate(object, {
        allowUnknown: true // if its find unknow fields in the object it should ignore them
    })
}

module.exports = function ValidationMiddleware(model, scope) {
    return (req,res, next) => {
        console.log({
            model,
            body: req.body
        })
        const validationResult = validate(model, req.body, scope);
        if(validationResult.error) {
            throw new ValidationError(validationResult.error.message, model);
        }
        else {
            next();
        }
    }
}