import express, { Router } from 'express';
import boletinRoutes from "./boletines";

const router = Router();
router.use(express.json());

router.use("/boletines", boletinRoutes);

export default router