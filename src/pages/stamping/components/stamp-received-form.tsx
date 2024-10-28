import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/custom/button";
import { cn } from "@/lib/utils";
import { IconCalendarMonth } from '@tabler/icons-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IconRubberStamp } from '@tabler/icons-react';
import { PositioningButton } from './positioning-button';
import { IconTrash } from '@tabler/icons-react';

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
}

function StampReceivedForm({ removeItem, id, dispatch }: Props) {
    const [trackingNo, setTrackingNo] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>('');

    const updateReceiveStampDetails = (
        id: string,
        subId: string, // This is the id of the subcomponent being updated
        trackingNo: string,
        date: Date | undefined,
        time: string
    ) => ({
        type: 'updateReceiveStampDetails',
        payload: { id, subId, trackingNo, date, time },
    });

    const handleTrackingNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTrackingNo = e.target.value;
        setTrackingNo(newTrackingNo); // Update local state
        dispatch(updateReceiveStampDetails(id, '1', newTrackingNo, date, time)); // Use id prop instead of item.id
    };

    const handleDateChange = (selectedDate: any) => {
        setDate(selectedDate); // Update local state
        dispatch(updateReceiveStampDetails(id, '2', trackingNo, selectedDate, time)); // Use id prop instead of item.id
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime); // Update local state
        dispatch(updateReceiveStampDetails(id, '3', trackingNo, date, newTime)); // Use id prop instead of item.id
    };

    useEffect(() => {
        const currentDate = new Date();
        setDate(currentDate);
    }, []);

    useEffect(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Format hours
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Format minutes
        setTime(`${hours}:${minutes}`);
    }, []);

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconRubberStamp />
                    <p className="text-start font-bold w-full">RECEIVE STAMP</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>

            <div className="flex flex-col gap-3 w-50 w-full">
                <div className='flex flex-col justify-start gap-[10px]'>
                    <Label className='w-fit' htmlFor="tracking">Tracking #</Label>
                    <Input id="tracking" type="text" value={trackingNo} onChange={handleTrackingNoChange} />
                </div>
                <div className='flex flex-col justify-start gap-[10px]'>
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
                                selected={date}
                                onSelect={(selectedDate) => {
                                    handleDateChange(selectedDate); // Handle date selection
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
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
            </div>
            <PositioningButton />
        </div>
    );
}

export default StampReceivedForm;
