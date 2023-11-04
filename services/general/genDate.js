function generateDateSeries(startDate, endDate) {
  const result = [];
  const currentDate = new Date(startDate);
  const endDate2 = new Date(endDate);
  while (currentDate <= endDate2) {
    result.push(currentDate.toISOString());
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return result;
}

function getDatesAtInterval(inputDate, monthInterval, endDate) {
  const dates = [];
  let currentDate = new Date(inputDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString());
    currentDate.setUTCMonth(currentDate.getUTCMonth() + monthInterval);
  }

  return dates;
}

module.exports = generateDateSeries;
