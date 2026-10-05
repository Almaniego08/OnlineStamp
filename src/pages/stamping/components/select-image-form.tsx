import React, { useState, useEffect, useRef } from 'react';
import { IconPhotoUp } from '@tabler/icons-react';
import { Button } from "@/components/custom/button";
import { toast } from '@/components/ui/use-toast';
import ImageSizeButton from './image-size-button';
import type { ItemFormProps } from './dynamic-component-renderer';

const ACCEPTED = ['image/png', 'image/jpeg'];

export default function SelectImageForm({ id, item, dispatch }: ItemFormProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!ACCEPTED.includes(file.type)) {
            toast({ variant: 'destructive', title: 'PNG o JPG lang ang puwede', description: `"${file.name}" ay hindi supported.` });
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setImageFile(file);
        setImageSrc(objectUrl);

        // Kunin ang sukat para manatili ang aspect ratio (100pt ang default na lapad)
        const img = new Image();
        img.onload = () => {
            const newWidth = 100;
            const newHeight = Math.floor(newWidth * (img.height / img.width));
            dispatch({
                type: 'updateImageUploadDetails',
                payload: {
                    id: id,
                    value: { title: file.name, src: file },
                    width: newWidth,
                    height: newHeight,
                }
            });
        };
        img.src = objectUrl;
    };

    // Linisin ang object URL kapag pinalitan o tinanggal
    useEffect(() => {
        return () => {
            if (imageSrc) URL.revokeObjectURL(imageSrc);
        };
    }, [imageSrc]);

    return (
        <div className='flex flex-col gap-3'>
            <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className="hidden" onChange={handleImageUpload} />
            {imageSrc ? (
                <div className='flex items-center gap-3'>
                    <div className='flex size-16 shrink-0 items-center justify-center rounded-md border bg-[repeating-conic-gradient(#e5e7eb_0_25%,#fff_0_50%)] bg-[length:12px_12px] p-1'>
                        <img src={imageSrc} alt={imageFile?.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm' title={imageFile?.name}>{imageFile?.name}</p>
                        <Button variant="link" className="h-auto p-0 text-xs" onClick={() => inputRef.current?.click()}>
                            Change image
                        </Button>
                    </div>
                    <ImageSizeButton dispatch={dispatch} id={id} width={item.width} />
                </div>
            ) : (
                <Button variant="outline" className="w-full gap-2" onClick={() => inputRef.current?.click()}>
                    <IconPhotoUp size={16} /> Choose image (PNG / JPG)
                </Button>
            )}
        </div>
    );
}
