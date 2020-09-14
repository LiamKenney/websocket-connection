const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getTime(ts) {
  let date = new Date(ts);
  let time = `${date.getHours()}:${getMinutes(ts)}`;
  return time;
}

function getDate(ts) {
  let date = new Date(ts);
  let time = `${monthNames[date.getMonth()].slice(
    0,
    3
  )} ${date.getDate()}, ${date.getFullYear()}`;
  return time;
}
function getBoth(ts) {
  let both = `${getDate(ts)}, ${getTime(ts)}`;
  return both;
}

function getMinutes(ts) {
  let date = new Date(ts);
  let time = `${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  return time;
}

export { getBoth, getDate, getTime, getMinutes };
