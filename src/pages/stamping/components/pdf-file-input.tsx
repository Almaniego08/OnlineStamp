import { useRef, useState } from 'react';
import { IconFileTypePdf, IconFileUpload, IconReplace } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const isPdf = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

const usePdfPicker = (onFile: (file: File) => void) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const accept = (file?: File | null) => {
        if (!file) return;
        if (!isPdf(file)) {
            toast({ variant: 'destructive', title: 'PDF lang ang puwede', description: `"${file.name}" ay hindi PDF.` });
            return;
        }
        onFile(file);
    };

    const input = (
        <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
                accept(e.target.files?.[0]);
                e.target.value = ''; // para ma-pili ulit ang parehong file
            }}
        />
    );

    return { open: () => inputRef.current?.click(), accept, input };
};

/*
 * Card sa left panel: pangalan ng PDF + pages, at button para pumili / magpalit.
 */
export function PdfFileCard({ file, pages, onFile }: { file: File | null; pages: number; onFile: (file: File) => void }) {
    const { open, input } = usePdfPicker(onFile);

    return (
        <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <IconFileTypePdf size={18} /> PDF
            </h2>
            {file ? (
                <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {pages ? `${pages} ${pages === 1 ? 'page' : 'pages'}` : 'Loading…'}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={open} className="shrink-0 gap-1">
                        <IconReplace size={14} /> Change
                    </Button>
                </div>
            ) : (
                <Button variant="outline" onClick={open} className="w-full gap-2">
                    <IconFileUpload size={16} /> Choose a PDF
                </Button>
            )}
            {input}
        </section>
    );
}

/*
 * Malaking drop area sa kanan kapag wala pang PDF.
 */
export function PdfDropzone({ onFile }: { onFile: (file: File) => void }) {
    const { open, accept, input } = usePdfPicker(onFile);
    const [isOver, setIsOver] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={open}
            onDragOver={(e) => {
                e.preventDefault();
                setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                accept(e.dataTransfer.files?.[0]);
            }}
            className={cn(
                'flex h-[60vh] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed text-center transition-colors lg:h-full',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/30',
            )}
        >
            <IconFileUpload size={44} className={cn('transition-colors', isOver ? 'text-primary' : 'text-muted-foreground')} />
            <div>
                <p className="font-medium">{isOver ? 'Bitawan para buksan' : 'Choose or drop a PDF here'}</p>
                <p className="mt-1 text-sm text-muted-foreground">Sa device mo lang ito ginagawa; walang ina-upload.</p>
            </div>
        </button>
        {input}
        </>
    );
}
