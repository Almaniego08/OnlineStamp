import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { 
    receivedImg, 
    initialMaricelImg, 
    adamInitial, 
    adamInitial3, 
    anabelleInitialImg, 
    aireezeInitialImg, 
    janineInitialImg, 
    kateInitialImg, 
    vanInitialImg 
} from '../data/images';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
}

export function Received({ addItem, state }: IAppProps) {
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
            x: 50,
            y: 103,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 11,
            content: '',
        };
        const time = {
            id: '3',
            component: 'StampReceivedForm',
            height: 0,
            width: 0,
            x: 50,
            y: 93,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 11,
            content: '',
        };
        const date = {
            id: '2',
            component: 'StampReceivedForm',
            height: 0,
            width: 0,
            x: 43,
            y: 55,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'text',
            size: 13,
            content: '',
        };

        // Default Head Initial (Ms. Maricel) kapag bagong gawa ang stamp
        const headInitial = {
            id: '4',
            component: 'StampReceivedForm',
            height: 65,
            width: 60,
            x: 135,
            y: 75,
            isShown: true,
            type: 'image',
            content: initialMaricelImg,
        };

        const receiverInitial = {
            id: '5',
            component: 'StampReceivedForm',
            height: 45,
            width: 45,
            x: 120,
            y: 75,
            isShown: true,
            type: 'image',
            content: '', 
        };

        const stamp = {
            id: id,
            component: 'StampReceivedForm',
            height: 110,
            width: 170,
            x: 25,
            y: 25,
            isShown: true,
            type: 'image',
            content: receivedImg,
            subcomponents: [
                trackingNo,
                date,
                time,
                headInitial,      
                receiverInitial,  
            ]
        };
        addItem(stamp);
    };

    return (
        <Button onClick={handleAddItems}
            variant='ghost' className='flex justify-start gap-[10px] border px-4 py-4 w-full'>
            <IconRubberStamp />
            <p>ADD RECEIVED</p>
        </Button>
    );
}