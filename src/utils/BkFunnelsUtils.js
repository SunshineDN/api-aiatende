export default class BkFunnelsUtils {
  static identifyAnswer(obj) {
    if (obj.answers.length === 0) {
      const { name, email, phone, datanascimento, bairro } = obj;
      return {
        type: 'lead',
        value: {
          name: name || '',
          email: email || '',
          phone: phone || '',
          datanascimento: datanascimento || '',
          bairro: bairro || '',
        }
      }
    } else {
      const { answers: [answer] } = obj;
      const answerLower = answer.toLowerCase();
      if (answerLower.includes('dentista') && answerLower.includes('especialista')) {
        return {
          type: 'dentista',
          value: 'Demais Dentistas',
        }
      } else if (answerLower.includes('dra') && answerLower.includes('juliana') && answerLower.includes('leite')) {
        return {
          type: 'dentista',
          value: 'Dra. Juliana Leite',
        }
      } else if (answerLower.includes('dra') && answerLower.includes('lucília')) {
        return {
          type: 'dentista',
          value: 'Dra. Lucília Miranda',
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
      } else if (answer === 'Nesta Semana (Até Sábado)') {
        return {
          type: 'periodo',
          value: 'Nesta Semana (Até Sábado)',
        }
      } else if (answer === 'Próxima Semana (A partir de Segunda)') {
        return {
          type: 'periodo',
          value: 'Próxima Semana (A partir de Segunda)',
        }
      } else if (answer === 'Escolha o dia') {
        return {
          type: 'periodo',
          value: 'Escolha o dia',
        }
      } else if (answer === 'Manhã (8h às 12h)') {
        return {
          type: 'turno',
          value: 'Manhã (8h às 12h)',
        }
      } else if (answer === 'Tarde (14h às 18h)') {
        return {
          type: 'turno',
          value: 'Tarde (14h às 18h)',
        }
      } else if (answer === 'Noite (18h às 20h)') {
        return {
          type: 'turno',
          value: 'Noite (18h às 20h)'
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