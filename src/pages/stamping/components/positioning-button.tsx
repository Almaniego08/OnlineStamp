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
type Props = {}

export function PositioningButton({ }: Props) {
    return (
        <div className='flex flex-wrap gap-2'>
            <div className='flex-1 flex flex-nowrap gap-2'>
                <Button className='flex-1' variant='ghost'>
                    <IconChevronUp />
                </Button>
                <Button className='flex-1' variant='ghost'>
                    <IconChevronDown />
                </Button>
                <Button className='flex-1' variant='ghost'>
                    <IconChevronLeft />
                </Button>
                <Button className='flex-1' variant='ghost'>
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