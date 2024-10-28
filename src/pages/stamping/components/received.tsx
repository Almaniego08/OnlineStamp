import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { receivedImg } from '../data/images'
import { rgb } from 'pdf-lib';


export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
    pdfHeight: number;
    pdfWidth: number;
}


export function Received({ addItem, pdfHeight, pdfWidth, state }: IAppProps) {



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
            height: pdfHeight,
            width: pdfWidth,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'text',
            content: '',
        };

        const date = {
            id: '2',
            component: 'StampReceivedForm',
            height: pdfHeight,
            width: pdfWidth,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'date',
            content: '',
        }
        const time = {
            id: '3',
            component: 'StampReceivedForm',
            height: pdfHeight,
            width: pdfWidth,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'time',
            content: '',
        }

        const stamp = {
            id: id,
            component: 'StampReceivedForm',
            height: pdfHeight,
            width: pdfWidth,
            x: 25,
            y: 25,
            isShown: true,
            type: 'image',
            content: receivedImg,
            subcomponents: [
                trackingNo,
                date,
                time,
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