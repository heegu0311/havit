export function Calendar2026() {
  const year = 2026;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthDays = (month: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-8xl mb-4">2026</h1>
        <p className="text-2xl text-gray-600">Calendar</p>
      </div>

      <div className="grid grid-cols-3 gap-8 print:gap-6">
        {months.map((monthName, monthIndex) => (
          <div key={monthIndex} className="border-2 border-gray-300 rounded-lg p-4 bg-white">
            <div className="text-center mb-3">
              <h2 className="text-2xl text-gray-800">{monthName}</h2>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-sm text-gray-600"
                >
                  {day}
                </div>
              ))}

              {generateMonthDays(monthIndex).map((day, index) => (
                <div
                  key={index}
                  className={`text-center py-2 ${
                    day ? 'text-gray-900' : ''
                  }`}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page {
            size: A3 landscape;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:gap-6 {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
