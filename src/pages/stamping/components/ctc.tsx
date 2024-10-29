import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { ctcImage, signitureMaricelImg } from '../data/images'
import { rgb } from 'pdf-lib';

export interface CTC {
    addItem: (item: Item) => void;
    state: State;

}


export function CTC({ addItem, state }: CTC) {

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
            height: 70,
            width: 100,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: signitureMaricelImg,
        }
        const stamp = {
            id: id,
            component: 'StampCtcForm',
            height: 100,
            width: 170,
            x: 25,
            y: 25,
            isShown: true,
            type: 'image',
            content: ctcImage,
            subcomponents: [
                signature
            ]
        }
        addItem(stamp)

    }
    // StampCtcForm
    return (
        <Button onClick={handleAddItems} variant='ghost' className='flex gap-[10px] border px-4 py-4 w-full'>
            <IconRubberStamp />
            <p>ADD CTC</p>
        </Button>
    );
}