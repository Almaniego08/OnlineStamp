import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { State } from '../util/stamps-reducer-types';
import { receivedImg } from '../data/images';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const PdfViewer: React.FC<{ pdfFile: any; pdfCurrentPage: any; state: State }> = ({ pdfFile, pdfCurrentPage, state }) => {
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(0); // State for height
    const [fontSize, setFontSize] = useState(32);
    const [imageWidth, setImageWidth] = useState(150);
    const [scaleFactor, setScaleFactor] = useState(1); // State for scaling

    useEffect(() => {
        const updateDimensions = () => {
            let newWidth = 500;

            if (window.innerWidth <= 350) {
                newWidth = window.innerWidth * 0.9;
            } else if (window.innerWidth <= 650) {
                newWidth = window.innerWidth * 0.75;
            }

            setWidth(newWidth);
            setImageWidth(newWidth * 0.25); // 25% of the PDF width
            setFontSize(newWidth * 0.05); // 5% of the PDF width
            setScaleFactor(newWidth / 500); // Set scale factor based on original width (500)
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const onLoadSuccess = async (document: pdfjs.PDFDocumentProxy) => {
        const page = await document.getPage(pdfCurrentPage);
        const viewport = page.getViewport({ scale: 1 });

        setHeight(viewport.height);
        setWidth(viewport.width);
    };

    return (
        <div className="m-auto border-[2px] border-green-500 w-fit flex flex-col items-center relative">
            {/* PDF Document */}
            <Document file={pdfFile} onLoadSuccess={onLoadSuccess}>
                <Page pageNumber={pdfCurrentPage} width={width} />
            </Document>

            {/* Overlay for all components */}
            <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                {state.items.map((component) => {
                    if (component.isShown) {
                        const { x, y, type, content } = component;
                        // Scale the positions based on the scale factor
                        const scaledX = x * scaleFactor;
                        const scaledY = y * scaleFactor;

                        // Calculate compWidth as a percentage of the current width
                        const compWidth = ((component.width ?? 0) * scaleFactor) || imageWidth; // Use fallback for width

                        if (type === 'image') {
                            const imageSrc = typeof content === 'string' ? content : content.src;
                            const imageTitle = typeof content === 'string' ? '' : content.title;

                            return (
                                <img
                                    key={component.id}
                                    src={imageSrc}
                                    alt={imageTitle}
                                    style={{
                                        position: 'absolute',
                                        left: `${scaledX}px`,
                                        top: `${scaledY}px`,
                                        minWidth: compWidth, // Use the calculated compWidth
                                        height: 'auto',
                                        zIndex: 2, // Ensure images are above the PDF
                                    }}
                                />
                            );
                        } else if (type === 'text') {
                            const textContent = typeof content === 'string' ? content : String(content);

                            return (
                                <p
                                    className='text-nowrap'
                                    key={component.id}
                                    style={{
                                        position: 'absolute',
                                        left: `${scaledX}px`,
                                        top: `${scaledY}px`,
                                        fontSize: component.size || fontSize,
                                        color: component.color
                                            ? `rgb(${component.color.red * 255}, ${component.color.green * 255}, ${component.color.blue * 255})`
                                            : 'black',
                                        margin: 0,
                                        zIndex: 2, // Ensure text is above the PDF
                                    }}
                                >
                                    {textContent}
                                </p>
                            );
                        }
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default PdfViewer;
