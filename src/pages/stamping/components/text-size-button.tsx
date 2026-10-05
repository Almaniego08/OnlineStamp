import { IconMinus, IconPlus, IconCheck } from '@tabler/icons-react';
import type { StampDispatch } from '../util/stamps-reducer-types';
import { rgb, RGB } from 'pdf-lib';
import { Button } from '@/components/custom/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
    dispatch: StampDispatch;
    id: string;
    size?: number;
    color?: RGB;
};

const COLORS: { label: string; value: RGB }[] = [
    { label: 'Stamp purple', value: rgb(0.345, 0.137, 0.655) },
    { label: 'Black', value: rgb(0, 0, 0) },
    { label: 'Red', value: rgb(0.86, 0.15, 0.15) },
    { label: 'Blue', value: rgb(0.11, 0.3, 0.85) },
    { label: 'Navy', value: rgb(0.05, 0.05, 0.45) },
    { label: 'Green', value: rgb(0.08, 0.5, 0.24) },
];

const toCss = (c?: RGB) => (c ? `rgb(${c.red * 255}, ${c.green * 255}, ${c.blue * 255})` : 'black');
const sameColor = (a?: RGB, b?: RGB) =>
    !!a && !!b && Math.abs(a.red - b.red) + Math.abs(a.green - b.green) + Math.abs(a.blue - b.blue) < 0.01;

/*
 * Kulay at laki ng text (para sa Text, Date at Time).
 */
export default function TextSizeButton({ dispatch, id, size, color }: Props) {
    const changeSize = (operator: '+' | '-') =>
        dispatch({ type: 'handleTextSizeButtonClick', payload: { id, operator } });

    const changeColor = (value: RGB) =>
        dispatch({ type: 'updateTextColor', payload: { id, value } });

    return (
        <div className="flex items-center gap-1">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Text color" title="Text color">
                        <span className="size-4 rounded-full border" style={{ background: toCss(color) }} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                    <div className="grid grid-cols-6 gap-1.5">
                        {COLORS.map(({ label, value }) => (
                            <button
                                key={label}
                                type="button"
                                title={label}
                                aria-label={label}
                                onClick={() => changeColor(value)}
                                className={cn(
                                    'flex size-7 items-center justify-center rounded-full border text-white',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                )}
                                style={{ background: toCss(value) }}
                            >
                                {sameColor(color, value) && <IconCheck size={14} />}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="flex items-center rounded-md border">
                <Button variant="ghost" size="icon" className="size-9 rounded-r-none" onClick={() => changeSize('-')} disabled={(size ?? 12) <= 4} aria-label="Smaller text">
                    <IconMinus size={14} />
                </Button>
                <span className="w-8 text-center text-sm tabular-nums" title="Font size (pt)">{size ?? 12}</span>
                <Button variant="ghost" size="icon" className="size-9 rounded-l-none" onClick={() => changeSize('+')} aria-label="Bigger text">
                    <IconPlus size={14} />
                </Button>
            </div>
        </div>
    );
}
