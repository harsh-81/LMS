import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
    addBook,
    deleteBook,
    getAllBook,
} from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBook);
router.delete("/delete/:id", isAuthenticated, "Authorized", deleteBook);

export default router;