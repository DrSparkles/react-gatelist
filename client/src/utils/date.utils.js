import moment from "moment";

export function getGatelistWeeks(startDate, numWeeks){

  const weeks = [];
  for (let i = 0; i < numWeeks; i++){

    if (i === 0){
      weeks.push(moment(startDate).format('YYYY-MM-DD'));
    }
    else {
      const week = moment(startDate).add(i, 'week').format('YYYY-MM-DD');
      weeks.push(week);
    }

  }
  return weeks;
}

export function getNextSaturday(){
  const dayINeed = 6; // for Saturday
  const today = moment().isoWeekday();

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    return moment().isoWeekday(dayINeed).format('YYYY-MM-DD');
  } else {
    // otherwise, give me *next week's* instance of that same day
    return moment().add(1, 'weeks').isoWeekday(dayINeed).format('YYYY-MM-DD');
  }
}