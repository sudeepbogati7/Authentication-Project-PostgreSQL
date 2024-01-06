import { Response, Request } from "express";
import * as Joi from 'joi';
import * as express from 'express';

export const validateUserRegistration = (req: Request, res: Response, next: express.NextFunction) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(25).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details.map((detail) => detail.message) });
    }
  
    next();
  };