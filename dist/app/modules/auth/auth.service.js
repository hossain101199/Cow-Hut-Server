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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const createUserInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.role == 'seller') {
        payload.budget = 0;
        payload.income = 0;
    }
    if (payload.role == 'buyer') {
        payload.income = 0;
    }
    const createdUser = yield user_model_1.User.create(payload);
    return createdUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ phoneNumber }, { id: 1, role: 1, password: 1 });
    if (isUserExist) {
        if (yield bcrypt_1.default.compare(password, isUserExist.password)) {
            const { id, role } = isUserExist;
            const accessToken = jsonwebtoken_1.default.sign({
                id,
                role,
            }, config_1.default.jwt.secret, { expiresIn: config_1.default.jwt.expires_in });
            const refreshToken = jsonwebtoken_1.default.sign({
                id,
                role,
            }, config_1.default.jwt.refresh_secret, { expiresIn: config_1.default.jwt.refresh_expires_in });
            return {
                accessToken,
                refreshToken,
            };
        }
        else {
            throw new ApiError_1.default(401, 'Password is incorrect');
        }
    }
    else {
        throw new ApiError_1.default(404, 'User does not exist');
    }
});
const refreshToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jsonwebtoken_1.default.verify(payload, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(403, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    const isUserExist = yield user_model_1.User.findById(id, { id: 1, role: 1 });
    if (!isUserExist) {
        throw new ApiError_1.default(404, 'User does not exist');
    }
    const newAccessToken = jsonwebtoken_1.default.sign({
        id: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, { expiresIn: config_1.default.jwt.expires_in });
    return {
        accessToken: newAccessToken,
    };
});
exports.authService = {
    createUserInDB,
    loginUser,
    refreshToken,
};
