export function getGoogleCalendarUrl({ title, description, startTime, endTime, location = "" }) {
    const formatDate = (date) =>
      new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
    const details = {
      text: title,
      dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
      details: description,
      location,
    };
  
    const params = new URLSearchParams(details);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  }
  