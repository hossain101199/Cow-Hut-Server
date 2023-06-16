import mongoose from 'mongoose';

import { IGenericErrorResponse } from '../interfaces/common';
import IGenericErrorMessage from '../interfaces/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    element => {
      return {
        path: element?.path,
        message: element?.message,
      };
    }
  );

  return {
    statusCode: 400,
    message: 'validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
