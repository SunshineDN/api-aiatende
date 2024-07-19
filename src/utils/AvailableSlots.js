function getAvailableSlots(events) {
  const availableSlots = [];
  const weekdays = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
  const startTimeWeekday = 8 * 60; // 8:00 AM
  const endTimeWeekday = 20 * 60; // 8:00 PM
  const startTimeSaturday = 8 * 60; // 8:00 AM
  const endTimeSaturday = 13 * 60; // 1:00 PM
  const interval = 30; // 30 minutes

  let currentDate = new Date();
  currentDate.setSeconds(0, 0);

  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  while (currentDate <= new Date(currentDate.getFullYear() + 1, 11, 31)) {
    const day = currentDate.getDay();
    const isSaturday = day === 6;
    const isWeekday = weekdays.includes(day) && !isSaturday;

    if (!isWeekday && !isSaturday) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    let startMinutes = isSaturday ? startTimeSaturday : startTimeWeekday;
    let endMinutes = isSaturday ? endTimeSaturday : endTimeWeekday;

    let start = new Date(currentDate);
    start.setHours(0, startMinutes, 0, 0);
    let end = new Date(start);
    end.setMinutes(start.getMinutes() + interval);

    while (start.getHours() * 60 + start.getMinutes() < endMinutes) {
      const isSlotAvailable = events.every(event => {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        return end <= eventStart || start >= eventEnd;
      });

      if (isSlotAvailable) {
        availableSlots.push({
          start: start.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          end: end.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        });
      }

      start = addMinutes(start, interval);
      end = addMinutes(end, interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableSlots;
};

module.exports = getAvailableSlots;
