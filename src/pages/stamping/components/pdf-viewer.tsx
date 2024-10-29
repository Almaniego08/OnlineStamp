import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { receivedImg } from '../data/images';
import { State } from '../util/stamps-reducer-types';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const PdfViewer: React.FC<{ pdfFile: any; pdfCurrentPage: any; state: State }> = ({ pdfFile, pdfCurrentPage, state }) => {
    const [width, setWidth] = useState(500);
    const [imageWidth, setImageWidth] = useState(120);
    const [fontSize, setFontSize] = useState(32);
    console.log('pdfpreview', state)
    useEffect(() => {
        const updateDimensions = () => {
            let newWidth = 500;
            let newFontSize = 16;
            let newImageWidth = 120;

            if (window.innerWidth <= 350) {
                newWidth = window.innerWidth * 0.9;
            } else if (window.innerWidth <= 650) {
                newWidth = window.innerWidth * 0.75;
            }

            newFontSize = newWidth * 0.05; // 5% of the PDF width
            newImageWidth = newWidth * 0.25; // 25% of the PDF width

            setWidth(newWidth);
            setFontSize(newFontSize);
            setImageWidth(newImageWidth);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div className="m-auto border-[2px] border-green-500 w-fit flex flex-col items-center relative">
            {/* Absolute image and text overlay */}
            <div
                className="absolute top-0 left-0 right-0 flex flex-col items-center"
                style={{
                    width,
                    zIndex: 1,
                }}
            >
                <img
                    src={receivedImg.src}
                    alt="Preview"
                    style={{
                        width: imageWidth,
                        height: 'auto',
                        marginBottom: '0.5rem',
                    }}
                />
                <p
                    className='font-bold text-gray-500'
                    style={{
                        fontSize, // Responsive font size
                        marginBottom: '1rem',
                    }}
                >
                    Text sampleSf sgdadgdggddddsfffffffffffffffffffgdgsfgfg
                </p>
            </div>

            {/* PDF Document */}
            <Document file={pdfFile}>
                <Page pageNumber={pdfCurrentPage} width={width} />
            </Document>
        </div>
    );
};

export default PdfViewer;
