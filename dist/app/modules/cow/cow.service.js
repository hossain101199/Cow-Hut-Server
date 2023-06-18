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
exports.cowService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../user/user.model");
const cow_constant_1 = require("./cow.constant");
const cow_model_1 = require("./cow.model");
const createCowInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdCow = (yield cow_model_1.cow.create(payload)).populate('seller');
    return createdCow;
});
const getSingleCowFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.cow.findById(id).populate('seller');
    return result;
});
const updateCowInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = payload.seller;
    if (userId) {
        // user from the database
        const seller = yield user_model_1.user.findById(userId);
        if (!seller) {
            // User not found
            throw new ApiError_1.default(404, `Error: User with ID ${userId} is not found. Please verify the provided ID and try again`);
        }
        // Check the user's role
        if (seller.role !== 'seller') {
            // User is a buyer or seller
            throw new ApiError_1.default(403, `Error: Invalid user role`);
        }
    }
    const result = yield cow_model_1.cow
        .findByIdAndUpdate(id, payload, {
        new: true,
    })
        .populate('seller');
    return result;
});
const deleteCowFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.cow.findByIdAndDelete(id).populate('seller');
    return result;
});
const getAllCowsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, minPrice, maxPrice } = filters, filtersData = __rest(filters, ["searchTerm", "minPrice", "maxPrice"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (minPrice && maxPrice) {
        andConditions.push({
            price: {
                $gte: minPrice,
                $lte: maxPrice,
            },
        });
    }
    else if (minPrice) {
        andConditions.push({
            price: {
                $gte: minPrice,
            },
        });
    }
    else if (maxPrice) {
        andConditions.push({
            price: {
                $lte: maxPrice,
            },
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield cow_model_1.cow
        .find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate('seller');
    const total = yield cow_model_1.cow.countDocuments(whereConditions).limit(limit);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.cowService = {
    createCowInDB,
    getSingleCowFromDB,
    updateCowInDB,
    deleteCowFromDB,
    getAllCowsFromDB,
};
