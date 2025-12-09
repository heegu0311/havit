export const getSelectedShapeClasses = (
  monthDays: (number | null)[],
  monthIndex: number,
  cellIndex: number,
  maxCells: number,
  isDateSelected: (monthIndex: number, day: number) => boolean,
) => {
  const day = monthDays[cellIndex];
  if (!day) return "";

  const isSelected = isDateSelected(monthIndex, day);

  if (!isSelected) return "";

  const prevDay = cellIndex > 0 ? monthDays[cellIndex - 1] : null;
  const nextDay = cellIndex < maxCells - 1 ? monthDays[cellIndex + 1] : null;

  const isPrevSelected = prevDay != null && isDateSelected(monthIndex, prevDay);
  const isNextSelected = nextDay != null && isDateSelected(monthIndex, nextDay);

  if (!isPrevSelected && !isNextSelected) {
    return "rounded-full";
  }
  if (!isPrevSelected && isNextSelected) {
    return "rounded-l-full";
  }
  if (isPrevSelected && !isNextSelected) {
    return "rounded-r-full";
  }
  return "rounded-none";
};
