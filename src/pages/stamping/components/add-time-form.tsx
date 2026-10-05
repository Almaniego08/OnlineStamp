import { useEffect, useState } from 'react';
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { timeNowConvert, timeString } from '../util/format-date-time'
import TextSizeButton from './text-size-button';
import type { ItemFormProps } from './dynamic-component-renderer';

export default function AddTimeForm({ id, item, dispatch }: ItemFormProps) {
    const [time, setTime] = useState<string>('');

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        if (!newTime) return;
        setTime(newTime);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: timeString(newTime) }
        });
    };

    const setNow = () => {
        const { military_time, ante_meridiem } = timeNowConvert(new Date())
        setTime(military_time)
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: ante_meridiem }
        });
    };

    useEffect(() => {
        setNow();
    }, []);

    return (
        <div className='flex flex-col gap-2'>
            <Label htmlFor={`time-${id}`}>Time</Label>
            <div className='flex flex-wrap items-center gap-2'>
                <Input
                    id={`time-${id}`}
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className="min-w-[160px] flex-1"
                />
                <TextSizeButton dispatch={dispatch} id={id} size={item.size} color={item.color} />
            </div>
            <Button variant="link" className="h-auto w-fit p-0 text-xs" onClick={setNow}>
                Now
            </Button>
        </div>
    )
}
