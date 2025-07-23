import { signitureMaricelImg, ctcImage } from "../data/images";
import { PositioningButton } from './positioning-button';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { IconRubberStamp } from '@tabler/icons-react';
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

export default function StampCtcForm({ removeItem, id, dispatch, pdfHeight, pdfWidth, isEditing, setIsEditingPosition }: Props) {

    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px] ">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconRubberStamp />
                    <p className="text-start font-bold w-full">CERTIFIED TRUE COPY STAMP</p>
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
            <div className="flex flex-wrap gap-[10px] items-stretch justify-center">
                <div className="flex-1 flex flex-col items-center justify-center border w-auto p-[10px]">
                    <img className="object-contain w-auto h-[70px]" src={ctcImage.src} alt={ctcImage.title} />
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold">Certified True Copy</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border w-auto p-[10px]">
                    <img className="object-contain w-auto h-[70px]" src={signitureMaricelImg.src} alt={signitureMaricelImg.title} />
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold">Signature</p>
                </div>
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
    )
}