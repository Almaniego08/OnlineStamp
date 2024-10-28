
import { IconCalendarMonth } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
export interface IAppProps {

}

export function Date({ }: IAppProps) {
    return (
        <Button variant='ghost' className='flex gap-[10px] border px-4 py-4 w-full'>
            <IconCalendarMonth />
            <p>ADD DATE</p>
        </Button>
    );
}