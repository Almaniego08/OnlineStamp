import { useEffect } from 'react';
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { timeNowConvert, timeString } from '../util/format-date-time'
import { useState } from "react";
import { IconLetterCase } from '@tabler/icons-react';
type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
}

export default function AddTimeForm({ removeItem, id, dispatch }: Props) {
    const [time, setTime] = useState<string | undefined>(undefined);



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
                    <p className="text-start font-bold w-full">ADD DATE</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div className='flex flex-col justify-start gap-[10px]'>
                <Label className='w-fit' htmlFor="time">Time</Label>
                <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className="w-full"
                />
            </div>
            <PositioningButton
                dispatch={dispatch}
                id={id}
            />
        </div>
    )
}