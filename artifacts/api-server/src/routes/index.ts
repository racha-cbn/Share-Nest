import { Router } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import authRouter from "./auth";
import messagesRouter from "./messages";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/messages", messagesRouter);

export default router;
