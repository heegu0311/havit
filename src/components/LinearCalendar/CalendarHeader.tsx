import { memo } from "react";
import { ChevronDown, Copy, Database, Check } from "lucide-react";

interface CalendarHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  showYearDropdown: boolean;
  onToggleYearDropdown: (show: boolean) => void;
  availableYears: number[];
  localTitle: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur?: () => void;
  hasLocalData: boolean;
  copiedData: boolean;
  onCopyData: () => void;
  onMigrateData: () => void;
}

function CalendarHeaderComponent({
  selectedYear,
  onYearChange,
  showYearDropdown,
  onToggleYearDropdown,
  availableYears,
  localTitle,
  onTitleChange,
  onTitleBlur,
  hasLocalData,
  copiedData,
  onCopyData,
  onMigrateData,
}: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full flex items-center gap-4">
        {/* Year Selector */}
        <div>
          <button
            onClick={() => onToggleYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-2xl md:text-4xl font-bold">
              {selectedYear}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                showYearDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[120px]">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    onYearChange(yr);
                    onToggleYearDropdown(false);
                  }}
                  className={`w-full px-6 py-2 text-left hover:bg-[#FFF5F3] transition-colors ${
                    yr === selectedYear
                      ? "bg-[#FFF5F3] text-[#FF6B4A]"
                      : "text-gray-700"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Habit Title Input */}
        <div className="md:flex static md:absolute top-0 right-0 md:left-1/2 md:transform md:-translate-x-1/2">
          <input
            type="text"
            value={localTitle}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            placeholder="Enter habit here :)"
            className="w-full text-2xl md:text-4xl text-center text-[#FF6B4A] border-b-2 border-transparent hover:border-gray-200 focus:border-[#FF6B4A] focus:outline-none transition-colors py-2 placeholder-gray-300"
          />
        </div>
      </div>

      {hasLocalData && (
        <div className="flex items-center gap-3">
          {/* Copy Data Button */}
          <button
            onClick={onCopyData}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#FF6B4A] text-[#FF6B4A] rounded-lg hover:bg-[#FFF5F3] transition-all duration-300"
            title="Copy habit data to transfer between browsers"
          >
            {copiedData ? (
              <>
                <Check className="w-5 h-5" />
                <span className="hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span className="hidden md:inline">기존 데이터 복사</span>
              </>
            )}
          </button>

          {/* Migrate LocalStorage Data Button */}
          <button
            onClick={onMigrateData}
            className="flex items-center gap-2 px-4 py-2 border-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#FF8A6E] transition-all duration-300"
            title="기존 로컬스토리지 데이터를 서버에 저장하기"
          >
            <Database className="w-5 h-5" />
            <span className="hidden md:inline">기존 데이터 동기화</span>
          </button>
        </div>
      )}
    </div>
  );
}

export const CalendarHeader = memo(CalendarHeaderComponent);
