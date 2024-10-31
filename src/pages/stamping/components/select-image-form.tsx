import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { IconLetterCase } from '@tabler/icons-react';

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
};

export default function SelectImageForm({ removeItem, id, dispatch, pdfHeight, pdfWidth }: Props) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setImageFile(file);

            // Create an object URL for the file
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);

            dispatch({
                type: 'updateImageUploadDetails',
                payload: {
                    id: id,
                    value: {
                        title: file.name,
                        src: objectUrl.slice(5),
                    }
                }
            });
        }
    };

    useEffect(() => {
        // Clean up the object URL on unmount to avoid memory leaks
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [imageSrc]);

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconLetterCase />
                    <p className="text-start font-bold w-full">ADD IMAGE</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div className='flex flex-row gap-[10px] items-end'>
                <div className='flex flex-col justify-start flex-1'>
                    <Label className='w-fit' htmlFor="image">Select Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>
            {imageSrc && (
                <div className="">
                    <img src={imageSrc} alt={imageFile?.name} className="w-32 h-32 rounded-md object-contain" />
                </div>
            )}
            <PositioningButton
                pdfHeight={pdfHeight}
                pdfWidth={pdfWidth}
                dispatch={dispatch}
                id={id}
            />
        </div>
    );
}
