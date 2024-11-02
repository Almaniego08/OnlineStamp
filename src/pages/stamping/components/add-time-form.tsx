import { useEffect } from 'react';
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { timeNowConvert, timeString } from '../util/format-date-time'
import { IconCurrentLocation, IconX } from '@tabler/icons-react';

import { useState } from "react";
import { IconLetterCase } from '@tabler/icons-react';
import TextSizeButton from './text-size-button';
type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
    isEditing: string;
    setIsEditingPosition: (id: string) => void;
}

export default function AddTimeForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {
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
                <div>
                    <Button onClick={() => setIsEditingPosition(id)} variant='ghost'>
                        <IconCurrentLocation
                            style={{
                                color: isEditing === id ? 'green' : 'red'
                            }} />
                    </Button>
                    <Button onClick={() => removeItem(id)} variant='ghost'>
                        <IconTrash style={{ color: 'red' }} />
                    </Button>
                </div>
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
                    <TextSizeButton dispatch={dispatch} id={id} />
                </div>
            </div>
            <div
                className={`bg-background bg-opacity-50 rounded-md p-[5px] flex flex-row items-center transition-all duration-300 ${isEditing === id ? 'fixed' : 'relative'
                    }`}
                style={{
                    width: isEditing === id ? 'fit-content' : '100%',
                    bottom: '5px',
                    left: isEditing === id ? '50%' : '0%',
                    transform: isEditing === id ? 'translateX(-50%) scale(1)' : 'translateX(0) scale(0.95)',
                    opacity: isEditing === id ? 1 : 0.95,
                    zIndex: isEditing === id ? 50 : 1,
                }}
            >
                <PositioningButton
                    pdfHeight={pdfHeight}
                    pdfWidth={pdfWidth}
                    dispatch={dispatch}
                    id={id}
                />
                {isEditing === id ? (
                    <Button onClick={() => setIsEditingPosition('')} className="text-red-500 h-full" variant="ghost">
                        <IconX />
                    </Button>
                ) : null}
            </div>
        </div>
    )
}