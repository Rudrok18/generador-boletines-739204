import { Router } from 'express';
import multer from 'multer';
import { getBoletinById } from '../controllers/getboletin.controller';
const router = Router();

router.get('/:boletinID', getBoletinById);

export default router;