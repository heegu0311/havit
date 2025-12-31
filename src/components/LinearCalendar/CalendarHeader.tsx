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
            className="flex items-center gap-2 px-4 py-2 bg-[var(--habit-color)] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
                  className={`w-full px-6 py-2 text-left transition-colors ${
                    yr === selectedYear
                      ? "text-[var(--habit-color)]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    yr === selectedYear
                      ? { backgroundColor: "color-mix(in srgb, var(--habit-color) 10%, white)" }
                      : {}
                  }
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
            className="w-full text-2xl md:text-4xl text-center text-[var(--habit-color)] border-b-2 border-transparent hover:border-gray-200 focus:border-[var(--habit-color)] focus:outline-none transition-colors py-2 placeholder-gray-300"
          />
        </div>
      </div>

      {hasLocalData && (
        <div className="flex items-center gap-3">
          {/* Copy Data Button */}
          <button
            onClick={onCopyData}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--habit-color)] text-[var(--habit-color)] rounded-lg transition-all duration-300"
            style={{
              backgroundColor: copiedData ? "color-mix(in srgb, var(--habit-color) 10%, white)" : "transparent"
            }}
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
                <span className="hidden md:inline">Copy existing data</span>
              </>
            )}
          </button>

          {/* Migrate LocalStorage Data Button */}
          <button
            onClick={onMigrateData}
            className="flex items-center gap-2 px-4 py-2 border-2 bg-[var(--habit-color)] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            title="Save existing localStorage data to server"
          >
            <Database className="w-5 h-5" />
            <span className="hidden md:inline">Sync existing data</span>
          </button>
        </div>
      )}
    </div>
  );
}

export const CalendarHeader = memo(CalendarHeaderComponent);
