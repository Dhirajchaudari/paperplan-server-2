import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  required?: boolean;
  validate?: (value: any, body: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function validateBody(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const key of Object.keys(schema)) {
      const value = req.body[key];
      const rule = schema[key];

      if (rule.required) {
        if (value === undefined || value === null || value === '') {
          res.status(400).json({ error: `${key} is required` });
          return;
        }
      }

      if (value !== undefined && value !== null && rule.validate) {
        const validationResult = rule.validate(value, req.body);
        if (validationResult !== true) {
          const errorMsg =
            typeof validationResult === 'string' ? validationResult : `Invalid value for field: ${key}`;
          res.status(400).json({ error: errorMsg });
          return;
        }
      }
    }
    next();
  };
}
