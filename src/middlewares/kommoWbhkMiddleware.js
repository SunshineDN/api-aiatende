import styled from "../utils/log/styledLog.js";

export default function kommoWbhkMiddleware(req, _, next) {
  const { message, account } = req?.body;
  const account_id = account?.id;
  const account_subdomain = account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;
  const { add: { 0: { id: message_id, chat_id, talk_id, contact_id, text, created_at, attachment, entity_type, element_id: lead_id, entity_id, author, origin } } } = message;

  req.body = {
    account: {
      id: Number(account_id),
      subdomain: account_subdomain,
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

  styled.middleware('\n [ Kommo - Message Received ] Request Method:', req.method);
  styled.middleware('[ Kommo - Message Received ] Request route:', req.originalUrl);
  styled.middleware('[ Kommo - Message Received ] Request Body:');
  styled.middlewaredir(req.body);
  styled.middleware('[ Kommo - Message Received ] ID do lead:', lead_id);
  next();
}