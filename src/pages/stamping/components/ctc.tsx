import { IconRubberStamp } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { State, Item } from '../util/stamps-reducer-types';
import { ctcImage, jmtumlosSignature, jmtumlosStamp } from '../data/images';
import { rgb } from 'pdf-lib';
import * as React from 'react';
import { formatDate } from '../util/format-date-time';

export interface CTCProps {
    addItem: (item: Item) => void;
    state: State;
}

export function CTC({ addItem, state }: CTCProps) {
    const [date, setDate] = React.useState<string>('');
    const [time, setTime] = React.useState<string>('');

    React.useEffect(() => {
        const updateSignature = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            setDate(`Date: ${formatDate(new Date())}`);
            setTime(`${hours}:${minutes}:${seconds} +08'00'`);
        };

        updateSignature();
        const interval = setInterval(updateSignature, 1000);
        return () => clearInterval(interval);
    }, []);

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

        // 💡 INAYOS: Binago ang id mula '1' patungong dynamic 'id' variable
        const signature = {
            id: id,
            component: 'StampCtcForm',
            height: 43,
            width: 108,
            x: 20,
            y: 39,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: jmtumlosSignature,
        };

        // 💡 INAYOS: Binago rin dito ang id mula '1' patungong dynamic 'id' variable
        const jmtumlosStampObj = {
            id: id,
            component: 'StampCtcForm',
            height: 49,
            width: 119,
            x: 15,
            y: 45,
            isShown: true,
            color: rgb(190 / 255, 101 / 255, 120 / 255),
            type: 'image',
            content: jmtumlosStamp,
        };

        const stamp = {
            id: id,
            component: 'StampCtcForm',
            height: 96,
            width: 182,
            x: 15,
            y: 25,
            isShown: true,
            type: 'image',
            content: ctcImage,
            subcomponents: [
                signature,
                jmtumlosStampObj,
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 132,
                    y: 66,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 3,
                    content: 'Digitally signed by',
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 132,
                    y: 70,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 3,
                    content: 'Jennifer M. Tumlos',
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 132,
                    y: 74,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 3,
                    content: date,
                },
                {
                    id: id,
                    component: 'StampCtcForm',
                    height: 0,
                    width: 0,
                    x: 132,
                    y: 78,
                    isShown: true,
                    color: rgb(0, 0, 0),
                    type: 'text',
                    size: 3,
                    content: time,
                },
            ],
        };

        addItem(stamp);
    };

    return (
        <Button onClick={handleAddItems} variant="ghost" className="flex justify-start gap-[10px] border px-4 py-4 w-full">
            <IconRubberStamp />
            <p>ADD CTC</p>
        </Button>
    );
}