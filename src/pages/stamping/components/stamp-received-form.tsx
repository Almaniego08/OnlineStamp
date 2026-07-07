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
// import { Action } from "../util/stamps-reducer-types";
import ModalImageView from "./modal-image-view";
import { initialMaricelImg, receivedImg } from "../data/images";
import { timeNowConvert, timeString, formatDate } from '../util/format-date-time'
import { IconCurrentLocation, IconX } from '@tabler/icons-react';

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
    isEditing: string;
    setIsEditingPosition: (id: string) => void;
}
interface imagePreviewDataTypes { src?: string; title?: string }

function StampReceivedForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {
    const [trackingNo, setTrackingNo] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>('');

    const updateReceiveStampDetails = (
        id: string,
        subId: string, // This is the id of the subcomponent being updated
        value: string,
    ) => ({
        type: 'updateReceiveStampDetails',
        payload: { id, subId, value },
    });

    const handleTrackingNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTrackingNo = e.target.value;
        setTrackingNo(newTrackingNo);
        dispatch(updateReceiveStampDetails(id, '1', newTrackingNo));
    };

    const handleDateChange = (selectedDate: any) => {
        const dateText = selectedDate ? format(selectedDate, "dd MMM yyyy").toUpperCase() : new Date().toLocaleDateString();
        setDate(selectedDate);
        dispatch(updateReceiveStampDetails(id, '2', dateText));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        const timestring = timeString(newTime)
        setTime(newTime);
        dispatch(updateReceiveStampDetails(id, '3', timestring));
    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate)
        setDate(currentDate);
        dispatch(updateReceiveStampDetails(id, '2', formattedDate));
    }, []);

    useEffect(() => {
        const newDate = new Date()
        const { military_time, ante_meridiem } = timeNowConvert(newDate)
        setTime(military_time)
        dispatch(updateReceiveStampDetails(id, '3', ante_meridiem));
    }, []);

    const [imagePreviewData, setImagePreviewData] = useState<imagePreviewDataTypes>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = (image: imagePreviewDataTypes) => {
        setIsModalOpen(true)
        setImagePreviewData(image)
    };
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconRubberStamp />
                    <p className="text-start font-bold w-full">RECEIVE STAMP</p>
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

            <div className="flex flex-col gap-3 w-50 w-full">
                <div className='flex flex-col justify-start gap-[10px]'>
                    <Label className='w-fit' htmlFor="tracking">Tracking no.</Label>
                    <Input placeholder="X-YYYY-####" id="tracking" type="text" value={trackingNo} onChange={handleTrackingNoChange} />
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
            <div>
                <Button onClick={() => handleOpenModal(receivedImg)} variant='link'>
                    View Received Stamp
                </Button>
                <Button onClick={() => handleOpenModal(initialMaricelImg)} variant='link'>
                    View Initial
                </Button>
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
            <ModalImageView
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={imagePreviewData?.title}
            >
                <div className="w-full h-[150px] flex items-center justify-center overflow-hidden p-[10px]">
                    <img className="h-full  object-cover" src={imagePreviewData?.src} alt={imagePreviewData?.title} />
                </div>
            </ModalImageView>
        </div>
    );
}

export default StampReceivedForm;
