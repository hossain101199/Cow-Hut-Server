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
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const cow_interface_1 = require("../cow/cow.interface");
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const createOrderInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { buyer } = payload;
        const { cow } = payload;
        // Find the cow to be purchased
        const selectedCow = yield cow_model_1.cow
            .findOne({
            _id: cow,
            label: 'for sale',
        })
            .session(session);
        if (!selectedCow) {
            throw new ApiError_1.default(400, `Error: Invalid cow or not available for sale.`);
        }
        // Find the buyer
        const selectedBuyer = yield user_model_1.user
            .findOne({ _id: buyer, role: 'buyer' })
            .session(session);
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
        const seller = yield user_model_1.user.findById(selectedCow.seller).session(session);
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
        payload.buyer = selectedBuyer;
        payload.cow = selectedCow;
        const createdOrder = (yield order_model_1.order.create(payload)).populate([
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
const getAllOrdersFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield order_model_1.order
        .find()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate([
        { path: 'cow', populate: { path: 'seller' } },
        { path: 'buyer' },
    ]);
    const total = yield order_model_1.order.countDocuments().limit(limit);
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
    getAllOrdersFromDB,
};
