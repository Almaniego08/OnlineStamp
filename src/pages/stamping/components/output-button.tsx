import { Button } from "@/components/custom/button";
import { State } from '../util/stamps-reducer-types';
import { addStamp } from "../util/stamp-output";

type Props = {
    pdfFile: File | null;
    currentPage: number;
    rotation: number;
    component: State;
    downloadFileName: string;
}

export default function OutputButton({ pdfFile, currentPage, rotation, component, downloadFileName }: Props) {

    const handleStamp = async () => {
        await addStamp(pdfFile, currentPage, rotation, component, downloadFileName, );
    };

    return (
        <div className='w-full flex items-center justify-center w-full'>
            <Button onClick={handleStamp} className='w-full border' variant='ghost'>Download Output</Button>
        </div>
    );
}
