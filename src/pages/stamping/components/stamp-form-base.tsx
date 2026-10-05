import { useEffect, useState } from "react";
import type { StampDispatch } from '../util/stamps-reducer-types';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/custom/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { IconCalendarMonth, IconUserCheck, IconUserEdit } from "@tabler/icons-react";
import { format } from "date-fns";
import ModalImageView from "./modal-image-view";
import { timeNowConvert, timeString, formatDate } from "../util/format-date-time";

type ImageData = { title: string; src: string };

export type StampPerson = {
    id: string;
    label: string;
    /* pangalan na nakasulat sa ilalim ng pirma */
    fullName: string;
    data: ImageData;
};

export type StampFormConfig = {
    stampImage: ImageData;
    approver: { label: string; data: ImageData };
    people: StampPerson[];
    defaultPersonId: string;
    personLabel: string;
};

type Props = StampFormConfig & {
    id: string;
    dispatch: StampDispatch;
};

/*
 * Subcomponent IDs sa loob ng stamp:
 * 1 = Tracking No.  2 = Date  3 = Time  4 = Approver initial  5 = Signature  6 = Pangalan
 */
export default function StampFormBase({ id, dispatch, stampImage, approver, people, defaultPersonId, personLabel }: Props) {
    const [trackingNo, setTrackingNo] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>("");
    const [personId, setPersonId] = useState<string>(defaultPersonId);
    const [dateOpen, setDateOpen] = useState(false);
    const [preview, setPreview] = useState<ImageData | null>(null);

    const update = (subId: string, value: string | ImageData) =>
        dispatch({ type: "updateReceiveStampDetails", payload: { id, subId, value } });

    const handleDateChange = (selected: Date | undefined) => {
        if (!selected) return;
        setDate(selected);
        setDateOpen(false);
        update("2", formatDate(selected));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        setTime(e.target.value);
        update("3", timeString(e.target.value));
    };

    const handlePersonChange = (nextId: string) => {
        const person = people.find((p) => p.id === nextId);
        if (!person) return;
        setPersonId(nextId);
        update("5", person.data);
        update("6", person.fullName);
    };

    const setNow = () => {
        const now = new Date();
        const { military_time, ante_meridiem } = timeNowConvert(now);
        setDate(now);
        setTime(military_time);
        update("2", formatDate(now));
        update("3", ante_meridiem);
    };

    // Default values: ngayon, approver initial, at default na tao
    useEffect(() => {
        setNow();
        update("4", approver.data);
        handlePersonChange(defaultPersonId);
    }, [id]);

    const person = people.find((p) => p.id === personId);

    const thumbnails: { label: string; image?: ImageData }[] = [
        { label: "Stamp", image: stampImage },
        { label: "Initial", image: approver.data },
        { label: "Signature", image: person?.data },
    ];

    return (
        <>
            {/* TRACKING NUMBER */}
            <div className="flex flex-col gap-2">
                <Label htmlFor={`tracking-${id}`}>Tracking No.</Label>
                <Input
                    placeholder="X-YYYY-####"
                    id={`tracking-${id}`}
                    value={trackingNo}
                    onChange={(e) => {
                        setTrackingNo(e.target.value);
                        update("1", e.target.value);
                    }}
                    autoFocus
                />
            </div>

            {/* PERSON + APPROVER */}
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`person-${id}`} className="flex items-center gap-1">
                        <IconUserEdit size={14} /> {personLabel}
                    </Label>
                    <Select value={personId} onValueChange={handlePersonChange}>
                        <SelectTrigger id={`person-${id}`}>
                            <SelectValue placeholder={`Select ${personLabel.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {people.map((p) => (
                                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1">
                        <IconUserCheck size={14} /> Approver initial
                    </Label>
                    <div className="flex h-9 items-center truncate rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground" title="Fixed approver">
                        {approver.label}
                    </div>
                </div>
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-[1fr_auto] items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                    <Label htmlFor={`date-${id}`}>Date</Label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger id={`date-${id}`} asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <IconCalendarMonth className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} defaultMonth={date} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`time-${id}`}>Time</Label>
                    <Input id={`time-${id}`} type="time" value={time} onChange={handleTimeChange} />
                </div>
                <Button variant="ghost" onClick={setNow} title="Set date and time to now">
                    Now
                </Button>
            </div>

            {/* PREVIEW */}
            <div className="flex items-center gap-2 border-t pt-3">
                <span className="text-xs text-muted-foreground">Preview:</span>
                {thumbnails.map(({ label, image }) =>
                    image?.src ? (
                        <button
                            key={label}
                            type="button"
                            onClick={() => setPreview(image)}
                            title={`View ${label.toLowerCase()}`}
                            className="flex h-10 w-14 items-center justify-center rounded border bg-white p-0.5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <img src={image.src} alt={label} className="max-h-full max-w-full object-contain" />
                        </button>
                    ) : null,
                )}
            </div>

            <ModalImageView isOpen={!!preview} onClose={() => setPreview(null)} title={preview?.title}>
                <div className="flex h-[200px] w-full items-center justify-center rounded-md bg-white p-3">
                    {preview?.src && <img className="max-h-full max-w-full object-contain" src={preview.src} alt={preview.title} />}
                </div>
            </ModalImageView>
        </>
    );
}
