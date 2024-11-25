import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { IconLetterCase } from '@tabler/icons-react';
import { IconCurrentLocation, IconX } from '@tabler/icons-react';
import ImageSizeButton from './image-size-button';

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
    isEditing: string;
    setIsEditingPosition: (id: string) => void;
};

export default function SelectImageForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setImageFile(file);

            // Create an object URL for the file
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);

            // Create an image element to load the file and get its dimensions
            const img = new Image();
            img.src = objectUrl;

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                // Set the new dimensions keeping the aspect ratio
                const newWidth = 100; // Fixed width
                const aspectRatio = originalHeight / originalWidth;
                const newHeight = Math.floor(newWidth * aspectRatio); // Calculate new height
                dispatch({
                    type: 'updateImageUploadDetails',
                    payload: {
                        id: id,
                        value: {
                            title: file.name,
                            src: file,
                        },
                        width: newWidth,
                        height: newHeight,
                    }
                });

                // Optionally clean up the object URL after usage
                URL.revokeObjectURL(objectUrl);
            };
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
            <div className='flex flex-row gap-[10px] items-end'>
                <div className='flex flex-col justify-start flex-1 gap-[10px]'>
                    <Label className='w-fit' htmlFor="image">Select Image</Label>
                    <Input id="image" type="file" accept="image/png" onChange={handleImageUpload} />
                </div>
            </div>
            <div>
                {imageSrc && (
                    <div>
                        <div className="">
                            <img src={imageSrc} alt={imageFile?.name} className="w-32 h-32 rounded-md object-contain" />
                        </div>
                        <ImageSizeButton dispatch={dispatch} id={id} />
                    </div>
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
        </div>
    );
}
