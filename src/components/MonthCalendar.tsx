interface MonthCalendarProps {
  month: string;
  monthIndex: number;
  year: number;
}

export function MonthCalendar({ month, monthIndex, year }: MonthCalendarProps) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create array of days
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Check if today falls in this month
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const currentDay = isCurrentMonth ? today.getDate() : null;

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 print:p-3 bg-white">
      {/* Month Name */}
      <h2 className="text-center mb-3 text-gray-800">{month}</h2>
      
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="text-center text-xs text-gray-600 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm
              ${day === null ? 'invisible' : ''}
              ${day === currentDay ? 'bg-blue-500 text-white rounded-full' : 'text-gray-800'}
              ${day && [6, 0].includes((firstDayOfMonth + day - 1) % 7) ? 'text-red-600' : ''}
              ${day === currentDay ? 'text-white' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
