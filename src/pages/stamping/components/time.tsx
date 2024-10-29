
import { IconClockHour1 } from '@tabler/icons-react';
import { IconLetterCase } from '@tabler/icons-react';
import { IconCalendarMonth } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { receivedImg, initialMaricelImg } from '../data/images'
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
}


export function Time({ addItem, state }: IAppProps) {
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

        const text = {
            id: id,
            component: 'AddTimeForm',
            height: 0,
            width: 0,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'time',
            size: 16,
            content: '',
        }
        addItem(text)
    }
    return (
        <Button onClick={handleAddItems} variant='ghost' className='flex gap-[10px] border px-4 py-4 w-full'>
            <IconClockHour1 />
            <p>ADD TIME</p>
        </Button>
    );
}