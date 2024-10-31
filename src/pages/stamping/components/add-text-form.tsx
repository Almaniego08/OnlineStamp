import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IconLetterCase } from '@tabler/icons-react';
import TextSizeButton from './text-size-button';
type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
}

export default function AddTextForm({ removeItem, id, dispatch, pdfHeight, pdfWidth }: Props) {
    const [text, setText] = useState<string>('');



    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const new_value = e.target.value;
        setText(new_value);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: new_value }
        });
    };

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconLetterCase />
                    <p className="text-start font-bold w-full">ADD TEXT</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div className='flex flex-row-gap-[10px items-end gap-[10px]'>
                <div className='flex flex-col justify-start  flex-1'>
                    <Label className='w-fit' htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(e)}
                        className="w-full"
                    />
                </div>
                <TextSizeButton />
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