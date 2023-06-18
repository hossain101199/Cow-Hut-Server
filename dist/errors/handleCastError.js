"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (error) => {
    const errors = [
        {
            path: error.path,
            message: 'invalid ID',
        },
    ];
    return {
        statusCode: 400,
        message: 'Cast Error',
        errorMessages: errors,
    };
};
exports.default = handleCastError;
