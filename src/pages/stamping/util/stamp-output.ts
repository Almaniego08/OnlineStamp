import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { State } from './stamps-reducer-types';

export const addStamp = async (pdfFile: File | null, currentPage: number, rotation: number, components: State) => {
    if (!pdfFile) return;

    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[currentPage - 1];
    const { items } = components;
    const pdfHeight = page.getHeight();

    for (const item of items) {
        await pageDraw(pdfDoc, item, page, pdfHeight, rotation, item.x, item.y);

        if (item.subcomponents) {
            for (const subcomp of item.subcomponents) {
                await pageDraw(pdfDoc, subcomp, page, pdfHeight, rotation, item.x + (subcomp.x || 0), item.y + (subcomp.y || 0));
            }
        }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'stamped_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const pageDraw = async (pdfDoc: any, item: any, page: any, pdfHeight: number, rotation: number, x: number, y: number) => {
    if (item.type === 'image' && item.content && typeof item.content === 'object' && 'src' in item.content) {
        try {
            const imageResponse = await fetch(item.content.src);
            const imageBytes = await imageResponse.arrayBuffer();
            const img = item.content.src.endsWith('.png')
                ? await pdfDoc.embedPng(imageBytes)
                : await pdfDoc.embedJpg(imageBytes);

            // Use scaled height for positioning
            page.drawImage(img, {
                x: x,
                y: pdfHeight - y - (item.height || 0), // Adjust Y based on height
                width: item.width || img.width,
                height: item.height || img.height,
                rotate: degrees(rotation),
            });
        } catch (error) {
            console.error("Error embedding image:", error);
        }
    } else if (item.type === 'text' && typeof item.content === 'string') {
        page.drawText(item.content, {
            x: x,
            y: pdfHeight - y,
            size: item.size || 12,
            color: item.color || rgb(0, 0, 0),
            rotate: degrees(rotation),
        });
    }
};
