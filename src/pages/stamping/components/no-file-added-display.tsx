import { IconFileTypePdf } from '@tabler/icons-react';
export interface IAppProps {
}

export function NoFileAddedDisplay({ }: IAppProps) {
    return (
        <div className='flex flex-col gap-[10px] justify-center items-center w-full lg:w-1/2 py-[30px]'>
            <IconFileTypePdf size={68} />
            <p>Add PDF to Preview</p>
        </div>
    );
}
