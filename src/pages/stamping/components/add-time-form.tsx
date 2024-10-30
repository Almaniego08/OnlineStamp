import { useEffect } from 'react';
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { IconCalendarMonth } from '@tabler/icons-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { timeNowConvert, timeString, formatDate } from '../util/format-date-time'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { IconLetterCase } from '@tabler/icons-react';
import AddTextForm from './add-text-form';
import TextSizeButton from './text-size-button';
type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
}

export default function AddTimeForm({ removeItem, id, dispatch }: Props) {
    const [date, setDate] = useState<Date | undefined>(undefined);


    const handleTimeChange = (selectedDate: any) => {
        const dateText = formatDate(selectedDate)
        setDate(selectedDate);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: dateText }
        });
    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate)
        setDate(currentDate);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: formattedDate }
        });
    }, []);
    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconLetterCase />
                    <p className="text-start font-bold w-full">ADD DATE</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div>
                <div className='flex flex-row-gap-[10px items-end gap-[10px]'>
                    <div className='flex flex-col justify-start  flex-1'>
                        <Label className='w-fit' htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger id='date' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
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
                                    onSelect={(selectedDate) => {
                                        handleTimeChange(selectedDate); // Handle date selection
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <TextSizeButton />
                    </div>
                </div>
                <PositioningButton
                    dispatch={dispatch}
                    id={id}
                />
            </div>
            )
}