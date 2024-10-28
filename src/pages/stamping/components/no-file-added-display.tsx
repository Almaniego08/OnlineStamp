import fileTypePdfImage from '../assets/images/file-type-pdf.png';
import { IconFileTypePdf } from '@tabler/icons-react';
export interface IAppProps {
}

export function NoFileAddedDisplay({ }: IAppProps) {
    return (
        <div className='flex flex-col gap-[10px] justify-center items-center '>
            <IconFileTypePdf size={68} />
            <p>Add PDF to Preview</p>
        </div>
    );
}
