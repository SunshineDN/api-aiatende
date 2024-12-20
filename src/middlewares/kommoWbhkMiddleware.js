import styled from "../utils/log/styledLog.js";

export default function kommoWbhkMiddleware(req, _, next) {
  if (req.method === 'GET') {
    styled.middleware('[ Kommo - Webhook ] Request Method:', req.method);
    styled.middleware('[ Kommo - Webhook ] Request route:', req.originalUrl);
    return next();
  }

  const { message, account } = req?.body;
  const account_id = account?.id;
  const account_subdomain = account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;
  const { add: { 0: { id: message_id, chat_id, talk_id, contact_id, text, created_at, attachment, entity_type, element_id: lead_id, entity_id, author, origin } } } = message;

  req.body = {
    account: {
      account_id,
      account_subdomain,
      account_domain,
    },
    author,
    contact_id,
    chat_id,
    created_at,
    entity_id,
    entity_type,
    lead_id,
    message_id,
    origin,
    talk_id,
    text,
    attachment,
  };

  styled.middleware('[ Kommo - Webhook ] Request Method:', req.method);
  styled.middleware('[ Kommo - Webhook ] Request route:', req.originalUrl);
  styled.middleware('[ Kommo - Webhook ] Request Body:');
  styled.middlewaredir(req.body);
  styled.middleware('[ Kommo - Webhook ] ID do lead:', lead_id);
  next();
}