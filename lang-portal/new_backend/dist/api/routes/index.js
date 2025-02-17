"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const wordRoutes_1 = __importDefault(require("./wordRoutes"));
const groupRoutes_1 = __importDefault(require("./groupRoutes"));
const studyRoutes_1 = __importDefault(require("./studyRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const studyActivityRoutes_1 = __importDefault(require("./studyActivityRoutes"));
function setupRoutes(app) {
    app.use('/api/words', wordRoutes_1.default);
    app.use('/api/groups', groupRoutes_1.default);
    app.use('/api/study_sessions', studyRoutes_1.default);
    app.use('/api/dashboard', dashboardRoutes_1.default);
    app.use('/api/study_activities', studyActivityRoutes_1.default);
}
