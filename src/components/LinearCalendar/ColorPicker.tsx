import { memo } from "react";
import { HABIT_COLORS } from "@/constants/colors";
import { Check, X } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  usedColors?: string[]; // Colors already used by other habits
  onColorChange: (color: string) => void;
}

function ColorPickerComponent({
  selectedColor,
  usedColors = [],
  onColorChange,
}: ColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap max-w-[240px]">
      {HABIT_COLORS.map((color) => {
        const isUsed = usedColors.includes(color) && color !== selectedColor;
        const isSelected = selectedColor === color;

        return (
          <button
            key={color}
            onClick={() => !isUsed && onColorChange(color)}
            disabled={isUsed}
            className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
              isUsed
                ? "border-gray-300 opacity-40 cursor-not-allowed"
                : "border-gray-200 hover:border-gray-400 cursor-pointer"
            }`}
            style={{ backgroundColor: color }}
            title={isUsed ? "Already in use" : color}
            type="button"
          >
            {isSelected && (
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            )}
            {isUsed && !isSelected && (
              <X className="w-4 h-4 text-white opacity-60" strokeWidth={2} />
            )}
          </button>
        );
      })}
    </div>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
