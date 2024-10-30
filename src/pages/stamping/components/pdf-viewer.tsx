import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { State } from '../util/stamps-reducer-types';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const PdfViewer: React.FC<{ pdfFile: any; pdfCurrentPage: any; state: State }> = ({ pdfFile, pdfCurrentPage, state }) => {
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(0);
    const [fontSize, setFontSize] = useState(32);
    const [imageWidth, setImageWidth] = useState(150);
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        const updateDimensions = () => {
            let newWidth = 500;

            if (window.innerWidth <= 350) {
                newWidth = window.innerWidth * 0.9;
            } else if (window.innerWidth <= 650) {
                newWidth = window.innerWidth * 0.75;
            }

            setWidth(newWidth);
            setImageWidth(newWidth * 0.25);
            setFontSize(newWidth * 0.05);
            setScaleFactor(newWidth / 600);
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

    const renderComponent = (component: any, offsetX = 0, offsetY = 0) => {
        const { x, y, type, content } = component;
        const scaledX = (x + offsetX) * scaleFactor;
        const scaledY = (y + offsetY) * scaleFactor;
        const compHeight = (component.height || 0) * scaleFactor; // Scale height
        const compWidth = ((component.width ?? 0) * scaleFactor) || imageWidth;

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
                        minWidth: compWidth,
                        height: compHeight, // Use scaled height
                        zIndex: 2,
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
                        zIndex: 2,
                    }}
                >
                    {textContent}
                </p>
            );
        }

        return null;
    };

    return (
        <div className="m-auto border-[2px] border-green-500 w-fit flex flex-col items-center relative">
            <Document file={pdfFile} onLoadSuccess={onLoadSuccess}>
                <Page pageNumber={pdfCurrentPage} width={width} rotate={0} />
            </Document>

            <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                {state.items.map((component) => {
                    if (component.isShown) {
                        const mainComponent = renderComponent(component);

                        if (component.subcomponents) {
                            return (
                                <div key={component.id}>
                                    {mainComponent}
                                    {component.subcomponents.map((subcomponent) => {
                                        return renderComponent(subcomponent, component.x, component.y);
                                    })}
                                </div>
                            );
                        }

                        return mainComponent;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default PdfViewer;
