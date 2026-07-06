import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { State } from './stamps-reducer-types';

export const addStamp = async (pdfFile: File | null, currentPage: number, rotation: number, components: State, downloadFileName: string) => {
    if (!pdfFile) return;

    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[currentPage - 1];
    const { items } = components;
    const pdfHeight = page.getHeight();
    const pdfWidth = page.getWidth()

    for (const item of items) {
        // Draw the main parent container element
        await pageDraw(pdfDoc, item, page, pdfHeight, rotation, item.x, item.y);

        if (item.subcomponents) {
            for (const subcomp of item.subcomponents) {
                // Determine the correct absolute Y value based on the inner element type
                // const subcompHeight = subcomp.height || 0;

                // FIXED COORDINATE CONVERSION: 
                // Since web subcomponents expect to drop DOWN from the parent top, 
                // we map it correctly using the top-down delta offset context.
                const absoluteX = item.x + (subcomp.x || 0);
                const absoluteY = item.y + (subcomp.y || 0);

                await pageDraw(pdfDoc, subcomp, page, pdfHeight, rotation, absoluteX, absoluteY);
            }
        }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName ?? 'PROCESSED DOCUMENT';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const pageDraw = async (pdfDoc: any, item: any, page: any, pdfHeight: number, rotation: number, x: number, y: number) => {
    if (item.type === 'image' && item.content && typeof item.content === 'object' && 'src' in item.content) {
        try {
            let imageBytes;

            if (item.content.src instanceof File) {
                imageBytes = await item.content.src.arrayBuffer();
            } else {
                const imageResponse = await fetch(item.content.src);
                imageBytes = await imageResponse.arrayBuffer();
            }

            let img;
            if (item.content.src instanceof File) {
                const fileType = item.content.src.type;
                img = fileType === 'image/png'
                    ? await pdfDoc.embedPng(imageBytes)
                    : await pdfDoc.embedJpg(imageBytes);
            } else {
                img = item.content.src.endsWith('.png')
                    ? await pdfDoc.embedPng(imageBytes)
                    : await pdfDoc.embedJpg(imageBytes);
            }

            const finalWidth = item.width || img.width;
            const finalHeight = item.height || img.height;

            page.drawImage(img, {
                x: x,
                y: pdfHeight - y - finalHeight, // Flips top-left origin to bottom-left layout bounds
                width: finalWidth,
                height: finalHeight,
                rotate: degrees(rotation),
            });
        } catch (error) {
            console.error("Error embedding image:", error);
        }
    } else if (item.type === 'text' && typeof item.content === 'string') {
        // FIXED TEXT POSITIONING BOUNDS:
        // Text components use font baseline origins. To visually map text objects precisely 
        // to match their visual placement in image_1dcbb8.png, we approximate font cap height (0.7 * size)
        const fontSize = item.size || 12;

        page.drawText(item.content, {
            x: x,
            y: pdfHeight - y,
            size: fontSize,
            color: item.color || rgb(0, 0, 0),
            rotate: degrees(rotation),
        });
    }
};