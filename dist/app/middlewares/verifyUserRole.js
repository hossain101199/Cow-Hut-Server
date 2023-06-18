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
exports.verifySeller = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = require("../modules/user/user.model");
// Middleware function
const verifySeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.seller;
        // user from the database
        const seller = yield user_model_1.user.findById(userId);
        if (!seller) {
            // User not found
            throw new ApiError_1.default(404, `Error: User with ID ${userId} is not found. Please verify the provided ID and try again`);
        }
        // Check the user's role
        if ((seller === null || seller === void 0 ? void 0 : seller.role) === 'seller') {
            // User is a buyer or seller
            next();
        }
        else {
            // User role is not valid
            throw new ApiError_1.default(403, `Error: Invalid user role`);
        }
    }
    catch (error) {
        // Handle errors
        next(error);
    }
});
exports.verifySeller = verifySeller;
