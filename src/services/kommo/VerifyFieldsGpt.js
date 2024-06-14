const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');

const VerifyFieldsGpt = async (payload, res, access_token = null) => {

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const custom_fields = await GetCustomFields(payload, access_token);
    const exist_fields = [
      {
        id: 1366386,
        name: 'GPT | Prompt',
        type: 'textarea',
      },
      {
        id: 1366388,
        name: 'GPT | Answer',
        type: 'textarea',
      },
      {
        id: 1366390,
        name: 'GPT | Answer Received?',
        type: 'checkbox',
      },
      {
        id: 1366392,
        name: 'GPT | On/Off',
        type: 'checkbox',
      },
      {
        id: 1366396,
        name: 'GPT | LOG',
        type: 'textarea',
      },
      {
        id: 1366398,
        name: 'GPT | Message received',
        type: 'textarea',
      },
      {
        id: 1366796,
        name: 'GPT | Moved?',
        type: 'checkbox',
      },
      {
        id: 1368238,
        name: 'GPT | IsTime',
        type: 'checkbox',
      },
      {
        id: 1368242,
        name: 'GPT | Data e Hora Atual',
        type: 'date_time',
      },
      {
        id: 1368310,
        name: 'GPT | Dia da Semana',
        type: 'text',
      },
      {
        id: 1368244,
        name: 'GPT | IsRunning',
        type: 'checkbox',
      },
      {
        id: 1368312,
        name: 'GPT | Sent Audio',
        type: 'checkbox',
      },
      {
        id: 1368314,
        name: 'GPT | Audio Received?',
        type: 'checkbox',
      },
      {
        id: 1368240,
        name: 'GPT | Mensagem Cliente',
        type: 'textarea',
      },
      {
        id: 1369030,
        name: 'GPT | Restart',
        type: 'checkbox',
      },
      {
        id: 1368246,
        name: 'Event Link',
        type: 'url',
      },
      {
        id: 1368248,
        name: 'Event ID',
        type: 'text',
      },
      {
        id: 1368250,
        name: 'Event Summary',
        type: 'text',
      },
      {
        id: 1368252,
        name: 'Event Start',
        type: 'text',
      },
      {
        id: 1368254,
        name: 'Datas ocupadas',
        type: 'textarea',
      },
      {
        id: 1368256,
        name: 'Datas disponíveis',
        type: 'textarea',
      },
      {
        id: 1368258,
        name: 'Is Scheduled',
        type: 'checkbox',
      },
      {
        id: 1368260,
        name: 'First Attempt',
        type: 'checkbox',
      },
      {
        id: 1368404,
        name: 'Scheduling field 1',
        type: 'text',
      },
      {
        id: 1368406,
        name: 'Scheduling field 2',
        type: 'text',
      },
      {
        id: 1368408,
        name: 'Scheduling field 3',
        type: 'text',
      },
      {
        id: 1369084,
        name: 'Scheduling field 4',
        type: 'text',
      },
      {
        id: 1368302,
        name: 'Registration Data',
        type: 'textarea',
      },
      {
        id: 1368228,
        name: 'Field 1',
        type: 'text',
      },
      {
        id: 1368230,
        name: 'Field 2',
        type: 'text',
      },
      {
        id: 1368232,
        name: 'Field 3',
        type: 'text',
      },
      {
        id: 1368366,
        name: 'Field 4',
        type: 'text',
      },
      {
        id: 1368388,
        name: 'Field 5',
        type: 'text',
      },
      {
        id: 1368390,
        name: 'Field 6',
        type: 'text',
      },
      {
        id: 1368304,
        name: 'Return Data',
        type: 'checkbox',
      },
      {
        id: 1368308,
        name: 'All Data Filled',
        type: 'checkbox',
      },
      {
        id: 1368224,
        name: 'Nome Completo',
        type: 'text',
      },
      {
        id: 1369086,
        name: 'E-mail (Texto)',
        type: 'text',
      },
      {
        id: 1361676,
        name: 'Data de Nascimento (Texto)',
        type: 'text',
      },
      {
        id: 1361566,
        name: 'Bairro',
        type: 'text',
      },
      {
        id: 1369088,
        name: 'Dados Cadastrais',
        type: 'url',
      },
      {
        id: 1361568,
        name: 'Motivo Consulta',
        type: 'select',
        enums: [
          {
            id: 911008,
            value: 'Urgência | Emergência',
            sort: 1
          },
          {
            id: 911010,
            value: 'Avaliação Geral',
            sort: 2
          },
          {
            id: 911012,
            value: 'Lentes | Facetas',
            sort: 3
          },
          {
            id: 911014,
            value: 'Implantes | Protocolo',
            sort: 4
          },
          {
            id: 911016,
            value: 'Prótese | Coroas',
            sort: 5
          },
          {
            id: 911018,
            value: 'Ortodontia | Invisalign',
            sort: 6
          },
          {
            id: 911020,
            value: 'HOF | BOTOX',
            sort: 7
          },
          {
            id: 911022,
            value: 'Kids | Crianças',
            sort: 8
          },
          {
            id: 911024,
            value: 'Tratamento de Canal',
            sort: 9
          },
          {
            id: 911026,
            value: 'Extração | Sisos',
            sort: 10
          },
          {
            id: 911028,
            value: 'Clareamento',
            sort: 11
          },
          {
            id: 911030,
            value: 'Clínica Básica',
            sort: 12
          },
          {
            id: 917348,
            value: 'Consulta Inicial',
            sort: 500
          }
        ]
      },
    ];
    const missing_fields = exist_fields.filter((field) => { return !custom_fields.some((custom_field) => custom_field.name === field.name); });
    
    return res.status(200).json({ missing_fields });

  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
};

module.exports = VerifyFieldsGpt;
