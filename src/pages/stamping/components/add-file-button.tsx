import { IconFileUpload } from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';

export function AddFileButton() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPdfFile(event.target.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const component = (
        <div className='border-gray-200 border-[1px] rounded-md'>
            <Button variant='link' onClick={handleClick} className="flex flex-row gap-[10px] w-full py-[15px] md:py-[20px] lg:py-[30px] cursor-pointer ">
                <IconFileUpload />
                <p>{pdfFile ? pdfFile?.name : 'Add File'}</p>
                <Input
                    ref={fileInputRef}
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                />
            </Button>
        </div>
    );

    return { component, pdfFile, setPdfFile };
}
