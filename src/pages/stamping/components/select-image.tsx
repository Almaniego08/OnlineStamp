
import { IconPhoto } from '@tabler/icons-react';
import AddTileButton from './add-tile-button';
import { State, Item } from '../util/stamps-reducer-types';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
    disabled?: boolean;
}


export function Selectfile({ addItem, state, disabled }: IAppProps) {
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
        <AddTileButton icon={<IconPhoto size={18} />} label="Image" hint="PNG or JPG" onClick={handleAddItems} disabled={disabled} />
    );
}