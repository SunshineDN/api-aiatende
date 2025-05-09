import { google } from 'googleapis';
import styled from '../log/styled.js';
import AuthCalendar from './AuthCalendar.js';
import { CalendarId } from '../../config/calendarId.js';

export class CalendarUtils {
  constructor() {
    this.authorization = AuthCalendar.authenticate();
  };

  async executeListEvents(calendarId) {
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
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
              styled.error('Erro ao listar eventos do calendário:', err);
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
              // console.log(string);
              resolve(string);
            } else {
              reject(new Error('Eventos não encontrados.'));
            }
          }
        );
        styled.success('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  };

  async executeRegisterEvent(calendarId, eventObj) {
    const createEvent = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação'));
        }
        const calendar = google.calendar({ version: 'v3', auth: this.authorization });
        calendar.events.insert(
          {
            calendarId,
            resource: eventObj, // { eventSummary, startDateTime, endDateTime, description }
          },
          (err, result) => {
            if (err) {
              styled.error('Erro ao adicionar evento:', err);
              reject(new Error('Erro ao adicionar evento'));
            }
            styled.success('Evento adicionado:', result.data.htmlLink);
            resolve(result.data);
          }
        );
      });
    });
    return await createEvent;
  };

  async executeRemoveEvent(calendarId, eventId) {
    const deleteEvent = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação'));
          return;
        }
        const calendar = google.calendar({ version: 'v3', auth: this.authorization });
        calendar.events.delete(
          {
            calendarId,
            eventId,
          },
          (err, result) => {
            if (err) {
              styled.error('Erro ao deletar evento:', err);
              reject(err);
              return;
            }
            styled.info('Evento deletado com sucesso.');
            resolve(result?.data);
          });
      });
    });
    return await deleteEvent;
  };

  async executeUpdateEvent(nameDoctor, eventData) {
    const updateEvent = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
          reject(new Error('Erro na autenticação'));
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
              styled.error('Erro ao atualizar evento:', err);
              reject(new Error('Erro ao atualizar evento'));
            }
            styled.info('Evento atualizado:', result.data.htmlLink);
            resolve(result.data);
          });
      });
    });
    return await updateEvent;
  };

  async listAvailableDate(calendarId) {
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
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
              styled.error('Erro ao listar eventos do calendário:', err);
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
            // const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Domingo é 0, Sábado é 6
            const dataHoraBrasil = new Date();
            const now = new Date(dataHoraBrasil.getTime() + (dataHoraBrasil.getTimezoneOffset() * 60000));
            const daysToCheck = 31; // Por exemplo, verificar 30 dias a partir de hoje

            for (let i = 0; i < daysToCheck; i++) {
              const currentDate = new Date(now);
              currentDate.setDate(now.getDate() + i);
              const dayOfWeek = currentDate.getDay();

              let dayStart = new Date(currentDate);
              let dayEnd = new Date(currentDate);

              if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
                // Setar o horário atual para o início do dia
                if (i === 0) {
                  let currentMinutes = currentDate.getMinutes();
                  let currentHours = currentDate.getHours();

                  if (currentHours < 8) {
                    currentHours = 11;
                    currentMinutes = 0;
                  } else {
                    if (currentMinutes < 30) {
                      currentMinutes = 30;
                    } else {
                      currentMinutes = 0;
                      currentHours++;
                    }
                  }
                  dayStart.setHours(currentHours + 6, currentMinutes, 0, 0);
                } else {
                  dayStart.setHours(11, 0, 0, 0);
                };
                dayEnd.setHours(23, 0, 0, 0);
              } else if (dayOfWeek === 6) { // Sábado
                dayStart.setHours(11, 0, 0, 0);
                dayEnd.setHours(16, 0, 0, 0);
              } else {
                continue; // Ignorar domingos
              }

              const dayEvents = events.filter(event => {
                const eventStart = new Date(event.start.dateTime);
                return eventStart.toDateString() === currentDate.toDateString();
              });

              const availableIntervals = getAvailableIntervalsForDay(dayStart, dayEnd, dayEvents);
              availableIntervals.forEach(interval => {
                let weekday = '';
                switch (dayOfWeek) {
                  case 1:
                    weekday = 'Segunda-feira';
                    break;
                  case 2:
                    weekday = 'Terça-feira';
                    break;
                  case 3:
                    weekday = 'Quarta-feira';
                    break;
                  case 4:
                    weekday = 'Quinta-feira';
                    break;
                  case 5:
                    weekday = 'Sexta-feira';
                    break;
                  case 6:
                    weekday = 'Sábado';
                    break;
                  case 0:
                    weekday = 'Domingo';
                    break;
                }
                availableTimes.push(`${weekday} - ${interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[0]} ${interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[1]}`);
              });
            }

            if (availableTimes.length) {
              let string = '';
              availableTimes.forEach(interval => {
                string += `${interval}\n`;
              });
              resolve(string);
            } else {
              reject(new Error('Nenhum intervalo disponível encontrado.'));
            }
          }
        );
        styled.success('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  }

  async listWebAvailableDate(calendarId) {
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
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
              styled.error('Erro ao listar eventos do calendário:', err);
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
            // const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Domingo é 0, Sábado é 6
            const dataHoraBrasil = new Date();
            const now = new Date(dataHoraBrasil.getTime() + (dataHoraBrasil.getTimezoneOffset() * 60000));
            const daysToCheck = 31; // Por exemplo, verificar 30 dias a partir de hoje

            for (let i = 0; i < daysToCheck; i++) {
              const currentDate = new Date(now);
              currentDate.setDate(now.getDate() + i);
              const dayOfWeek = currentDate.getDay();

              let dayStart = new Date(currentDate);
              let dayEnd = new Date(currentDate);

              if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
                // Setar o horário atual para o início do dia
                if (i === 0) {
                  let currentMinutes = currentDate.getMinutes();
                  let currentHours = currentDate.getHours();

                  if (currentHours < 8) {
                    currentHours = 11;
                    currentMinutes = 0;
                  } else {
                    if (currentMinutes < 30) {
                      currentMinutes = 30;
                    } else {
                      currentMinutes = 0;
                      currentHours++;
                    }
                  }
                  dayStart.setHours(currentHours + 6, currentMinutes, 0, 0);
                } else {
                  dayStart.setHours(11, 0, 0, 0);
                };
                dayEnd.setHours(23, 0, 0, 0);
              } else if (dayOfWeek === 6) { // Sábado
                dayStart.setHours(11, 0, 0, 0);
                dayEnd.setHours(16, 0, 0, 0);
              } else {
                continue; // Ignorar domingos
              }

              const dayEvents = events.filter(event => {
                const eventStart = new Date(event.start.dateTime);
                return eventStart.toDateString() === currentDate.toDateString();
              });

              const availableIntervals = getAvailableIntervalsForDay(dayStart, dayEnd, dayEvents);
              availableIntervals.forEach(interval => {
                if (availableTimes.length) {
                  const lastObj = availableTimes[availableTimes.length - 1];
                  if (lastObj.date === interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[0]) {
                    lastObj.availableOptions.push(interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[1]);
                  } else {
                    const obj = {
                      date: interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[0],
                      availableOptions: [],
                    };
                    obj.availableOptions.push(interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[1]);
                    availableTimes.push(obj);
                  }
                } else {
                  const obj = {
                    date: interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[0],
                    availableOptions: [],
                  };
                  obj.availableOptions.push(interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[1]);
                  availableTimes.push(obj);
                }

              });
            }

            if (availableTimes.length) {
              resolve(availableTimes);
            } else {
              reject(new Error('Nenhum intervalo disponível encontrado.'));
            }
          }
        );
        styled.success('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  }

  async listAvailableOptions(calendarId) {
    const calendar_return = new Promise((resolve, reject) => {
      this.authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
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
              styled.error('Erro ao listar eventos do calendário:', err);
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
            // const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Domingo é 0, Sábado é 6
            const dataHoraBrasil = new Date();
            const now = new Date(dataHoraBrasil.getTime() + (dataHoraBrasil.getTimezoneOffset() * 60000));
            const daysToCheck = 31; // Por exemplo, verificar 30 dias a partir de hoje

            for (let i = 0; i < daysToCheck; i++) {
              const currentDate = new Date(now);
              currentDate.setDate(now.getDate() + i);
              const dayOfWeek = currentDate.getDay();

              let dayStart = new Date(currentDate);
              let dayEnd = new Date(currentDate);

              if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
                // Setar o horário atual para o início do dia
                if (i === 0) {
                  let currentMinutes = currentDate.getMinutes();
                  let currentHours = currentDate.getHours();

                  if (currentHours < 8) {
                    currentHours = 11;
                    currentMinutes = 0;
                  } else {
                    if (currentMinutes < 30) {
                      currentMinutes = 30;
                    } else {
                      currentMinutes = 0;
                      currentHours++;
                    }
                  }
                  dayStart.setHours(currentHours + 6, currentMinutes, 0, 0);
                } else {
                  dayStart.setHours(11, 0, 0, 0);
                };
                dayEnd.setHours(23, 0, 0, 0);
              } else if (dayOfWeek === 6) { // Sábado
                dayStart.setHours(11, 0, 0, 0);
                dayEnd.setHours(16, 0, 0, 0);
              } else {
                continue; // Ignorar domingos
              }

              const dayEvents = events.filter(event => {
                const eventStart = new Date(event.start.dateTime);
                return eventStart.toDateString() === currentDate.toDateString();
              });

              const availableIntervals = getAvailableIntervalsForDay(dayStart, dayEnd, dayEvents);
              availableIntervals.forEach(interval => {
                availableTimes.push(`${interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[0]} ${interval.start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(', ')[1]}`);
              });
            }

            if (availableTimes.length) {
              let string = '';
              availableTimes.forEach(interval => {
                string += `${interval}; `;
              });
              resolve(string.trim());
            } else {
              reject(new Error('Nenhum intervalo disponível encontrado.'));
            }
          }
        );
        styled.success('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  }

  /**
   * Valida o nome do profissional para retornar o id do calendário correspondente
   * @param {string} condition - Nome do profissional ou condição para validar o calendário
   * @returns {string} - Id do calendário
   */
  static idValidate(condition = '') {
    const mapping = {
      'Juliana Leite': CalendarId.juliana,
      'Lucília Miranda': CalendarId.odontopediatria,
      'Odontopediatria': CalendarId.odontopediatria,
    };

    for (const key in mapping) {
      if (condition.includes(key)) {
        return mapping[key];
      }
    }

    return CalendarId.dentistas;
  }
}
