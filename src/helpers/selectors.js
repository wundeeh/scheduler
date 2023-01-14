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

export function getInterview(state, interview) {
  const obj = {};

  if (interview) {
    obj["student"] = interview.student;
    obj["interviewer"] = state.interviewers[interview.interviewer];
  } else {
    return null;
  }
  return obj;
}

export function getInterviewersForDay(state, day) {
  const output = [];
  for (const elem of state.days) {
    if (elem.name === day) {
      for (const appt of elem.interviewers) {
        if (state.interviewers[appt]) {
          output.push(state.interviewers[appt]);
        }
      }
    }
  }
  return output;
}