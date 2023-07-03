"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const cow_model_1 = require("../modules/cow/cow.model");
const verifySeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(401, 'Unauthorized: No token provided');
        }
        // Verify the token using the jwt.verify function
        const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        // Retrieve the cow ID from the request parameters
        const { id } = req.params;
        // // Find the cow by ID
        const cow = yield cow_model_1.Cow.findOne({ _id: id, seller: verifiedToken.id });
        if (!cow) {
            throw new ApiError_1.default(403, 'You are not authorized to perform this action');
        }
        // If the user is authorized, call the next middleware or route handler
        next();
    }
    catch (error) {
        // Handle any errors that occur during verification
        next(error);
    }
});
exports.default = verifySeller;
