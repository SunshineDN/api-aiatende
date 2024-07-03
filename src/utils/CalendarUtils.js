const { google } = require('googleapis');
const AuthCalendar = require('./AuthCalendar');
// const serviceAccount = require('../config/serviceAccount.json');

class CalendarUtils {

  constructor(account_id) {
    this.authorization = AuthCalendar.authenticate(account_id);
  };

  async executeListEvents(calendarId) {
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          reject('Erro na autenticação');
        }
        const calendar = google.calendar({ version: 'v3', auth: this.authorization });
        calendar.events.list(
          {
            calendarId: calendarId,
            timeMin: new Date().toISOString(),
            maxResults: 600,
            singleEvents: true,
            orderBy: 'startTime',
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao listar eventos do calendário:', err);
              reject(new Error('Erro ao listar eventos do calendário'));
            }
            const events = result.data.items;
            if (events.length) {
              let string = '';
              string += 'Eventos encontrados:\n';
              events.map((event) => {
                const start = new Date(event.start.dateTime).toLocaleString(
                  'pt-BR',
                  { timeZone: 'America/Sao_Paulo' }
                );
                string += `${start} - ${event.summary}\n`;
                // Calculo para pegar a duracao do evento
                const startDate = new Date(event.start.dateTime);
                const endDate = new Date(event.end.dateTime);
                let duration = (endDate - startDate) / 60000;
                if (duration >= 60) {
                  duration = `${Math.floor(duration / 60)}h${duration % 60}m`;
                }
                string += `Duração: ${duration} minutos\n\n`;
              });
              console.log(string);
              resolve(string);
            } else {
              reject(new Error('Eventos não encontrados.'));
            }
          }
        );
        console.log('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  };

  async executeRegisterEvent(calendarId, eventObj) {
    const createEvent = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação'));
        }
        const calendar = google.calendar({ version: 'v3', auth: this.authorization });
        calendar.events.insert(
          {
            calendarId,
            resource: eventObj,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao adicionar evento:', err);
              reject(new Error('Erro ao adicionar evento'));
            }
            console.log('Evento adicionado:', result.data.htmlLink);
            resolve(result.data);
          }
        );
      });
    });
    return await createEvent;
  };

  async executeRemoveEvent(calendarId,eventId){
    const deleteEvent = new Promise((resolve,reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação'));
        }
        const calendar = google.calendar({ version: 'v3', auth:this.authorization });
        calendar.events.delete(
          {
            calendarId,
            eventId,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao deletar evento:', err);
              reject(new Error('Erro ao deletar evento'));
            }
            console.log('Evento deletado com sucesso.');
            resolve(result.data); 
          });
      });
    });
    return await deleteEvent;
  };

  async executeUpdateEvent(nameDoctor,eventData){
    const updateEvent = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação')) ;
        }
        const calendar = google.calendar({ version: 'v3', auth: this.authorization });
        calendar.events.update(
          {
            calendarId: nameDoctor,
            eventId: eventData.eventId,
            resource: {
              eventSummary: eventData.eventSummary,
              //description,
              start: {
                dateTime: eventData.startDateTime.toISOString(),
              },
              end: {
                dateTime: eventData.endDateTime.toISOString(),
              },
            },
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao atualizar evento:', err);
              reject(new Error('Erro ao atualizar evento'));
            }
            console.log('Evento atualizado:', result.data.htmlLink);
            resolve(result.data);
          });
      });
    });
    return await updateEvent;
  };
}

module.exports = CalendarUtils;
