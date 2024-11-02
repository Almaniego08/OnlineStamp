import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/custom/button';
import { rgb, RGB } from 'pdf-lib';
import { IconDroplet } from '@tabler/icons-react';
type Props = {
  updateTextColor: (color: RGB) => void;
};

// Helper function to convert RGB to CSS-compatible string
const rgbToCSS = (color: RGB) => {
  const [r, g, b] = [color.red * 255, color.green * 255, color.blue * 255];
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

export default function useColorPicker({ updateTextColor }: Props) {
  const [color, setColor] = useState<RGB | null>(null);

  // Define primary colors
  const red = rgb(1, 0, 0);
  const green = rgb(0, 1, 0);
  const blue = rgb(0, 0, 1);
  const yellow = rgb(1, 1, 0);
  const cyan = rgb(0, 1, 1);
  const magenta = rgb(1, 0, 1);
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);

  useEffect(() => {
    setColor(red); // Set default color
  }, []);

  const handleColorPick = (rgbColor: RGB) => {
    setColor(rgbColor);
    updateTextColor(rgbColor);
  };

  const ColorPicker = () => (
    <div>
      <Popover>
        <PopoverTrigger id="color-picker" asChild>
          <Button
            variant="ghost"
          >
            <IconDroplet
              style={{
                color: color ? rgbToCSS(color) : 'inherit', // No color applied if null; 'inherit' takes parent styles if needed
              }}
            />

          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleColorPick(red)} variant="ghost" className="border flex-1 shrink-0 bg-red-600" />
            <Button onClick={() => handleColorPick(green)} variant="ghost" className="border flex-1 shrink-0 bg-green-500" />
            <Button onClick={() => handleColorPick(blue)} variant="ghost" className="border flex-1 shrink-0 bg-blue-500" />
            <Button onClick={() => handleColorPick(yellow)} variant="ghost" className="border flex-1 shrink-0 bg-yellow-500" />
            <Button onClick={() => handleColorPick(cyan)} variant="ghost" className="border flex-1 shrink-0 bg-cyan-500" />
            <Button onClick={() => handleColorPick(magenta)} variant="ghost" className="border flex-1 shrink-0 bg-purple-500" />
            <Button onClick={() => handleColorPick(white)} variant="ghost" className="border flex-1 shrink-0 bg-white" />
            <Button onClick={() => handleColorPick(black)} variant="ghost" className="border flex-1 shrink-0 bg-black" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return [ColorPicker, color, setColor] as const;
}
