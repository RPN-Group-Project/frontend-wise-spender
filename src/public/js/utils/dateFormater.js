const dateFormater = (date) => {
  const newDate = new Date(date);
  const formattedDate = `${newDate.getDate()} ${newDate.toLocaleString(
    "default",
    {
      month: "short",
    }
  )}`;
  return formattedDate;
};

export default dateFormater;
