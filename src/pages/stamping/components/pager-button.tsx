import {
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react';
import { Button } from '@/components/custom/button';

type Props = {
    setPage: any;
    pdfPages: any;
    pdfCurrentPage: any;

}

export default function PagerButton({ setPage, pdfPages, pdfCurrentPage }: Props) {

    return (
        <div className='flex flex-row w-full justify-between md:max-w-[350px] m-auto items-center justify-center'>
            <Button onClick={() => pdfCurrentPage > 1 ? setPage(pdfCurrentPage - 1) : null} className='' variant='ghost'>
                <IconChevronLeft />
            </Button>
            <div className='flex flex-row gap-[5px]'>
                <p className='font-bold '>Page: <span className='text-destructive'>{pdfCurrentPage}</span></p>

            </div>
            <Button onClick={() => pdfCurrentPage < pdfPages ? setPage(pdfCurrentPage + 1) : null} className='' variant='ghost'>
                <IconChevronRight />
            </Button>
        </div>
    )
}