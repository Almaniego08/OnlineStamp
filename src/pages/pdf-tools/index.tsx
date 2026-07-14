import React, { useState } from 'react';
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    splitPdf, 
    mergePdfs, 
    rotatePdfPage, 
    imageToPdf, 
    pdfToImages 
} from './util/pdf-tools';

export default function PdfToolsDashboard() {
    // Component States para sa mga Files at Text fields
    const [singlePdf, setSinglePdf] = useState<File | null>(null);
    const [multiplePdfs, setMultiplePdfs] = useState<File[]>([]);
    const [imagesInput, setImagesInput] = useState<File[]>([]);
    const [splitPages, setSplitPages] = useState<string>('1,2'); // Halimbawa: "1,2" para sa page 1 at 2
    const [extractedImages, setExtractedImages] = useState<string[]>([]);

    // Helper Utility para i-trigger ang download ng Blob sa browser
    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 1. EXECUTE SPLIT
    const handleSplit = async () => {
        if (!singlePdf) return alert('Pumili muna ng PDF file!');
        try {
            // I-convert ang comma-separated string patungong 0-indexed numbers array
            // Halimbawa: "1, 2" -> [0, 1]
            const indices = splitPages.split(',')
                .map(num => parseInt(num.trim(), 10) - 1)
                .filter(num => !isNaN(num));

            const resultBlob = await splitPdf(singlePdf, indices);
            downloadBlob(resultBlob, `SPLIT_${singlePdf.name}`);
        } catch (error) {
            console.error(error);
        }
    };

    // 2. EXECUTE MERGE
    const handleMerge = async () => {
        if (multiplePdfs.length < 2) return alert('Pumili ng dalawa o higit pang PDF files!');
        try {
            const resultBlob = await mergePdfs(multiplePdfs);
            downloadBlob(resultBlob, 'MERGED_DOCUMENTS.pdf');
        } catch (error) {
            console.error(error);
        }
    };

    // 3. EXECUTE ROTATE (90 Degrees Clockwise)
    const handleRotate = async () => {
        if (!singlePdf) return alert('Pumili muna ng PDF file!');
        try {
            // I-rotate ang unang pahina (index 0) ng 90 degrees
            const resultBlob = await rotatePdfPage(singlePdf, 0, 90);
            downloadBlob(resultBlob, `ROTATED_${singlePdf.name}`);
        } catch (error) {
            console.error(error);
        }
    };

    // 4. EXECUTE IMAGE TO PDF
    const handleImageToPdf = async () => {
        if (imagesInput.length === 0) return alert('Mag-upload muna ng mga imahe (PNG/JPG)!');
        try {
            const resultBlob = await imageToPdf(imagesInput);
            downloadBlob(resultBlob, 'IMAGES_CONVERTED.pdf');
        } catch (error) {
            console.error(error);
        }
    };

    // 5. EXECUTE PDF TO IMAGE PREVIEW
    const handlePdfToImage = async () => {
        if (!singlePdf) return alert('Pumili muna ng PDF file!');
        try {
            const imageStrings = await pdfToImages(singlePdf);
            setExtractedImages(imageStrings); // Itatabi sa state para ma-render sa UI gamit ang <img> tag
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8 bg-card rounded-xl border">
            <h2 className="text-2xl font-bold border-b pb-2">Document Management Tools</h2>

            {/* SECTION 1: Single PDF Operations (Split, Rotate, PDF to Image) */}
            <div className="flex flex-col gap-4 border p-4 rounded-lg bg-background">
                <h3 className="font-semibold text-primary">Single PDF Operations</h3>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="single-pdf-input">Pumili ng PDF Dokumento</Label>
                    <Input 
                        id="single-pdf-input" 
                        type="file" 
                        accept="application/pdf" 
                        onChange={(e) => setSinglePdf(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {/* Tool 1: Split Settings */}
                    <div className="flex flex-col gap-2 border p-3 rounded bg-muted/40">
                        <Label className="text-xs">Mga Pahina na Hihiwalayin (e.g., 1,2)</Label>
                        <Input value={splitPages} onChange={(e) => setSplitPages(e.target.value)} className="h-8 text-xs" />
                        <Button onClick={handleSplit} className="w-full text-xs" size="sm">1. Split Document</Button>
                    </div>

                    {/* Tool 2: Rotate Trigger */}
                    <div className="flex flex-col justify-end border p-3 rounded bg-muted/40">
                        <Button onClick={handleRotate} className="w-full text-xs" size="sm" variant="outline">2. Rotate Page 1 (90°)</Button>
                    </div>

                    {/* Tool 3: PDF to Image Converter */}
                    <div className="flex flex-col justify-end border p-3 rounded bg-muted/40">
                        <Button onClick={handlePdfToImage} className="w-full text-xs" size="sm" variant="secondary">3. Extract to Images</Button>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Document Merge */}
            <div className="flex flex-col gap-4 border p-4 rounded-lg bg-background">
                <h3 className="font-semibold text-primary">Document Merge (Pagsamahin)</h3>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="merge-input">Pumili ng Maraming PDF Files</Label>
                    <Input 
                        id="merge-input" 
                        type="file" 
                        multiple 
                        accept="application/pdf" 
                        onChange={(e) => setMultiplePdfs(e.target.files ? Array.from(e.target.files) : [])} 
                    />
                </div>
                <Button onClick={handleMerge} className="w-fit" variant="default">Execute Merge ({multiplePdfs.length} files)</Button>
            </div>

            {/* SECTION 3: Image to PDF */}
            <div className="flex flex-col gap-4 border p-4 rounded-lg bg-background">
                <h3 className="font-semibold text-primary">Convert Images to PDF</h3>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="image-pdf-input">Mag-upload ng mga Larawan (PNG/JPG)</Label>
                    <Input 
                        id="image-pdf-input" 
                        type="file" 
                        multiple 
                        accept="image/png, image/jpeg" 
                        onChange={(e) => setImagesInput(e.target.files ? Array.from(e.target.files) : [])} 
                    />
                </div>
                <Button onClick={handleImageToPdf} className="w-fit" variant="default">Generate PDF from Images</Button>
            </div>

            {/* PREVIEW CONTAINER: Dito lalabas ang mga extracted image strips mula sa PDF-to-Image tool */}
            {extractedImages.length > 0 && (
                <div className="border p-4 rounded-lg bg-background flex flex-col gap-3">
                    <h3 className="font-semibold text-primary">Extracted Page Previews</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {extractedImages.map((src, index) => (
                            <div key={index} className="border p-1 rounded bg-muted flex flex-col gap-1 items-center">
                                <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto object-contain max-h-40" />
                                <span className="text-[10px] font-medium text-muted-foreground">Page {index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}