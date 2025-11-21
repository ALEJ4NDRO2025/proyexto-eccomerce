import express from "express";
import { registrarUsers } from "../controllers/usercontroles.js";

const router = express.Router();

router.post("/", registrarUsers);

export default router;
