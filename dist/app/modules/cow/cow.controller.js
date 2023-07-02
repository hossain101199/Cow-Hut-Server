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
exports.cowController = void 0;
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const cow_constant_1 = require("./cow.constant");
const cow_service_1 = require("./cow.service");
const createCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get authorization token
    const token = req.headers.authorization;
    if (!token) {
        throw new ApiError_1.default(401, 'Unauthorized: No token provided');
    }
    const cow = req.body;
    const result = yield cow_service_1.cowService.createCowInDB(token, cow);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cow created successfully',
        data: result,
    });
}));
const getSingleCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield cow_service_1.cowService.getSingleCowFromDB(id);
    if (result === null) {
        throw new ApiError_1.default(404, `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`);
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Cow retrieved successfully',
            data: result,
        });
    }
}));
const updateCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new ApiError_1.default(401, 'Unauthorized: No token provided');
    }
    const { id } = req.params;
    const updatedData = req.body;
    const result = yield cow_service_1.cowService.updateCowInDB(token, id, updatedData);
    if (result === null) {
        throw new ApiError_1.default(404, `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`);
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Cow updated successfully',
            data: result,
        });
    }
}));
const deleteCow = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield cow_service_1.cowService.deleteCowFromDB(id);
    if (result === null) {
        throw new ApiError_1.default(404, `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`);
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Cow deleted successfully',
            data: result,
        });
    }
}));
const getAllCows = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, cow_constant_1.cowFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield cow_service_1.cowService.getAllCowsFromDB(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cow retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.cowController = {
    createCow,
    getSingleCow,
    updateCow,
    deleteCow,
    getAllCows,
};
