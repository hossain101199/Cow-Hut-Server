"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    cow: { type: mongoose_1.Schema.Types.ObjectId, ref: 'cow', required: true },
    buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Order = (0, mongoose_1.model)('order', orderSchema);
