NB.Utils = {
  valWithoutRef: function(obj: any): any {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return undefined;
    }
  },
  timeStampToDate: function(
    timestamp: number
  ): { time: string; date: string; day: string } {
    const stampToDate = new Date(timestamp);
    // Time without the seconds
    const time = stampToDate.toLocaleTimeString(navigator.language, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    });
    const day = getWeekDay(stampToDate);
    const date = stampToDate.toLocaleDateString();
    return { time, date, day };
  }
};

function getWeekDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  return days[date.getDay()];
}
