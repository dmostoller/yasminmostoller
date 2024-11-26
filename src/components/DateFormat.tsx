// FILE: components/DateFormat.tsx
type DateFormatProps = {
  date: string | undefined;
};

const DateFormat = ({ date }: DateFormatProps) => {
  if (!date) return null;

  const formattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 becomes 12)

    return `${month}-${day}-${year} ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return <span className="text-sm text-gray-600">{formattedDate(date)}</span>;
};

export default DateFormat;
