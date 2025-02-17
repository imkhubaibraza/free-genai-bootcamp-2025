"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const router = (0, express_1.Router)();
router.get('/last_study_session', DashboardController_1.DashboardController.getLastStudySession);
router.get('/study_progress', DashboardController_1.DashboardController.getStudyProgress);
router.get('/quick-stats', DashboardController_1.DashboardController.getQuickStats);
exports.default = router;
