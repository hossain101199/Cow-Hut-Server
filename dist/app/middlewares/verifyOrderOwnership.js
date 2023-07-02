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
const user_1 = require("../../enums/user");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const order_model_1 = require("../modules/order/order.model");
const verifyOrderOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = req.headers.authorization;
    const { id } = req.params;
    try {
        if (!token) {
            throw new ApiError_1.default(401, 'Unauthorized: No token provided');
        }
        // Verify the token using the jwt.verify function
        const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        const order = yield order_model_1.Order.findById(id).populate([
            { path: 'cow', populate: { path: 'seller' } },
            { path: 'buyer' },
        ]);
        if (!order) {
            throw new Error(`Order with ID ${id} is not found.`);
        }
        const cow = order.cow;
        const buyer = order.buyer;
        if ((verifiedToken.role === user_1.ENUM_USER_ROLE.SELLER &&
            ((_a = cow.seller._id) === null || _a === void 0 ? void 0 : _a.toString()) !== verifiedToken.id) ||
            (verifiedToken.role === user_1.ENUM_USER_ROLE.BUYER &&
                ((_b = buyer._id) === null || _b === void 0 ? void 0 : _b.toString()) !== verifiedToken.id)) {
            throw new Error('You are not authorized to access this order.');
        }
        next();
    }
    catch (error) {
        // Handle any errors that occur during verification
        next(error);
    }
});
exports.default = verifyOrderOwnership;
