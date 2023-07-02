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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const admin_model_1 = require("./admin.model");
const createAdminInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAdmin = yield admin_model_1.Admin.create(payload);
    return createdAdmin;
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield admin_model_1.Admin.findOne({ phoneNumber }, { id: 1, role: 1, password: 1 });
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
        throw new ApiError_1.default(404, 'Admin does not exist');
    }
});
const getProfileFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jsonwebtoken_1.default.verify(payload, config_1.default.jwt.secret);
    if (verifiedToken) {
        const result = yield admin_model_1.Admin.findById(verifiedToken.id);
        return result;
    }
    else {
        throw new ApiError_1.default(403, 'Forbidden');
    }
});
const updateProfileInDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    const { name, password } = payload, adminData = __rest(payload, ["name", "password"]);
    const updatedUserData = Object.assign({}, adminData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedUserData[nameKey] = name[key];
        });
    }
    if (password) {
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
        updatedUserData.password = hashedPassword;
    }
    if (verifiedToken) {
        const result = yield admin_model_1.Admin.findByIdAndUpdate(verifiedToken.id, updatedUserData, {
            new: true,
        });
        return result;
    }
    else {
        throw new ApiError_1.default(403, 'Forbidden');
    }
});
exports.adminService = {
    createAdminInDB,
    loginAdmin,
    getProfileFromDB,
    updateProfileInDB,
};
