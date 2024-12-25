import styled from "../utils/log/styledLog.js";

export default function kommoMiddleware(req, _, next) {
  if (req.method === 'GET') {
    styled.middleware('[ Kommo ] Request Method:', req.method);
    styled.middleware('[ Kommo ] Request route:', req.originalUrl);
    return next();
  }

  const { leads, account } = req?.body;
  const lead_id = leads?.status?.[0]?.id || leads?.add?.[0]?.id;
  const old_status_id = leads?.status?.[0]?.old_status_id || leads?.add?.[0]?.old_status_id;
  const old_pipeline_id = leads?.status?.[0]?.old_pipeline_id || leads?.add?.[0]?.old_pipeline_id;
  const status_id = leads?.status?.[0]?.status_id || leads?.add?.[0]?.status_id;
  const pipeline_id = leads?.status?.[0]?.pipeline_id || leads?.add?.[0]?.pipeline_id;
  const account_id = account?.id;
  const account_subdomain = account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;

  req.body = {
    lead_id,
    old_status_id,
    old_pipeline_id,
    status_id,
    pipeline_id,
    account_id,
    account_subdomain,
    account_domain,
  };

  styled.middleware('[ Kommo ] Request Method:', req.method);
  styled.middleware('[ Kommo ] Request route:', req.originalUrl);
  styled.middleware('[ Kommo ] Request Body:');
  styled.middlewaredir(req.body);
  styled.middleware('[ Kommo ] ID do lead:', lead_id);

  next();
}