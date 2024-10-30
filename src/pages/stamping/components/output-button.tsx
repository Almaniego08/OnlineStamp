import { Button } from "@/components/custom/button";
import { State } from '../util/stamps-reducer-types';
import { addStamp } from "../util/stamp-output";

type Props = {
    pdfFile: File | null;
    currentPage: number;
    rotation: number;
    component: State;
}

export default function OutputButton({ pdfFile, currentPage, rotation, component }: Props) {

    const handleStamp = async () => {
        await addStamp(pdfFile, currentPage, rotation, component);
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <Button onClick={handleStamp} className='' variant='destructive'>Download Output</Button>
        </div>
    );
}
