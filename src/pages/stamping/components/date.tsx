
import { IconCalendarMonth } from '@tabler/icons-react';
import AddTileButton from './add-tile-button';
import { State, Item } from '../util/stamps-reducer-types';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
    disabled?: boolean;
}

export function Date({ addItem, state, disabled }: IAppProps) {
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
            component: 'AddDateForm',
            height: 0,
            width: 0,
            x: 25,
            y: 25,
            isShown: true,
            color: rgb(0.345, 0.137, 0.655),
            type: 'text',
            size: 12,
            content: '',
        }
        addItem(text)
    }
    return (
        <AddTileButton icon={<IconCalendarMonth size={18} />} label="Date" hint="e.g. 05 OCT 2026" onClick={handleAddItems} disabled={disabled} />
    );
}