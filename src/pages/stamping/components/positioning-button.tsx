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
import { dispatchPosition } from '../util/stamps-reducer-dispatch'



type Props = {
    dispatch: (action: any) => void;
    id: string;
}



export function PositioningButton({ dispatch, id }: Props) {

    const updateReceiveStampDetails = (
        id: string,
        operator: string, // This is the id of the subcomponent being updated
        value: number,
    ) => ({
        type: 'updatePositionY',
        payload: { id, operator, value },
    });

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

    return (
        <div className='flex flex-wrap gap-2'>
            <div className='flex-1 flex flex-nowrap gap-2'>
                <Button onClick={() => updatePositionY('+', 10)} className='flex-1' variant='ghost'>
                    <IconChevronDown />
                </Button>
                <Button onClick={() => updatePositionY('-', 10)} className='flex-1' variant='ghost'>
                    <IconChevronUp />
                </Button>
                <Button onClick={() => updatePositionX('-', 10)} className='flex-1' variant='ghost'>
                    <IconChevronLeft />
                </Button>
                <Button onClick={() => updatePositionX('+', 10)} className='flex-1' variant='ghost'>
                    <IconChevronRight />
                </Button>
            </div>
            <div className='flex-1 flex flex-nowrap gap-2'>
                <Button className='flex-1' variant='ghost'>
                    <IconLayoutAlignTop />
                </Button>
                <Button className='flex-1' variant='ghost'>
                    <IconLayoutAlignBottom />
                </Button>
                <Button className='flex-1' variant='ghost'>
                    <IconLayoutAlignRight />
                </Button>
                <Button className='flex-1' variant='ghost'>
                    <IconLayoutAlignLeft />
                </Button>
            </div>

        </div>
    )
}