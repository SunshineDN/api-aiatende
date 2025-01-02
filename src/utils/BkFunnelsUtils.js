export default class BkFunnelsUtils {
  static identifyAnswer(obj) {
    if (obj.answers.length === 0) {
      const { name, email, phone, datanascimento } = obj;
      return {
        type: 'lead',
        value: {
          name: name || '',
          email: email || '',
          phone: phone || '',
          datanascimento: datanascimento || '',
        }
      }
    } else {
      const { answers: [answer] } = obj;
      if (answer === '1 - Dentistas EspecialistasExclusivo na Primeira Consulta(novos clientes) Sem Custos') {
        return {
          type: 'dentista',
          value: 'Demais Dentistas',
        }
      } else if (answer === '2 - Dra. Juliana LeiteReabilitação Oral e Estética do SorrisoInvestimento de R$ 120,00') {
        return {
          type: 'dentista',
          value: 'Dra. Juliana Leite',
        }
      } else if (answer === '3 - OdontopediatriaConsulta de Crianças até 12 anosInvestimento de R$ 99,00') {
        return {
          type: 'dentista',
          value: 'Odontopediatria',
        }
      } else if (answer === 'Odontopediatria') {
        return {
          type: 'procedimento',
          value: 'Odontopediatria',
        }
      } else if (answer === 'Clareamento') {
        return {
          type: 'procedimento',
          value: 'Clareamento',
        }
      } else if (answer === 'Consulta de Rotina') {
        return {
          type: 'procedimento',
          value: 'Consulta de Rotina',
        }
      } else if (answer === 'Invisalign') {
        return {
          type: 'procedimento',
          value: 'Invisalign',
        }
      } else if (answer === 'Lentes de Contato') {
        return {
          type: 'procedimento',
          value: 'Lentes de Contato',
        }
      } else if (answer === 'Implante e Prótese') {
        return {
          type: 'procedimento',
          value: 'Implante e Prótese',
        }
      } else if (answer === 'HOF') {
        return {
          type: 'procedimento',
          value: 'HOF',
        }
      } else if (answer === 'Prótese Protocolo') {
        return {
          type: 'procedimento',
          value: 'Prótese Protocolo',
        }
      } else if (answer === 'Ortognática') {
        return {
          type: 'procedimento',
          value: 'Ortognática',
        }
      } else if (answer === 'Extração Dente Siso') {
        return {
          type: 'procedimento',
          value: 'Extração Dente Siso',
        }
      } else if (answer === 'Tratamento de Canal') {
        return {
          type: 'procedimento',
          value: 'Tratamento de Canal',
        }
      } else if (answer === 'Gengivoplastia') {
        return {
          type: 'procedimento',
          value: 'Gengivoplastia',
        }
      } else {
        return {
          type: 'not_found',
          value: ''
        }
      }
    }
  }
};