export function splitDateTime(dateTimeObj) {
  const [date, timeWithSeconds, period] = dateTimeObj.split(" ");

  const [hour, minute, second] = timeWithSeconds.split(":");

  const formattedDate = date;
  const formattedTime = `${hour}:${minute} ${period}`;

  return { date: formattedDate, time: formattedTime };
}
