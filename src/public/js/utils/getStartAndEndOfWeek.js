function getStartAndEndOfWeek(date) {
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);

  startOfWeek.setDate(date.getDate() - date.getDay() + 1);
  endOfWeek.setDate(date.getDate() - date.getDay() + 7);

  const formatDate = (d) => d.toISOString().split("T")[0];

  return {
    startOfWeek: formatDate(startOfWeek),
    endOfWeek: formatDate(endOfWeek),
  };
}

export default getStartAndEndOfWeek;
