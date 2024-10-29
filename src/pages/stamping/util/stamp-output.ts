import { PDFDocument, rgb, degrees } from 'pdf-lib';


export const addStamp = async ({ pdfFile, page, rotation, component }: any) => {
    if (!pdfFile) {
        return;
    }
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    if (component.type === 'image') {
        const image = component.content.src;
        const imageBytes = await image.arrayBuffer();
        const img = image.type === 'image/png'
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        page.drawImage(img, {
            x: component.x,
            y: component.y,
            width: component.width,
            height: component.width,
            rotate: degrees(rotation * -1),
        });
    } else if (component.type === 'text') {
        const text = component.content;
        page.drawText(text, {
            x: component.x,
            y: component.y,
            size: component.size,
            color: component.color,
            rotate: degrees(rotation * -1),
        });
    }

}
