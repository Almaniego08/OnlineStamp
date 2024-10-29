import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { receivedImg, initialMaricelImg } from '../data/images'
import { rgb } from 'pdf-lib';


export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
}


export function Received({ addItem,state }: IAppProps) {



    const getMaxId = (): string => {
        return state.items.reduce((max, item) => {
            if (item.id) {
                return Math.max(max, parseInt(item.id, 10));
            }
            return max;
        }, 0).toString();
    };


    const handleAddItems = () => {
        const id = String(Number(getMaxId()) + 1);

        const trackingNo = {
            id: '1',
            component: 'StampReceivedForm',
            height: 0,
            width: 0,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'text',
            size: 16,
            content: '',
        };

        const date = {
            id: '2',
            component: 'StampReceivedForm',
            height: 0,
            width: 0,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'text',
            size: 16,
            content: '',
        }
        const time = {
            id: '3',
            component: 'StampReceivedForm',
            height: 0,
            width: 0,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'text',
            size: 16,
            content: '',
        }

        const initial = {
            id: '3',
            component: 'StampReceivedForm',
            height: 70,
            width: 100,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: initialMaricelImg,
        }

        const stamp = {
            id: id,
            component: 'StampReceivedForm',
            height: 100,
            width: 150,
            x: 25,
            y: 25,
            isShown: true,
            type: 'image',
            content: receivedImg,
            subcomponents: [
                trackingNo,
                date,
                time,
                initial
            ]
        };
        addItem(stamp)
    }

    return (
        <Button onClick={handleAddItems}
            variant='ghost' className='flex gap-[10px] border px-4 py-4 w-full'>
            <IconRubberStamp />
            <p>ADD RECEIVED</p>
        </Button>
    );
}