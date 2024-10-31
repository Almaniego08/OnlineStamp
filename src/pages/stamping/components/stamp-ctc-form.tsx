import { signitureMaricelImg, receivedImg } from "../data/images";
import ModalImageView from "./modal-image-view";
import { PositioningButton } from './positioning-button';
import { IconCalendarMonth } from '@tabler/icons-react';
import { Button } from "@/components/custom/button";
import { IconTrash } from '@tabler/icons-react';
import { IconRubberStamp } from '@tabler/icons-react';

type Props = {
    removeItem: (id: string) => void;
    id: string;
    dispatch: (action: any) => void;
    pdfHeight: number;
    pdfWidth: number;
}

export default function StampCtcForm({ removeItem, id, dispatch, pdfHeight, pdfWidth }: Props) {
    return (
        <div className="flex flex-col gap-3 border rounded-md p-[10px] ">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-[10px] ">
                    <IconRubberStamp />
                    <p className="text-start font-bold w-full">CERTIFIED TRUE COPY STAMP</p>
                </div>
                <Button onClick={() => removeItem(id)} variant='destructive'>
                    <IconTrash />
                </Button>
            </div>
            <div className="flex flex-wrap gap-[10px] items-stretch justify-center">
                <div className="flex-1 flex flex-col items-center justify-center border w-auto p-[10px]">
                    <img className="object-contain w-auto h-[70px]" src={receivedImg.src} alt={receivedImg.title} />
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold">Certified True Copy</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border w-auto p-[10px]">
                    <img className="object-contain w-auto h-[70px]" src={signitureMaricelImg.src} alt={signitureMaricelImg.title} />
                    <p className="text-nowrap font-regular md:font-semibold lg:font-bold">Signature</p>
                </div>
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