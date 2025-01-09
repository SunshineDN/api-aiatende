import express from 'express';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';
import messageReceivedMiddleware from '../middlewares/messageReceivedMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.get('/get', kommoMiddleware, (_, res) => {
  res.send('Rota GET /get');
});

router.post('/', kommoMiddleware, (req, res) => {
  res.json(req.body);
});

router.post('/webhook',messageReceivedMiddleware, (req, res) => {
  res.json(req.body);
});

export default router;