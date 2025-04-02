import Joi from 'joi';

export const signup = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(16).required(),
    password: Joi.string().trim().min(5).max(16).required()
  })
};

export const signin = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(16).required(),
    password: Joi.string().trim().min(5).max(16).required()
  })
};

export const signout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};
