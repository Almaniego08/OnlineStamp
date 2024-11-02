import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { State } from '../util/stamps-reducer-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OutputButton from './output-button';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const PdfViewer: React.FC<{ pdfFile: any; pdfCurrentPage: any; state: State }> = ({ pdfFile, pdfCurrentPage, state }) => {
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(0);
    const [fontSize, setFontSize] = useState(32);
    const [imageWidth, setImageWidth] = useState(150);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [downloadFileName, setDownloadFileName] = useState<string>('');
    const [renderedComponents, setRenderedComponents] = useState<React.ReactNode[]>([]);

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
            setScaleFactor(newWidth / 610);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [width, height]);

    const onLoadSuccess = async (document: pdfjs.PDFDocumentProxy) => {
        const page = await document.getPage(pdfCurrentPage);
        const viewport = page.getViewport({ scale: 1 });

        setHeight(viewport.height);
        setWidth(viewport.width);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string); // Base64 string
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };

    const renderComponent = async (component: any, offsetX = 0, offsetY = 0) => {
        const { x, y, type, content } = component;
        const scaledX = (x + offsetX) * scaleFactor;
        const scaledY = (y + offsetY - 14) * scaleFactor;
        const compHeight = (component.height || 0) * scaleFactor;
        const compWidth = ((component.width ?? 0) * scaleFactor) || imageWidth;

        if (type === 'image') {
            let imageSrc: string;

            if (content.src instanceof File) {
                imageSrc = await fileToBase64(content.src);
            } else {
                imageSrc = content.src;
            }
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
                        height: compHeight,
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
                        fontSize: component.size ? component.size * scaleFactor : fontSize * scaleFactor,
                        color: component.color
                            ? `rgb(${component.color.red * 255}, ${component.color.green * 255}, ${component.color.blue * 255})`
                            : 'black',
                        margin: 0,
                        padding: 0,
                        zIndex: 2,
                    }}
                >
                    {textContent}
                </p>
            );
        }

        return null;
    };

    useEffect(() => {
        const loadComponents = async () => {
            const components = await Promise.all(state.items.map(async (component) => {
                if (component.isShown) {
                    const mainComponent = await renderComponent(component);

                    if (component.subcomponents) {
                        return (
                            <div key={component.id}>
                                {mainComponent}
                                {await Promise.all(component.subcomponents.map(async (subcomponent) => {
                                    return renderComponent(subcomponent, component.x, component.y - 15);
                                }))}
                            </div>
                        );
                    }

                    return mainComponent;
                }
                return null;
            }));

            setRenderedComponents(components);
        };

        loadComponents();
    }, [state.items]); // Re-run when state.items changes

    return (
        <div className='w-fit flex flex-col gap-[10px] m-auto w-full border rounded-md py-[20px] pb-[70px] p-[20px]'>
            <div className='flex flex-wrap items-end gap-[10px] w-fit m-auto mx-[10px]'>
                <div className='flex-1 flex flex-col gap-[10px] justify-start flex-1'>
                    <Label className='w-fit' htmlFor="time">Text</Label>
                    <Input
                        placeholder='Filename'
                        id="time"
                        type="text"
                        value={downloadFileName}
                        onChange={(e) => setDownloadFileName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className='flex-1'>
                    <OutputButton
                        downloadFileName={downloadFileName}
                        pdfFile={pdfFile} currentPage={pdfCurrentPage} rotation={0}
                        component={state}
                    />
                </div>
            </div>
            <div className="m-auto border-[2px] border-green-500 w-fit flex flex-col items-center relative">
                <Document file={pdfFile} onLoadSuccess={onLoadSuccess}>
                    <Page pageNumber={pdfCurrentPage} height={height} width={width} />
                </Document>

                <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                    {renderedComponents}
                </div>
            </div>
        </div>
    );
};

export default PdfViewer;
