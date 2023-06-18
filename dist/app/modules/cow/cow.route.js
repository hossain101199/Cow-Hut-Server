"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyUserRole_1 = require("../../middlewares/verifyUserRole");
const cow_controller_1 = require("./cow.controller");
const router = express_1.default.Router();
router.post('/', verifyUserRole_1.verifySeller, cow_controller_1.cowController.createCow);
router.get('/:id', cow_controller_1.cowController.getSingleCow);
router.patch('/:id', cow_controller_1.cowController.updateCow);
router.delete('/:id', cow_controller_1.cowController.deleteCow);
router.get('/', cow_controller_1.cowController.getAllCows);
exports.cowRoutes = router;
