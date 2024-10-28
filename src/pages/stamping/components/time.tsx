
import { IconClockHour1  } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
export interface IAppProps {

}

export function Time({ }: IAppProps) {
    return (
        <Button variant='ghost' className='flex gap-[10px] border px-4 py-4 w-full'>
            <IconClockHour1 />
            <p>ADD TIME</p>
        </Button>
    );
}