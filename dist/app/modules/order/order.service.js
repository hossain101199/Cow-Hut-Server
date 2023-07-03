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
exports.orderService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const cow_interface_1 = require("../cow/cow.interface");
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const createOrderInDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { cow } = payload;
        // Find the cow to be purchased
        const selectedCow = yield cow_model_1.Cow.findOne({
            _id: cow,
            label: 'for sale',
        }).session(session);
        if (!selectedCow) {
            throw new ApiError_1.default(400, `Error: Invalid cow or not available for sale.`);
        }
        // Find the buyer
        const selectedBuyer = yield user_model_1.User.findOne({
            _id: verifiedToken.id,
            role: 'buyer',
        }).session(session);
        if (!selectedBuyer) {
            // User role is not valid
            throw new ApiError_1.default(400, `Error: Invalid buyer or insufficient role.`);
        }
        if (selectedBuyer.budget < selectedCow.price) {
            throw new ApiError_1.default(400, `Error: Insufficient funds.`);
        }
        // Deduct the cost from the buyer's budget
        selectedBuyer.budget -= selectedCow.price;
        // Save the updated buyer document
        yield selectedBuyer.save();
        const seller = yield user_model_1.User.findById(selectedCow.seller).session(session);
        if (seller) {
            // Add the cost to the seller's income
            seller.income += selectedCow.price;
            // Save the updated seller document
            yield seller.save();
        }
        // Update the cow's status to 'Sold Out'
        selectedCow.label = cow_interface_1.label.SoldOut;
        // Save the updated cow document
        yield selectedCow.save();
        payload.buyer = selectedBuyer.id;
        payload.cow = selectedCow.id;
        const createdOrder = (yield order_model_1.Order.create(payload)).populate([
            { path: 'cow', populate: { path: 'seller' } },
            { path: 'buyer' },
        ]);
        yield session.commitTransaction();
        yield session.endSession();
        return createdOrder;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id).populate([
        { path: 'cow', populate: { path: 'seller' } },
        { path: 'buyer' },
    ]);
    return result;
});
const getAllOrdersFromDB = (token, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions = {};
    // Check the role of the verified token
    if (verifiedToken.role === 'buyer') {
        // If the role is 'buyer', find orders where the buyer field matches the verifiedToken.id
        whereConditions.buyer = verifiedToken.id;
    }
    else if (verifiedToken.role === 'seller') {
        // If the role is 'seller', find orders by populating the 'cow' field and matching the seller's id
        whereConditions.cow = {
            $in: yield cow_model_1.Cow.find({ seller: verifiedToken.id }).distinct('_id'),
        };
    }
    const result = yield order_model_1.Order.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate([
        { path: 'cow', populate: { path: 'seller' } },
        { path: 'buyer' },
    ]);
    const total = yield order_model_1.Order.countDocuments(whereConditions).limit(limit);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.orderService = {
    createOrderInDB,
    getSingleOrderFromDB,
    getAllOrdersFromDB,
};
