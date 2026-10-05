import { IconRubberStamp } from '@tabler/icons-react';
import AddTileButton from './add-tile-button';
import { State, Item } from '../util/stamps-reducer-types';
import { released_stamp, initialMLC } from '../data/images';
import { rgb } from 'pdf-lib';

export interface IAppProps {
    addItem: (item: Item) => void;
    state: State;
    disabled?: boolean;
}

export function Released({ addItem, state, disabled }: IAppProps) {
    const getMaxId = (): string => {
        return state.items
            .reduce((max, item) => {
                if (item.id) {
                    const numericId = parseInt(item.id, 10);

                    if (!isNaN(numericId)) {
                        return Math.max(max, numericId);
                    }
                }

                return max;
            }, 0)
            .toString();
    };

    const handleAddItems = () => {
        const id = String(Number(getMaxId()) + 1);

        /*
         * Subcomponent IDs:
         *
         * 1 = Tracking Number
         * 2 = Date
         * 3 = Time
         * 4 = Approver Initial
         * 5 = Released By Signature
         * 6 = Receiver Name
         */

        const trackingNo: Item = {
            id: '1',
            component: 'StampReleasedForm',
            height: 0,
            width: 0,
            x: 78,
            y: 81,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 8,
            content: '',
        };

        const date: Item = {
            id: '2',
            component: 'StampReleasedForm',
            height: 0,
            width: 0,
            x: 65,
            y: 63,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 7,
            content: '',
        };

        const time: Item = {
            id: '3',
            component: 'StampReleasedForm',
            height: 0,
            width: 0,
            x: 65,
            y: 71,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 9,
            content: '',
        };

        /*
         * Approver Initial
         *
         * Maricel L. Caballero
         */
        const approverInitial: Item = {
            id: '4',
            component: 'StampReleasedForm',
            height: 30,
            width: 25,
            x: 155,
            y: 40,
            isShown: true,
            type: 'image',
            content: initialMLC,
        };

        /*
         * Released By Signature
         *
         * This will be updated by StampReleasedForm
         * when the released-by person is selected.
         */
        const releasedBy: Item = {
            id: '5',
            component: 'StampReleasedForm',
            height: 38,
            width: 50,
            x: 65,
            y: 28,
            isShown: true,
            type: 'image',
            content: '',
        };

        /*
         * Receiver Name
         *
         * This will be updated by StampReleasedForm
         * when the receiver is selected.
         */
        const receiverName: Item = {
            id: '6',
            component: 'StampReleasedForm',
            height: 0,
            width: 0,
            x: 65,
            y: 55,
            isShown: true,
            type: 'text',
            color: rgb(0.345, 0.137, 0.655),
            size: 7,
            content: '',
        };

        /*
         * RELEASED STAMP
         */
        const stamp: Item = {
            id,
            component: 'StampReleasedForm',
            height: 110,
            width: 170,
            x: 25,
            y: 25,
            isShown: true,
            type: 'image',
            content: released_stamp,
            subcomponents: [
                trackingNo,
                date,
                time,
                approverInitial,
                releasedBy,
                receiverName,
            ],
        };

        addItem(stamp);
    };

    return (
        <AddTileButton icon={<IconRubberStamp size={18} />} label="RELEASED" hint="Stamp + signature" onClick={handleAddItems} disabled={disabled} />
    );
}