const { google } = require('googleapis');
const AuthCalendar = require('./AuthCalendar');
const AvailableSlots = require('../utils/AvailableSlots');
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

  async listAvailableDate (calendarId) {
    // console.log('Id: ', calendarId);
    // const calendar_return = new Promise((resolve, reject) => {
    //   this.authorization.authorize((err) => {
    //     if (err) {
    //       console.error('Erro na autenticação:', err);
    //       reject('Erro na autenticação');
    //     }
    //     const calendar = google.calendar({ version: 'v3', auth: this.authorization });
    //     calendar.events.list(
    //       {
    //         calendarId: calendarId,
    //         timeMin: new Date().toISOString(),
    //         maxResults: 600,
    //         singleEvents: true,
    //         orderBy: 'startTime',
    //         eventTypes: 'outOfOffice',
    //       },
    //       (err, result) => {
    //         if (err) {
    //           console.error('Erro ao listar eventos do calendário:', err);
    //           reject(new Error('Erro ao listar eventos do calendário', err));
    //         }
    //         const events = result?.data?.items;
    //         let res = [];
    //         if (events?.length) {
    //           events.map ((event) => {
    //             let startDate = new Date(event.start.dateTime).toLocaleString(
    //               'pt-BR',
    //               { timeZone: 'America/Sao_Paulo' }
    //             );
    //             let startDateSplit = startDate.split(', ');
    //             startDate = startDateSplit[1].substring(0,5);

    //             let endDate = new Date(event.end.dateTime).toLocaleString(
    //               'pt-BR',
    //               { timeZone: 'America/Sao_Paulo' }
    //             );
    //             let endDateSplit = endDate.split(', ');                
    //             endDate = endDateSplit[1].substring(0,5);
                  
    //             res.push({'Data': endDateSplit[0] , 'Horario': `${startDate} - ${endDate}`});

    //           });
    //           resolve( res ); 
    //         } else {
    //           reject(new Error('Eventos não encontrados.'));
    //         }
    //       }
    //     );
    //     console.log('Eventos listados com sucesso!');
    //   });
    // });
    // return await calendar_return;
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          reject('Erro na autenticação');
          return;
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
              return;
            }
            const events = result.data.items;
            const availableTimes = [];

            // Função para adicionar intervalos de 30 minutos
            const addIntervals = (start, end, intervals) => {
              let current = new Date(start);
              while (current < end) {
                let next = new Date(current);
                next.setMinutes(current.getMinutes() + 30);
                if (next <= end) {
                  intervals.push({ start: new Date(current), end: new Date(next) });
                }
                current = next;
              }
            };

            // Função para verificar a disponibilidade dos intervalos
            const isAvailable = (interval, events) => {
              for (let event of events) {
                const eventStart = new Date(event.start.dateTime);
                const eventEnd = new Date(event.end.dateTime);
                if ((interval.start >= eventStart && interval.start < eventEnd) ||
                    (interval.end > eventStart && interval.end <= eventEnd)) {
                  return false;
                }
              }
              return true;
            };

            // Função para obter os intervalos disponíveis para um determinado dia
            const getAvailableIntervalsForDay = (dayStart, dayEnd, events) => {
              const intervals = [];
              addIntervals(dayStart, dayEnd, intervals);
              return intervals.filter(interval => isAvailable(interval, events));
            };

            // Loop para cada dia da semana
            const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Domingo é 0, Sábado é 6
            const now = new Date();
            const daysToCheck = 31; // Por exemplo, verificar 30 dias a partir de hoje

            for (let i = 0; i < daysToCheck; i++) {
              const currentDate = new Date(now);
              currentDate.setDate(now.getDate() + i);
              const dayOfWeek = currentDate.getDay();

              let dayStart = new Date(currentDate);
              let dayEnd = new Date(currentDate);

              if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
                dayStart.setHours(8, 0, 0, 0);
                dayEnd.setHours(20, 0, 0, 0);
              } else if (dayOfWeek === 6) { // Sábado
                dayStart.setHours(8, 0, 0, 0);
                dayEnd.setHours(13, 0, 0, 0);
              } else {
                continue; // Ignorar domingos
              }

              const dayEvents = events.filter(event => {
                const eventStart = new Date(event.start.dateTime);
                return eventStart.toDateString() === currentDate.toDateString();
              });

              const availableIntervals = getAvailableIntervalsForDay(dayStart, dayEnd, dayEvents);
              availableIntervals.forEach(interval => {
                availableTimes.push(`${interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} - ${interval.end.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
              });
            }

            if (availableTimes.length) {
              let string = 'Intervalos disponíveis:\n';
              availableTimes.forEach(interval => {
                string += `${interval}\n`;
              });
              console.log(string);
              console.log('Qtd. dados listados:', availableTimes.length);
              resolve(string);
            } else {
              reject(new Error('Nenhum intervalo disponível encontrado.'));
            }
          }
        );
        console.log('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  }
}

module.exports = CalendarUtils;
