import moment from "moment";

export const setItemWithAdjustedTime = (key) => {
  const now = moment();
  const adjustedTime = now.add(50, "minutes").toISOString();
  localStorage.setItem(key, adjustedTime);
};

export const isCurrentDateGreaterThanStoredDate = (key) => {
  const storedDateStr = localStorage.getItem(key);
  if (!storedDateStr) {
    return false;
  }

  const storedDate = moment(storedDateStr);
  const now = moment();

  return now.isAfter(storedDate);
};
