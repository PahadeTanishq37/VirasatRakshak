import { Router } from 'express';
import { getAllHeritageSites, getHeritageSiteById } from '../controllers/heritage.controller.js';

const router = Router();

router.get('/heritage', getAllHeritageSites);
router.get('/heritage/:id', getHeritageSiteById);

export default router;
