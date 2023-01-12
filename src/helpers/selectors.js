export function getAppointmentsForDay(state, day) {
  const arr = [];

  for (const key of state.days) {
    if (key.name === day) {
      for (const appt of key.appointments) {
        if (state.appointments[appt]) {
          arr.push(state.appointments[appt]);
        }
      }
    }
  }
  return arr;
}
