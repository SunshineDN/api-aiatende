const styled = require('../utils/log/styledLog');

function subdividirPropriedades(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const keys = key.split(/[[\]]+/).filter(Boolean);
      let tempObj = newObj;
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          tempObj[keys[i]] = obj[key];
        } else {
          tempObj[keys[i]] = tempObj[keys[i]] || {};
          tempObj = tempObj[keys[i]];
        }
      }
    }
  }
  return newObj;
};

const decodeLeadURI = (uri) => {
  const decodedPayload = decodeURIComponent(uri);
  const payloadArray = decodedPayload.split('&');
  const payloadObj = {};

  payloadArray.forEach((item) => {
    const [key, value] = item.split('=');
    const keyArray = key.split('%5B');
    let obj = payloadObj;

    keyArray.forEach((key, index) => {
      if (index === keyArray.length - 1) {
        obj[key] = value;
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    });
  });

  const props = subdividirPropriedades(payloadObj);

  const { leads, account } = props;
  const lead_id = leads?.status?.[0]?.id || leads?.add?.[0]?.id;
  const old_status_id = leads?.status?.[0]?.old_status_id || leads?.add?.[0]?.old_status_id;
  const old_pipeline_id = leads?.status?.[0]?.old_pipeline_id || leads?.add?.[0]?.old_pipeline_id;
  const status_id = leads?.status?.[0]?.status_id || leads?.add?.[0]?.status_id;
  const pipeline_id = leads?.status?.[0]?.pipeline_id || leads?.add?.[0]?.pipeline_id;
  const account_id = account?.id;
  const account_subdomain = account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;

  return {
    lead_id,
    old_status_id,
    old_pipeline_id,
    status_id,
    pipeline_id,
    account: {
      id: Number(account_id),
      subdomain: account_subdomain,
      account_domain
    }
  };
};

const decodeAccoutUri = (uri) => {
  const decodedPayload = decodeURIComponent(uri);
  const payloadArray = decodedPayload.split('&');
  const payloadObj = {};

  payloadArray.forEach((item) => {
    const [key, value] = item.split('=');
    const keyArray = key.split('%5B');
    let obj = payloadObj;

    keyArray.forEach((key, index) => {
      if (index === keyArray.length - 1) {
        obj[key] = value;
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    });
  });

  const props = subdividirPropriedades(payloadObj);

  const accout_id = props?.account?.id;
  const id = props?.message?.add?.[0]?.id;
  const chat_id = props?.message?.add?.[0]?.chat_id;
  const talk_id = props?.message?.add?.[0]?.talk_id;
  const contact_id = props?.message?.add?.[0]?.contact_id;
  const lead_id = props?.message?.add?.[0]?.element_id;
  const account_subdomain = props?.account?.subdomain;
  const account_domain = `https://${account_subdomain}.kommo.com`;
  const type = props?.message?.add?.[0]?.attachment?.type || 'text';
  const text_audio = props?.message?.add?.[0]?.text || props?.message?.add?.[0]?.attachment?.link;

  return {
    id,
    chat_id,
    talk_id,
    contact_id,
    lead_id,
    type,
    text_audio,
    account: {
      id: Number(accout_id),
      subdomain: account_subdomain,
      account_domain
    }
  };
};

module.exports = (req, res, next) => {
  try {
    styled.middleware('Request method: ', req.method);
    styled.middleware('Request URL: ', req.originalUrl);
    if (typeof req.body === 'object') {
      styled.middleware('Request body:');
      styled.middlewaredir(req.body);
    } else {
      styled.middleware('Request body: ', req.body);
    }

    if (req.method === 'GET') {
      return next();
    } else if (!req.body) {
      styled.warning('Body is required');
      return res.status(400).json({ error: 'Body is required' });
    }

    let decoded;
    if (req?.body?.startsWith('account')) {
      decoded = decodeAccoutUri(req.body);
    } else {
      decoded = decodeLeadURI(req.body);
    }
    styled.middleware('Request Lead ID:', decoded.lead_id);
    // console.log('Decoded: ', decoded);
    req.body = decoded;
    next();
  } catch (error) {
    styled.error('Error on decodeKommoURI:', error);
    return res.status(500).json({ error });
  }
};
