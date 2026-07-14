import { useState, useEffect } from 'react';
import {
    signitureMaricelImg,
    maricelNameStampImg, aireezeNameStampImg, aireezeSignImg,
    ctcImage
} from "../data/images";
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDate } from '../util/format-date-time';
import {
    IconTrash,
    IconRubberStamp,
    IconCurrentLocation,
    IconX,
    IconCalendarMonth,
    IconUserPin
} from '@tabler/icons-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
    isEditing: string;
    setIsEditingPosition: (id: string) => void;
    state: any;
}

const SIGNERS = [
    {
        id: 'anabelle',
        name: 'Anabelle G. Valencia',
        signature: maricelNameStampImg,
        stamp: maricelNameStampImg,
        defaultSigWidth: 130,
        defaultSigHeight: 55,
        defaultStampWidth: 140,
        defaultStampHeight: 50,
    },
    {
        id: 'aireeze',
        name: 'Aireeze V. Bautista',
        signature: aireezeSignImg,
        stamp: aireezeNameStampImg,
        defaultSigWidth: 65,
        defaultSigHeight: 65,
        defaultStampWidth: 100,
        defaultStampHeight: 35,
    }
];

export default function StampCtcForm({
    removeItem,
    id,
    dispatch,
    pdfHeight,
    pdfWidth,
    isEditing,
    setIsEditingPosition,
    state
}: Props) {
    const currentItem = state?.items?.find((item: any) => item.id === id);

    const signatureSubcomponent = currentItem?.subcomponents?.[0];
    const stampSubcomponent = currentItem?.subcomponents?.[1];
    const nameTextSubcomponent = currentItem?.subcomponents?.[3];
    const dateSubcomponent = currentItem?.subcomponents?.[4];
    const timeSubcomponent = currentItem?.subcomponents?.[5];

    const dateStringValue = dateSubcomponent?.content || '';
    const timeStringValue = typeof timeSubcomponent?.content === 'string' ? timeSubcomponent.content : '';

    const activeSignerName = nameTextSubcomponent?.content || 'Anabelle G. Valencia';
    const activeSigner = SIGNERS.find(s => s.name === activeSignerName) || SIGNERS[0];

    const currentSigWidth = signatureSubcomponent?.width || activeSigner.defaultSigWidth;
    const currentStampWidth = stampSubcomponent?.width || activeSigner.defaultStampWidth;

    const parseTimeParts = (timeStr: string) => {
        if (!timeStr) return { hh: "12", mm: "00", ss: "00" };
        const cleanTime = timeStr.split(" ")[0];
        const parts = cleanTime.split(":");
        return {
            hh: parts[0] || "00",
            mm: parts[1] || "00",
            ss: parts[2] || "00"
        };
    };

    const initialParts = parseTimeParts(timeStringValue);
    const [hours, setHours] = useState(initialParts.hh);
    const [minutes, setMinutes] = useState(initialParts.mm);
    const [seconds, setSeconds] = useState(initialParts.ss);

    useEffect(() => {
        if (timeStringValue) {
            const parts = parseTimeParts(timeStringValue);
            setHours(parts.hh);
            setMinutes(parts.mm);
            setSeconds(parts.ss);
        }
    }, [timeStringValue]);

    const [calendarDate, setCalendarDate] = useState<Date | undefined>(() => {
        if (!dateStringValue) return new Date();
        const cleanString = dateStringValue.replace('Date: ', '');
        const parsed = window.Date.parse(cleanString);
        return isNaN(parsed) ? new Date() : new Date(parsed);
    });

    useEffect(() => {
        if (dateStringValue) {
            const cleanString = dateStringValue.replace('Date: ', '');
            const parsed = window.Date.parse(cleanString);
            if (!isNaN(parsed)) {
                setCalendarDate(new Date(parsed));
            }
        }
    }, [dateStringValue]);

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        setCalendarDate(selectedDate);
        const formattedDateText = `Date: ${formatDate(selectedDate)}`;

        dispatch({
            type: 'updateSubcomponentText',
            payload: { parentId: id, subcomponentIndex: 4, value: formattedDateText }
        });
    };

    const updateGlobalTime = (newHH: string, newMM: string, newSS: string) => {
        const fullTimeFormat = `${newHH}:${newMM}:${newSS} +08'00'`;
        dispatch({
            type: 'updateSubcomponentText',
            payload: { parentId: id, subcomponentIndex: 5, value: fullTimeFormat }
        });
    };

    const updateSubcomponentSize = (subcomponentIndex: number, width: number, height: number) => {
        dispatch({
            type: 'updateSubcomponentSize',
            payload: { parentId: id, subcomponentIndex, width, height }
        });
    };

    const handleSignerChange = (signerId: string) => {
        const selected = SIGNERS.find(s => s.id === signerId);
        if (!selected) return;

        dispatch({
            type: 'updateSubcomponentText',
            payload: { parentId: id, subcomponentIndex: 0, value: selected.signature }
        });

        dispatch({
            type: 'updateSubcomponentText',
            payload: { parentId: id, subcomponentIndex: 1, value: selected.stamp }
        });

        dispatch({
            type: 'updateSubcomponentText',
            payload: { parentId: id, subcomponentIndex: 3, value: selected.name }
        });

        updateSubcomponentSize(0, selected.defaultSigWidth, selected.defaultSigHeight);
        updateSubcomponentSize(1, selected.defaultStampWidth, selected.defaultStampHeight);
    };

    const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const secondOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px] bg-card text-card-foreground">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] items-center">
                    <IconRubberStamp />
                    <p className="text-start font-bold w-full">CERTIFIED TRUE COPY STAMP</p>
                </div>
                <div>
                    <Button onClick={() => setIsEditingPosition(id)} variant='ghost'>
                        <IconCurrentLocation style={{ color: isEditing === id ? 'green' : 'red' }} />
                    </Button>
                    <Button onClick={() => removeItem(id)} variant='ghost'>
                        <IconTrash style={{ color: 'red' }} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-[10px] items-stretch justify-center">
                <div className="flex-1 flex flex-col items-center justify-center border rounded-md w-auto p-[10px] ">
                    <div className="bg-white rounded-xl p-2">
                        <img className="object-contain w-auto h-[70px]" src={ctcImage.src} alt={ctcImage.title} />
                    </div>
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold text-xs mt-1">Certified True Copy</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border rounded-md w-auto p-[10px]">
                    <div className="bg-white rounded-xl p-2">
                        <img
                            className="object-contain w-auto h-[70px]"
                            src={signatureSubcomponent?.content?.src || activeSigner.signature?.src}
                            alt={signatureSubcomponent?.content?.title || activeSigner.signature?.title}
                        />
                    </div>
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold text-xs mt-1">Signature Preview</p>
                </div>
            </div>

            {/* Inputs Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3">
                {/* Select Signer Dropdown */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor={`signer-select-${id}`} className="flex items-center gap-1">
                        <IconUserPin size={16} /> Select Document Signer
                    </Label>
                    <Select value={activeSigner.id} onValueChange={handleSignerChange}>
                        <SelectTrigger id={`signer-select-${id}`} className="w-full">
                            <SelectValue placeholder="Select Signer" />
                        </SelectTrigger>
                        <SelectContent>
                            {SIGNERS.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic Size Scaling Sliders */}
                <div className="flex flex-col gap-3 p-3 border rounded-md sm:col-span-2 bg-secondary/10">
                    <span className="text-xs font-bold text-muted-foreground block">
                        Adjust Object Sizing (Proportional Aspect Ratio)
                    </span>

                    {/* Signature Scaling Track */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[11px] font-medium">
                            <span>Signature Scaling Width</span>
                            <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{currentSigWidth}px</span>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="180"
                            value={currentSigWidth}
                            onChange={(e) => {
                                const newW = Number(e.target.value);
                                const scaleFactor = activeSigner.defaultSigHeight / activeSigner.defaultSigWidth;
                                updateSubcomponentSize(0, newW, Math.round(newW * scaleFactor));
                            }}
                            className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Name Stamp Scaling Track */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[11px] font-medium">
                            <span>Name Stamp Scaling Width</span>
                            <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{currentStampWidth}px</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="200"
                            value={currentStampWidth}
                            onChange={(e) => {
                                const newW = Number(e.target.value);
                                const scaleFactor = activeSigner.defaultStampHeight / activeSigner.defaultStampWidth;
                                updateSubcomponentSize(1, newW, Math.round(newW * scaleFactor));
                            }}
                            className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Dynamic Location Nudging Sliders */}
                <div className="flex flex-col gap-4 p-3 border rounded-md sm:col-span-2 bg-secondary/10">
                    <span className="text-xs font-bold text-muted-foreground block">
                        Fine-Tune Signature & Name Stamp Placement
                    </span>

                    {/* Signature Position */}
                    <div className="flex flex-col gap-2 border-b pb-3 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Signature Positioning</span>
                        
                        {/* Signature X */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[11px] font-medium">
                                <span>Horizontal Position (X)</span>
                                <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{signatureSubcomponent?.x || 0}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="300"
                                value={signatureSubcomponent?.x || 0}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'updateSubcomponentPosition',
                                        payload: { 
                                            parentId: id, 
                                            subcomponentIndex: 0, 
                                            x: Number(e.target.value),
                                            y: signatureSubcomponent?.y || 0
                                        }
                                    });
                                }}
                                className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Signature Y */}
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex justify-between text-[11px] font-medium">
                                <span>Vertical Position (Y)</span>
                                <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{signatureSubcomponent?.y || 0}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="300"
                                value={signatureSubcomponent?.y || 0}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'updateSubcomponentPosition',
                                        payload: { 
                                            parentId: id, 
                                            subcomponentIndex: 0, 
                                            x: signatureSubcomponent?.x || 0,
                                            y: Number(e.target.value)
                                        }
                                    });
                                }}
                                className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Name Stamp Position */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Name Stamp Positioning</span>
                        
                        {/* Name Stamp X */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[11px] font-medium">
                                <span>Horizontal Position (X)</span>
                                <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{stampSubcomponent?.x || 0}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="300"
                                value={stampSubcomponent?.x || 0}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'updateSubcomponentPosition',
                                        payload: { 
                                            parentId: id, 
                                            subcomponentIndex: 1, 
                                            x: Number(e.target.value),
                                            y: stampSubcomponent?.y || 0
                                        }
                                    });
                                }}
                                className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Name Stamp Y */}
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex justify-between text-[11px] font-medium">
                                <span>Vertical Position (Y)</span>
                                <span className="font-mono bg-background px-1.5 py-0.5 rounded border">{stampSubcomponent?.y || 0}px</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="300"
                                value={stampSubcomponent?.y || 0}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'updateSubcomponentPosition',
                                        payload: { 
                                            parentId: id, 
                                            subcomponentIndex: 1, 
                                            x: stampSubcomponent?.x || 0,
                                            y: Number(e.target.value)
                                        }
                                    });
                                }}
                                className="w-full accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`date-input-${id}`}>Stamp Date</Label>
                    <Popover>
                        <PopoverTrigger id={`date-input-${id}`} asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !calendarDate && "text-muted-foreground"
                                )}
                            >
                                <IconCalendarMonth className="mr-2 h-4 w-4" />
                                {calendarDate ? format(calendarDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={calendarDate} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Time Select Dropdowns */}
                <div className="flex flex-col gap-1.5">
                    <Label>Stamp Time</Label>
                    <div className="grid grid-cols-4 items-center gap-1 sm:flex sm:flex-row sm:gap-1.5 w-full">
                        <div className="sm:flex-1">
                            <Select value={hours} onValueChange={(val) => { setHours(val); updateGlobalTime(val, minutes, seconds); }}>
                                <SelectTrigger className="w-full px-2 sm:px-3">
                                    <SelectValue placeholder="HH" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {hourOptions.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="sm:flex-1 relative flex items-center">
                            <span className="hidden sm:inline absolute -left-1 sm:-left-1.5 text-muted-foreground font-bold select-none">:</span>
                            <Select value={minutes} onValueChange={(val) => { setMinutes(val); updateGlobalTime(hours, val, seconds); }}>
                                <SelectTrigger className="w-full px-2 sm:px-3">
                                    <SelectValue placeholder="MM" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {minuteOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="sm:flex-1 relative flex items-center">
                            <span className="hidden sm:inline absolute -left-1 sm:-left-1.5 text-muted-foreground font-bold select-none">:</span>
                            <Select value={seconds} onValueChange={(val) => { setSeconds(val); updateGlobalTime(hours, minutes, val); }}>
                                <SelectTrigger className="w-full px-2 sm:px-3">
                                    <SelectValue placeholder="SS" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {secondOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <span className="text-[10px] sm:text-xs bg-secondary text-secondary-foreground rounded py-2 text-center font-mono border block w-full sm:w-auto sm:px-2 select-none truncate">
                            +08'00'
                        </span>
                    </div>
                </div>
            </div>

            {/* Positioning Button Panel */}
            <div
                className={`bg-background bg-opacity-50 rounded-md p-[5px] flex flex-row items-center transition-all duration-300 ${isEditing === id ? 'fixed' : 'relative'}`}
                style={{
                    width: isEditing === id ? 'fit-content' : '100%',
                    bottom: '5px',
                    left: isEditing === id ? '50%' : '0%',
                    transform: isEditing === id ? 'translateX(-50%) scale(1)' : 'translateX(0) scale(0.95)',
                    opacity: isEditing === id ? 1 : 0.95,
                    zIndex: isEditing === id ? 50 : 1,
                }}
            >
                <PositioningButton pdfHeight={pdfHeight} pdfWidth={pdfWidth} dispatch={dispatch} id={id} />
                {isEditing === id ? (
                    <Button onClick={() => setIsEditingPosition('')} className="text-red-500 h-full" variant="ghost">
                        <IconX />
                    </Button>
                ) : null}
            </div>
        </div>
    );
}