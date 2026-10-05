import { useEffect, useState } from 'react';
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconCalendarMonth } from '@tabler/icons-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { formatDate } from '../util/format-date-time'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import TextSizeButton from './text-size-button';
import type { ItemFormProps } from './dynamic-component-renderer';

export default function AddDateForm({ id, item, dispatch }: ItemFormProps) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        setDate(selectedDate);
        setOpen(false);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: formatDate(selectedDate) }
        });
    };

    useEffect(() => {
        handleDateChange(new Date());
    }, []);

    return (
        <div className='flex flex-col gap-2'>
            <Label htmlFor={`date-${id}`}>Date</Label>
            <div className='flex flex-wrap items-center gap-2'>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger id={`date-${id}`} asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "min-w-[160px] flex-1 justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <IconCalendarMonth className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            defaultMonth={date}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <TextSizeButton dispatch={dispatch} id={id} size={item.size} color={item.color} />
            </div>
            <Button variant="link" className="h-auto w-fit p-0 text-xs" onClick={() => handleDateChange(new Date())}>
                Today
            </Button>
        </div>
    )
}
