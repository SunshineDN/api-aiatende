/* {
  "account": {
    "subdomain": "adrianocamposadvogado",
    "id": "33981183",
    "_links": {
      "self": "https://adrianocamposadvogado.amocrm.com"
    }
  },
  "leads": {
    "add": [
      {
        "id": "884518",
        "name": "",
        "status_id": "78658599",
        "price": "0",
        "responsible_user_id": "7421899",
        "last_modified": "1736276949",
        "modified_user_id": "7421899",
        "created_user_id": "7421899",
        "date_create": "1736276949",
        "pipeline_id": "10254811",
        "account_id": "33981183",
        "created_at": "1736276949",
        "updated_at": "1736276949"
      }
    ]
  }
} */

import styled from "../utils/log/styledLog.js";

export default function createLeadMiddleware(req, res, next) {
  const { account, leads } = req.body;

  const { add: [{ id, name, status_id, price, responsible_user_id, last_modified, modified_user_id, created_user_id, date_create, pipeline_id, account_id, created_at, updated_at }] = [] } = leads;

  req.body = {
    account: {
      subdomain: account.subdomain,
      id: Number(account.id),
      account_domain: `https://${account.subdomain}.kommo.com`,
    },
    lead_id: id,
    status_id,
    pipeline_id,
  };

  styled.middleware('\n[ Kommo - Add Lead ] Request Method:', req.method);
  styled.middleware('[ Kommo - Add Lead ] Request route:', req.originalUrl);
  styled.middleware('[ Kommo - Add Lead ] Request Body:');
  styled.middlewaredir(req.body);
  styled.middleware('[ Kommo - Add Lead ] ID do lead:', id);

  next();
}