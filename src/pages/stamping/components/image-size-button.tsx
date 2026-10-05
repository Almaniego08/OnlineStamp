import { IconMinus, IconPlus } from '@tabler/icons-react';
import type { StampDispatch } from '../util/stamps-reducer-types';
import { Button } from '@/components/custom/button';

type Props = {
    dispatch: StampDispatch;
    id: string;
    width?: number;
};

export default function ImageSizeButton({ dispatch, id, width }: Props) {
    const handleImageSizeButtonClick = (operator: string) => {
        dispatch({
            type: 'handleImageSizeButtonClick',
            payload: { id, operator: operator },
        });
    };

    return (
        <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" className="size-9 rounded-r-none" onClick={() => handleImageSizeButtonClick('-')} disabled={(width ?? 0) <= 10} aria-label="Smaller image">
                <IconMinus size={14} />
            </Button>
            <span className="w-10 text-center text-sm tabular-nums" title="Width (pt)">{Math.round(width ?? 0)}</span>
            <Button variant="ghost" size="icon" className="size-9 rounded-l-none" onClick={() => handleImageSizeButtonClick('+')} aria-label="Bigger image">
                <IconPlus size={14} />
            </Button>
        </div>
    );
}
