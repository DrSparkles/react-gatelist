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