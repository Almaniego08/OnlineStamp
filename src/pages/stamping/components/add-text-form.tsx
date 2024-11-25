import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IconLetterCase } from '@tabler/icons-react';
import TextSizeButton from './text-size-button';
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

export default function AddTextForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {
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
            <div className='flex flex-row-gap-[10px items-end gap-[10px]'>
                <div className='flex flex-col gap-[10px] justify-start  flex-1'>
                    <Label className='w-fit' htmlFor="time">Text</Label>
                    <Input
                        placeholder='Enter text'
                        id="time"
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(e)}
                        className="w-full"
                    />
                </div>
                <TextSizeButton dispatch={dispatch} id={id} />
            </div>
            <div
                className={`bg-background  rounded-md p-[5px] flex flex-row items-center transition-all duration-300  ${isEditing === id ? 'fixed border' : 'relative'
                    }`}
                style={{
                    width: isEditing === id ? 'fit-content' : '100%',
                    bottom: '5px',
                    left: isEditing === id ? '50%' : '0%',
                    transform: isEditing === id ? 'translateX(-50%) scale(1)' : 'translateX(0) scale(0.95)',
                    opacity: isEditing === id ? 1 : 0.95,
                    zIndex: isEditing === id ? 50 : 1,
                    backdropFilter: 'blur(8px)', // Adjust blur strength
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