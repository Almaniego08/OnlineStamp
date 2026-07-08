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
import { IconCalendarMonth, IconUpload } from '@tabler/icons-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IconRubberStamp } from '@tabler/icons-react';
import { PositioningButton } from './positioning-button';
import { IconTrash } from '@tabler/icons-react';
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
interface imagePreviewDataTypes { src?: string | File; title?: string }

function StampReceivedForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {
    const [trackingNo, setTrackingNo] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>('');
    const [initialSrc, setInitialSrc] = useState<string | null>(null);

    const updateReceiveStampDetails = (
        id: string,
        subId: string,
        value: any, // Ginawang any para tumanggap ng string o File object
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

    // BAGONG FUNCTION: Para sa pag-upload ng dynamic Initial signature file
    const handleInitialUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const objectUrl = URL.createObjectURL(file);
            setInitialSrc(objectUrl);

            dispatch({
                type: 'updateReceiveStampDetails',
                payload: {
                    id: id,
                    subId: '5', // TARGET: ID '5' para sa nag-stamp, hindi '4'
                    value: {
                        title: file.name,
                        src: file,
                    }
                }
            });
        }
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

    // Memory clean-up para sa nagawang Object URLs sa browser lifecycle
    useEffect(() => {
        return () => {
            if (initialSrc) {
                URL.revokeObjectURL(initialSrc);
            }
        };
    }, [initialSrc]);

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
                                    handleDateChange(selectedDate);
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

                {/* INYEKSIYON: Input field para sa custom signature initial file selection */}
                <div className='flex flex-col justify-start gap-[10px] border-t pt-2 mt-1'>
                    <Label className='w-fit flex flex-row items-center gap-1 text-xs font-semibold text-muted-foreground' htmlFor="initial-file">
                        <IconUpload size={14} /> Change Initial Image (Optional)
                    </Label>
                    <Input
                        id="initial-file"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleInitialUpload}
                        className="w-full text-xs"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-1 justify-start">
                <Button onClick={() => handleOpenModal(receivedImg)} variant='link' className="text-xs p-0 h-auto pr-2">
                    View Received Stamp
                </Button>
                <Button
                    onClick={() => handleOpenModal(initialSrc ? { src: initialSrc, title: 'Uploaded Initial' } : initialMaricelImg)}
                    variant='link'
                    className="text-xs p-0 h-auto"
                >
                    View Initial
                </Button>
            </div>
            <div className="flex flex-wrap gap-1 justify-start">
                <Button onClick={() => handleOpenModal(receivedImg)} variant='link' className="text-xs p-0 h-auto pr-2">
                    View Received Stamp
                </Button>
                <Button onClick={() => handleOpenModal(initialMaricelImg)} variant='link' className="text-xs p-0 h-auto pr-2">
                    View Head Initial
                </Button>
                {initialSrc && (
                    <Button onClick={() => handleOpenModal({ src: initialSrc, title: 'Uploaded Receiver Initial' })} variant='link' className="text-xs p-0 h-auto">
                        View Receiver Initial
                    </Button>
                )}
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
                    <img
                        className="h-full object-contain"
                        src={typeof imagePreviewData?.src === 'string' ? imagePreviewData.src : (imagePreviewData?.src ? URL.createObjectURL(imagePreviewData.src as File) : '')}
                        alt={imagePreviewData?.title}
                    />
                </div>
            </ModalImageView>
        </div>
    );
}

export default StampReceivedForm;