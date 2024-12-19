import express from 'express';
import styled from '../utils/log/styledLog.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use((req, _, next) => {
  styled.info('Middleware após o express.urlencoded');
  styled.infodir(req.body);
  const { leads, account } = req.body;
  const lead_id = leads?.status?.[0]?.id || leads?.add?.[0]?.id;
  const old_status_id = leads?.status?.[0]?.old_status_id || leads?.add?.[0]?.old_status_id;
  const old_pipeline_id = leads?.status?.[0]?.old_pipeline_id || leads?.add?.[0]?.old_pipeline_id;
  const status_id = leads?.status?.[0]?.status_id || leads?.add?.[0]?.status_id;
  const pipeline_id = leads?.status?.[0]?.pipeline_id || leads?.add?.[0]?.pipeline_id;
  const account_id = account?.id;
  const account_subdomain = account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;

  styled.info('Dados extraídos do body:');
  styled.infodir({
    lead_id,
    old_status_id,
    old_pipeline_id,
    status_id,
    pipeline_id,
    account_id,
    account_subdomain,
    account_domain,
  });
  next();
})

router.get('/get', (_, res) => {
  res.send('Rota GET /get');
}) 

router.post('/', (_, res) => {
  res.send('Rota POST /');
})

export default router;