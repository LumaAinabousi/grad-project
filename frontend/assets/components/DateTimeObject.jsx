export function mergeDateTime(dateObj, timeObj) {
  const cleanedTime = timeObj.replace(/\u202F/g, " ").trim();

  if (!dateObj || !cleanedTime) {
    console.error("Invalid date or time input");
    return null;
  }

  const date = new Date(dateObj);
  if (isNaN(date)) {
    console.error("Invalid date: ", dateObj);
    return null;
  }

  const [time, period] = cleanedTime.split(" ");
  let [hours, minutes] = time.split(":");

  if (period === "PM" && hours !== "12") {
    hours = (parseInt(hours) + 12).toString();
  }
  if (period === "AM" && hours === "12") {
    hours = "00";
  }

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:00`;

  const finalDate = new Date(`${dateObj}T${formattedTime}`);
  if (isNaN(finalDate)) {
    console.error("Invalid time: ", cleanedTime);
    return null;
  }

  const formattedDate = finalDate.toLocaleString("en-US", {
    timeZone: "GMT",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [datePart, timePart] = formattedDate.split(", ");
  const [month, day, year] = datePart.split("/");
  const finalFormattedDate = `${year}-${month}-${day} ${timePart}`;

  return finalFormattedDate;
}
