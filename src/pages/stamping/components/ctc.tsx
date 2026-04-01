import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { ctcImage, signitureMaricelImg, maricelNameStampImg } from '../data/images'
import { rgb } from 'pdf-lib';
import * as React from 'react'
export interface CTC {
    addItem: (item: Item) => void;
    state: State;

}


export function CTC({ addItem, state }: CTC) {

    const [date, setDate] = React.useState<string>('')
    const [time, setTime] = React.useState<string>('')
    React.useEffect(() => {
        const updateSignature = () => {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            setDate(`Date: ${day}/${month}/${year}`)
            setTime(`${hours}:${minutes}:${seconds} +08'00'`)

        };

        updateSignature();
        // Optional: auto-update every second
        const interval = setInterval(updateSignature, 1000);
        return () => clearInterval(interval);
    }, []);

    const getMaxId = (): string => {
        return state.items.reduce((max, item) => {
            if (item.id) {
                return Math.max(max, parseInt(item.id, 10));
            }
            return max;
        }, 0).toString();
    };

    const handleAddItems = () => {
        const id = String(Number(getMaxId()) + 1)

        const signature = {
            id: '1',
            component: 'StampCtcForm',
            height: 55,
            width: 130,
            x: -5,
            y: 30,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: signitureMaricelImg,
        }
        const maricelStamp = {
            id: '1',
            component: 'StampCtcForm',
            height: 50,
            width: 140,
            x: -10,
            y: 52,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: maricelNameStampImg,
        }
        maricelNameStampImg
        const stamp = {
            id: id,
            component: 'StampCtcForm',
            height: 90,
            width: 170,
            x: 15,
            y: 25,
            isShown: true,
            type: 'image',
            content: ctcImage,
            subcomponents: [
                signature,
                maricelStamp,
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 110,
                    y: 65,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 4,
                    content: 'Digitally signed by',
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 110,
                    y: 70,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 4,
                    content: 'Anabelle G. Valencia',
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 110,
                    y: 75,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 4,
                    content: date,
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 110,
                    y: 80,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 4,
                    content: time,
                }
            ]
        }
        addItem(stamp)

        // const digitallySignedBy = {
        //     id: id,
        //     component: 'StampCtcForm',
        //     height: 0,
        //     width: 0,
        //     x: 25,
        //     y: 25,
        //     isShown: true,
        //     color: rgb(0, 0, 0),
        //     type: 'text',
        //     size: 13,
        //     content: '',
        // }
        // addItem(digitallySignedBy)
    }
    // StampCtcForm
    return (
        <Button onClick={handleAddItems} variant='ghost' className='flex justify-start gap-[10px] border px-4 py-4 w-full'>
            <IconRubberStamp />
            <p>ADD CTC</p>
        </Button>
    );
}