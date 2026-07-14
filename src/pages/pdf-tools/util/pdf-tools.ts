import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// I-set up ang static cloud worker repository para sa PDF-to-Image conversion mapping
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * 1. DOCUMENT SPLIT
 * Hinihiwalay ang tinukoy na mga pahina (0-indexed) upang maging isang bagong PDF File object.
 */
export const splitPdf = async (pdfFile: File, pageIndices: number[]): Promise<Blob> => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const sourceDoc = await PDFDocument.load(pdfBytes);
    const newDoc = await PDFDocument.create();

    // Kopyahin ang piling page layout segments patungo sa bagong blank bundle canvas
    const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));

    const modifiedBytes = await newDoc.save();
    return new Blob([modifiedBytes], { type: 'application/pdf' });
};

/**
 * 2. DOCUMENT MERGE
 * Pagsasamahin ang isang array ng mga PDF files sa iisang mahabang dokumento.
 */
export const mergePdfs = async (pdfFiles: File[]): Promise<Blob> => {
    const mergedDoc = await PDFDocument.create();

    for (const file of pdfFiles) {
        const pdfBytes = await file.arrayBuffer();
        const currentDoc = await PDFDocument.load(pdfBytes);
        const pageIndices = currentDoc.getPageIndices();
        const copiedPages = await mergedDoc.copyPages(currentDoc, pageIndices);
        copiedPages.forEach((page) => mergedDoc.addPage(page));
    }

    const modifiedBytes = await mergedDoc.save();
    return new Blob([modifiedBytes], { type: 'application/pdf' });
};

/**
 * 3. DOCUMENT ROTATE
 * Ipipihit ang partikular na pahina ng PDF sa tamang anggulo (halimbawa: 90, 180, 270 degrees).
 */
export const rotatePdfPage = async (pdfFile: File, pageIndex: number, currentRotation: number): Promise<Blob> => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[pageIndex];

    // Idagdag ang bagong anggulo sa kasalukuyang rotation offset ng target sheet
    const existingRotation = page.getRotation().angle;
    page.setRotation(degrees((existingRotation + currentRotation) % 360));

    const modifiedBytes = await pdfDoc.save();
    return new Blob([modifiedBytes], { type: 'application/pdf' });
};

/**
 * 4. DOCUMENT IMAGE TO PDF
 * Kinukuha ang uploaded PNG/JPEG array assets at ginagawang malinis na PDF file canvas grids.
 */
export const imageToPdf = async (imageFiles: File[]): Promise<Blob> => {
    const pdfDoc = await PDFDocument.create();

    for (const file of imageFiles) {
        const imageBytes = await file.arrayBuffer();
        let embeddedImage;

        if (file.type === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        // I-scale ang base canvas paper layer base sa natural dimensions ng file image
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: embeddedImage.width,
            height: embeddedImage.height,
        });
    }

    const modifiedBytes = await pdfDoc.save();
    return new Blob([modifiedBytes], { type: 'application/pdf' });
};

/**
 * 5. DOCUMENT PDF TO IMAGE
 * Binabasa ang bawat pahina ng PDF at ini-extract ito para maging downloadable raw PNG data string array.
 */
export const pdfToImages = async (pdfFile: File): Promise<string[]> => {
    const fileURL = URL.createObjectURL(pdfFile);
    const loadingTask = pdfjsLib.getDocument(fileURL);
    const pdf = await loadingTask.promise;
    const imageUrls: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Scale factor 2.0 para sa high resolution screen capture

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
            
            // I-convert ang raw canvas bits patungong standard web image resource path link
            imageUrls.push(canvas.toDataURL('image/png'));
        }
    }

    URL.revokeObjectURL(fileURL);
    return imageUrls;
};