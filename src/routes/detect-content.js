import express from "express";
import styled from "../utils/log/styled.js";

const router = express.Router();

const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: true });

function detectContentType(req, res, next) {
  const contentType = req.headers['content-type'];

  if (contentType === 'application/json') {
    return jsonParser(req, res, next);
  } else if (contentType === 'application/x-www-form-urlencoded') {
    return urlencodedParser(req, res, next);
  } else {
    return next();
  }
}

router.use(detectContentType);

router.post('/detect-content', (req, res) => {
  if (req.body) {
    res.json(req.body);
    styled.infodir(req.body);
  } else {
    styled.error('Body is required');
    res.status(400).json({ error: 'Body is required' });
  }
});

export default router;