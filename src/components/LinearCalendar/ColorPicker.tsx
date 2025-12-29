import { memo } from "react";
import { HABIT_COLORS } from "@/constants/colors";
import { Check } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

function ColorPickerComponent({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap max-w-[240px]">
      {HABIT_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all relative flex items-center justify-center"
          style={{ backgroundColor: color }}
          title={color}
          type="button"
        >
          {selectedColor === color && (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          )}
        </button>
      ))}
    </div>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
