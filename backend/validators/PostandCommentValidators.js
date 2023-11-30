import { body, validationResult } from 'express-validator';

export const postValidation = [
  body('message').trim().notEmpty().withMessage('Post message cannot be empty'),
];

export const commentValidation = [
  body('message').trim().notEmpty().withMessage('Comment message cannot be empty'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
