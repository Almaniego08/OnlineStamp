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
    pdfHeight: number;
    pdfWidth: number;
}

export default function AddTimeForm({ removeItem, id, dispatch, pdfHeight, pdfWidth }: Props) {
    const [time, setTime] = useState<string>('');

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        const timestring = timeString(newTime)
        setTime(newTime);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: timestring }
        });
    };

    useEffect(() => {
        const newDate = new Date()
        const { military_time, ante_meridiem } = timeNowConvert(newDate)
        setTime(military_time)
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: ante_meridiem }
        });
    }, []);
    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconLetterCase />
                    <p className="text-start font-bold w-full">ADD TIME</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div>
                <div className='flex flex-row-gap-[10px items-end gap-[10px]'>
                    <div className='flex flex-col justify-start gap-[10px] w-full'>
                        <Label className='w-fit' htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            className="w-full"
                        />
                    </div>
                    <TextSizeButton />
                </div>
            </div>
            <PositioningButton
                pdfHeight={pdfHeight}
                pdfWidth={pdfWidth}
                dispatch={dispatch}
                id={id}
            />
        </div>
    )
}