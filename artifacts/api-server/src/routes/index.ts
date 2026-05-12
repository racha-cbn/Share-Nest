import { Router } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";

const router = Router();

router.use("/healthz", healthRouter);
router.use("/posts", postsRouter);

export default router;
