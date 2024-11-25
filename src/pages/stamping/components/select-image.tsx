
import { IconLetterCase } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
}


export function Selectfile({ addItem, state }: IAppProps) {
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

        const image = {
            id: id,
            component: 'SelectImageForm',
            height: 100,
            width: 100,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            size: 16,
            content: '',
        }
        addItem(image)
    }
    return (
        <Button onClick={handleAddItems} variant='ghost' className=' justify-start flex gap-[10px] border px-4 py-4 w-full'>
            <IconLetterCase />
            <p>SELECT IMAGE</p>
        </Button>
    );
}