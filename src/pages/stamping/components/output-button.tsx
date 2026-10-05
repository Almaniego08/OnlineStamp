import { useState } from "react";
import { IconDownload, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/custom/button";
import { toast } from "@/components/ui/use-toast";
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
    const [isSaving, setIsSaving] = useState(false);
    const count = component.items.length;

    const handleStamp = async () => {
        setIsSaving(true);
        try {
            await addStamp(pdfFile, currentPage, rotation, component, downloadFileName);
            toast({ title: 'Na-download na', description: `${count} ${count === 1 ? 'item' : 'items'} ang nailagay sa PDF.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Hindi na-download', description: 'May problema sa paggawa ng PDF. Subukan ulit.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Button
            onClick={handleStamp}
            disabled={!pdfFile || isSaving}
            className='w-full gap-2'
            title={count === 0 ? 'Wala pang nakalagay na stamp' : undefined}
        >
            {isSaving ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
            Download stamped PDF
        </Button>
    );
}
