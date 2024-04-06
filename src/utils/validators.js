function isValidDate(value) {
  const dateObject = new Date(value);
  return !isNaN(dateObject.getTime());
}

export default isValidDate;
