const groupByDayAndSum = (data) => {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const dayIndex = date.getDay();
    const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];

    if (!groupedData[dayName]) {
      groupedData[dayName] = 0;
    }
    groupedData[dayName] += item.amount;
  });

  return groupedData;
};

export default groupByDayAndSum;
