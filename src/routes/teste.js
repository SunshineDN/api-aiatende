import express from 'express';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware)

router.get('/get', (_, res) => {
  res.send('Rota GET /get');
});

router.post('/', (req, res) => {
  res.json(req.body);
});

export default router;