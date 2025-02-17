"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WordController_1 = require("../controllers/WordController");
const validateRequest_1 = require("../middleware/validateRequest");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.get('/', (0, validateRequest_1.validateRequest)(schemas_1.paginationSchema), WordController_1.WordController.getWords);
router.get('/:id', (0, validateRequest_1.validateRequest)(schemas_1.idParamSchema), WordController_1.WordController.getWord);
router.post('/', (0, validateRequest_1.validateRequest)(schemas_1.wordSchema), WordController_1.WordController.createWord);
exports.default = router;
