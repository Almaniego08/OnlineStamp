import { Button } from '@/components/custom/button';
import {
    IconChevronUp,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconLayoutAlignTop,
    IconLayoutAlignBottom,
    IconLayoutAlignRight,
    IconLayoutAlignLeft
} from '@tabler/icons-react';



type Props = {
    dispatch: (action: any) => void;
    id: string;
    pdfHeight: number;
    pdfWidth: number;
}



export function PositioningButton({ dispatch, id, pdfHeight, pdfWidth }: Props) {


    const updatePositionY = (operator: string, value: number) =>
        dispatch({
            type: 'updatePositionY',
            payload: { id, operator, value },
        });

    const updatePositionX = (operator: string, value: number) =>
        dispatch({
            type: 'updatePositionX',
            payload: { id, operator, value },
        });

    const updatePositionTopBottomLeftRight = (position: string,) => {
        const x = 0;
        const y = 0;
        let value = 0;
        if (position === 'top') {
            value = y
        } else if (position === 'bottom') {
            value = pdfHeight + y
        } else if (position === 'left') {
            value = x;
        } else if (position === 'right') {
            value = pdfWidth - x;
        }
        dispatch({
            type: 'updatePositionTopBottomLeftRight',
            payload: { id, position, value },
        });
    }

    return (
        <div className='flex flex-wrap gap-2 w-full'>
            <div className='flex-1 flex flex-nowrap gap-2'>
                <Button onClick={() => updatePositionY('-', 5)} className='flex-1' variant='ghost'>
                    <IconChevronUp />
                </Button>
                <Button onClick={() => updatePositionY('+', 5)} className='flex-1' variant='ghost'>
                    <IconChevronDown />
                </Button>
                <Button onClick={() => updatePositionX('-', 5)} className='flex-1' variant='ghost'>
                    <IconChevronLeft />
                </Button>
                <Button onClick={() => updatePositionX('+', 5)} className='flex-1' variant='ghost'>
                    <IconChevronRight />
                </Button>
            </div>
            <div className='flex-1 flex flex-nowrap gap-2'>
                <Button onClick={() => updatePositionTopBottomLeftRight('top')} className='flex-1' variant='ghost'>
                    <IconLayoutAlignTop />
                </Button>
                <Button onClick={() => updatePositionTopBottomLeftRight('bottom')} className='flex-1' variant='ghost'>
                    <IconLayoutAlignBottom />
                </Button>
                <Button onClick={() => updatePositionTopBottomLeftRight('left')} className='flex-1' variant='ghost'>
                    <IconLayoutAlignLeft />
                </Button>
                <Button onClick={() => updatePositionTopBottomLeftRight('right')} className='flex-1' variant='ghost'>
                    <IconLayoutAlignRight />
                </Button>
            </div>

        </div>
    )
}