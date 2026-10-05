
import { IconClockHour1 } from '@tabler/icons-react';
import AddTileButton from './add-tile-button';
import { State, Item } from '../util/stamps-reducer-types';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
    disabled?: boolean;
}


export function Time({ addItem, state, disabled }: IAppProps) {
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
            color: rgb(0, 0, 0),
            type: 'text',
            size: 13,
            content: '',
        }
        addItem(text)
    }
    return (
        <AddTileButton icon={<IconClockHour1 size={18} />} label="Time" hint="e.g. 9:03 PM" onClick={handleAddItems} disabled={disabled} />
    );
}