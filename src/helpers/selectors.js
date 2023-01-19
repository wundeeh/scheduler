// Gets all interviews for a specified day
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

// Gets an interview by the student and interviewer
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

// Gets all interviewers for a specified day
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
