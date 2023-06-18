"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = exports.label = exports.location = void 0;
// cow.interface.ts
var location;
(function (location) {
    location["Dhaka"] = "Dhaka";
    location["Chattogram"] = "Chattogram";
    location["Barishal"] = "Barishal";
    location["Rajshahi"] = "Rajshahi";
    location["Sylhet"] = "Sylhet";
    location["Comilla"] = "Comilla";
    location["Rangpur"] = "Rangpur";
    location["Mymensingh"] = "Mymensingh";
})(location || (exports.location = location = {}));
var label;
(function (label) {
    label["ForSale"] = "for sale";
    label["SoldOut"] = "sold out";
})(label || (exports.label = label = {}));
var category;
(function (category) {
    category["Dairy"] = "Dairy";
    category["Beef"] = "Beef";
    category["DualPurpose"] = "Dual Purpose";
})(category || (exports.category = category = {}));
