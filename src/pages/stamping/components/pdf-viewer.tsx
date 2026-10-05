import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { RGB } from 'pdf-lib';
import {
    IconChevronLeft,
    IconChevronRight,
    IconZoomIn,
    IconZoomOut,
    IconArrowsHorizontal,
} from '@tabler/icons-react';
import { State, Item, Subcomponent, Action } from '../util/stamps-reducer-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { cn } from '@/lib/utils';
import OutputButton from './output-button';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

type Props = {
    pdfFile: File;
    pdfCurrentPage: number;
    pdfPages: number;
    setPage: (page: number) => void;
    state: State;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    dispatch: React.Dispatch<Action>;
};

/*
 * Ang overlay ay SVG na naka-viewBox sa laki ng PDF page (PDF units, top-left origin),
 * kaya pareho ang coordinates ng preview at ng stamp-output.ts kahit anong zoom:
 *   image -> top-left sa (x, y), sukat width x height
 *   text  -> baseline sa y (katulad ng page.drawText sa pdfHeight - y)
 *
 * Zoom = pixels bawat PDF unit (1 = 100% / actual size).
 */

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
const PAGE_PADDING = 16;

type DragInfo = {
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    scale: number;
    minDx: number;
    maxDx: number;
    minDy: number;
    maxDy: number;
};

type PanInfo = {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    scrollLeft: number;
    scrollTop: number;
    moved: boolean;
};

// Point sa content na dapat manatili sa ilalim ng cursor pagkatapos mag-zoom
type ZoomAnchor = {
    contentX: number;
    contentY: number;
    offsetX: number;
    offsetY: number;
    ratio: number;
};

const toCssColor = (color?: RGB) =>
    color && 'red' in color
        ? `rgb(${color.red * 255}, ${color.green * 255}, ${color.blue * 255})`
        : 'black';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// File (galing sa SelectImageForm) -> object URL; string (static stamp images) -> as is
function OverlayImage({ src, ...rest }: { src: string | File } & React.SVGProps<SVGImageElement>) {
    const [url, setUrl] = useState<string>(typeof src === 'string' ? src : '');

    useEffect(() => {
        if (typeof src === 'string') {
            setUrl(src);
            return;
        }
        const objectUrl = URL.createObjectURL(src);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [src]);

    return url ? <image href={url} preserveAspectRatio="none" {...rest} /> : null;
}

function OverlayElement({ el, x, y, placeholder }: { el: Item | Subcomponent; x: number; y: number; placeholder?: string }) {
    const { type, content } = el;

    if (type === 'image') {
        if (!content || typeof content !== 'object' || !('src' in content) || !content.src) {
            if (!placeholder) return null;
            const w = el.width || 100;
            const h = el.height || 100;
            return (
                <g>
                    <rect x={x} y={y} width={w} height={h} fill="rgba(59,130,246,0.06)" stroke="rgb(59,130,246)" strokeWidth={1} strokeDasharray="4 3" />
                    <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontFamily="Helvetica, Arial, sans-serif" fill="rgb(59,130,246)">
                        Choose image
                    </text>
                </g>
            );
        }
        return (
            <OverlayImage
                src={content.src as string | File}
                x={x}
                y={y}
                width={el.width || 0}
                height={el.height || 0}
            />
        );
    }

    if (type === 'text') {
        const text = typeof content === 'string' ? content : '';
        if (!text && !placeholder) return null;
        return (
            <text
                x={x}
                y={y}
                fontSize={el.size || 12}
                fontFamily="Helvetica, Arial, sans-serif"
                fill={toCssColor(el.color)}
                opacity={text ? 1 : 0.4}
                style={{ whiteSpace: 'pre' }}
            >
                {text || placeholder}
            </text>
        );
    }

    return null;
}

const PdfViewer: React.FC<Props> = ({ pdfFile, pdfCurrentPage, pdfPages, setPage, state, dispatch, selectedId, onSelect }) => {
    const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [zoom, setZoom] = useState<number | 'fit'>('fit');
    const [downloadFileName, setDownloadFileName] = useState<string>('');
    const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);
    const [isPanning, setIsPanning] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const dragInfo = useRef<DragInfo | null>(null);
    const panInfo = useRef<PanInfo | null>(null);
    const zoomAnchor = useRef<ZoomAnchor | null>(null);

    const fitScale = pageSize && viewportWidth
        ? Math.max(MIN_ZOOM, (viewportWidth - PAGE_PADDING * 2) / pageSize.width)
        : 1;
    const scale = zoom === 'fit' ? fitScale : zoom;
    const scaleRef = useRef(scale);
    scaleRef.current = scale;

    // Lapad ng viewer para sa "Fit width"
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => setViewportWidth(el.clientWidth));
        observer.observe(el);
        setViewportWidth(el.clientWidth);
        return () => observer.disconnect();
    }, []);

    const zoomTo = (next: number, clientX?: number, clientY?: number) => {
        const el = scrollRef.current;
        const current = scaleRef.current;
        next = clamp(next, MIN_ZOOM, MAX_ZOOM);
        if (!el || next === current) return;

        // Default anchor: gitna ng viewer
        const rect = el.getBoundingClientRect();
        const offsetX = (clientX ?? rect.left + rect.width / 2) - rect.left;
        const offsetY = (clientY ?? rect.top + rect.height / 2) - rect.top;
        zoomAnchor.current = {
            contentX: el.scrollLeft + offsetX - PAGE_PADDING,
            contentY: el.scrollTop + offsetY - PAGE_PADDING,
            offsetX,
            offsetY,
            ratio: next / current,
        };
        setZoom(next);
    };

    const zoomStep = (direction: 1 | -1) => {
        const current = scaleRef.current;
        const next = direction > 0
            ? ZOOM_STEPS.find((step) => step > current + 0.001) ?? MAX_ZOOM
            : [...ZOOM_STEPS].reverse().find((step) => step < current - 0.001) ?? MIN_ZOOM;
        zoomTo(next);
    };

    // Ibalik ang scroll para manatili ang anchor point pagkatapos mag-zoom
    useLayoutEffect(() => {
        const el = scrollRef.current;
        const anchor = zoomAnchor.current;
        if (!el || !anchor) return;
        zoomAnchor.current = null;
        el.scrollLeft = anchor.contentX * anchor.ratio + PAGE_PADDING - anchor.offsetX;
        el.scrollTop = anchor.contentY * anchor.ratio + PAGE_PADDING - anchor.offsetY;
    }, [scale]);

    // Ctrl + scroll wheel (o pinch sa trackpad) = zoom. Native listener para gumana ang preventDefault.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            zoomTo(scaleRef.current * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY);
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    // Sukat ng naka-select na item para sa dashed outline (wala sa loob ng group para hindi lumaki ang bbox)
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    // Walang deps sinasadya: nagbabago ang bbox kahit hindi nagbago ang state (hal. nag-load ang image);
    // ligtas dahil hindi nag-a-update kapag pareho ang sukat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        const group = selectedId ? svgRef.current?.querySelector<SVGGElement>(`[data-item-id="${CSS.escape(selectedId)}"]`) : null;
        const box = group ? group.getBBox() : null;
        const next = box && box.width + box.height > 0 ? { x: box.x, y: box.y, width: box.width, height: box.height } : null;
        setSelectionBox((prev) =>
            prev && next && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
                ? prev
                : next,
        );
    });

    // Default na filename: <pangalan ng PDF>-stamped
    useEffect(() => {
        setDownloadFileName(pdfFile ? `${pdfFile.name.replace(/.pdf$/i, '')}-stamped` : '');
    }, [pdfFile]);

    /*
     * PAN: i-drag ang PDF (mouse) para i-scroll kapag naka-zoom.
     * Sa touch, native scroll na ang bahala.
     */
    const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        if ((e.target as Element).closest('[data-draggable]')) return;
        const el = e.currentTarget;
        panInfo.current = {
            pointerId: e.pointerId,
            startClientX: e.clientX,
            startClientY: e.clientY,
            scrollLeft: el.scrollLeft,
            scrollTop: el.scrollTop,
            moved: false,
        };
        el.setPointerCapture(e.pointerId);
        setIsPanning(true);
    };

    const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const info = panInfo.current;
        if (!info || info.pointerId !== e.pointerId) return;
        if (Math.abs(e.clientX - info.startClientX) + Math.abs(e.clientY - info.startClientY) > 3) info.moved = true;
        e.currentTarget.scrollLeft = info.scrollLeft - (e.clientX - info.startClientX);
        e.currentTarget.scrollTop = info.scrollTop - (e.clientY - info.startClientY);
    };

    const handlePanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (panInfo.current?.pointerId !== e.pointerId) return;
        if (!panInfo.current.moved) onSelect(null);
        panInfo.current = null;
        setIsPanning(false);
    };

    /*
     * DRAG ng stamp / text / image
     */
    const handlePointerDown = (e: React.PointerEvent<SVGGElement>, id: string) => {
        if (e.button !== 0 || !svgRef.current || !pageSize) return;
        e.preventDefault();
        // Alisin ang focus sa form para gumana agad ang arrow keys sa napiling item
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        onSelect(id);

        const group = e.currentTarget;
        const bbox = group.getBBox();
        const svgScale = svgRef.current.getBoundingClientRect().width / pageSize.width;
        group.setPointerCapture(e.pointerId);

        // Bawal lumabas sa page; kung lampas na dati, hayaang gumalaw pabalik
        dragInfo.current = {
            id,
            pointerId: e.pointerId,
            startClientX: e.clientX,
            startClientY: e.clientY,
            scale: svgScale,
            minDx: Math.min(0, -bbox.x),
            maxDx: Math.max(0, pageSize.width - (bbox.x + bbox.width)),
            minDy: Math.min(0, -bbox.y),
            maxDy: Math.max(0, pageSize.height - (bbox.y + bbox.height)),
        };
        setDrag({ id, dx: 0, dy: 0 });
    };

    const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
        const info = dragInfo.current;
        if (!info || info.pointerId !== e.pointerId) return;

        setDrag({
            id: info.id,
            dx: clamp((e.clientX - info.startClientX) / info.scale, info.minDx, info.maxDx),
            dy: clamp((e.clientY - info.startClientY) / info.scale, info.minDy, info.maxDy),
        });
    };

    const handlePointerUp = (e: React.PointerEvent<SVGGElement>, item: Item) => {
        const info = dragInfo.current;
        if (!info || info.pointerId !== e.pointerId) return;
        dragInfo.current = null;

        if (e.type === 'pointerup' && drag && (drag.dx !== 0 || drag.dy !== 0)) {
            dispatch({
                type: 'updateItemPosition',
                payload: {
                    id: info.id,
                    x: Math.round(item.x + drag.dx),
                    y: Math.round(item.y + drag.dy),
                },
            });
        }
        setDrag(null);
    };

    const displayWidth = pageSize ? pageSize.width * scale : Math.max(viewportWidth - PAGE_PADDING * 2, 200);
    const displayHeight = pageSize ? pageSize.height * scale : undefined;

    return (
        <div className='flex h-[75vh] w-full flex-col overflow-hidden rounded-md border bg-background lg:h-full'>
            {/* TOOLBAR */}
            <div className='flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2'>
                <div className='flex items-center'>
                    <Button
                        variant='ghost'
                        size='icon'
                        disabled={pdfCurrentPage <= 1}
                        onClick={() => setPage(pdfCurrentPage - 1)}
                        aria-label='Previous page'
                    >
                        <IconChevronLeft size={18} />
                    </Button>
                    <span className='min-w-[56px] text-center text-sm font-medium tabular-nums'>
                        {pdfCurrentPage} / {pdfPages || '–'}
                    </span>
                    <Button
                        variant='ghost'
                        size='icon'
                        disabled={pdfCurrentPage >= pdfPages}
                        onClick={() => setPage(pdfCurrentPage + 1)}
                        aria-label='Next page'
                    >
                        <IconChevronRight size={18} />
                    </Button>
                </div>

                <div className='h-6 w-px bg-border' />

                <div className='flex items-center'>
                    <Button variant='ghost' size='icon' onClick={() => zoomStep(-1)} disabled={scale <= MIN_ZOOM} aria-label='Zoom out'>
                        <IconZoomOut size={18} />
                    </Button>
                    <span className='min-w-[48px] text-center text-sm tabular-nums'>{Math.round(scale * 100)}%</span>
                    <Button variant='ghost' size='icon' onClick={() => zoomStep(1)} disabled={scale >= MAX_ZOOM} aria-label='Zoom in'>
                        <IconZoomIn size={18} />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setZoom('fit')}
                        className={cn('gap-1', zoom === 'fit' && 'text-primary')}
                    >
                        <IconArrowsHorizontal size={16} />
                        Fit width
                    </Button>
                </div>

                <div className='ml-auto flex items-center gap-2'>
                    <Input
                        placeholder='Filename'
                        aria-label='Filename'
                        type="text"
                        value={downloadFileName}
                        onChange={(e) => setDownloadFileName(e.target.value)}
                        className="h-9 w-[160px]"
                    />
                    <div className='w-[170px]'>
                        <OutputButton
                            downloadFileName={downloadFileName}
                            pdfFile={pdfFile} currentPage={pdfCurrentPage} rotation={0}
                            component={state}
                        />
                    </div>
                </div>
            </div>

            {/* PDF VIEW (scroll + pan + zoom) */}
            <div
                ref={scrollRef}
                className={cn(
                    'min-h-0 flex-1 overflow-auto bg-muted/40',
                    isPanning ? 'cursor-grabbing select-none' : 'cursor-grab',
                )}
                style={{ padding: PAGE_PADDING }}
                onPointerDown={handlePanStart}
                onPointerMove={handlePanMove}
                onPointerUp={handlePanEnd}
                onPointerCancel={handlePanEnd}
            >
                <div
                    className="relative m-auto overflow-hidden bg-white shadow-md"
                    style={{ width: displayWidth, height: displayHeight }}
                >
                    <Document file={pdfFile}>
                        <Page
                            pageNumber={pdfCurrentPage}
                            width={displayWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={(page) => setPageSize({ width: page.originalWidth, height: page.originalHeight })}
                        />
                    </Document>

                    {pageSize && (
                        <svg
                            ref={svgRef}
                            className="absolute inset-0 h-full w-full select-none"
                            viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
                            preserveAspectRatio="none"
                            style={{ zIndex: 2, pointerEvents: 'none' }}
                        >
                            {state.items.map((item) => {
                                if (!item.isShown || !item.id) return null;
                                if (item.page && item.page !== pdfCurrentPage) return null;
                                const isDragging = drag?.id === item.id;

                                // Isang group bawat item: ang stamp at mga laman nito ay sabay gumagalaw,
                                // naka-fix ang subcomponents relative sa stamp
                                return (
                                    <g
                                        key={item.id}
                                        data-draggable
                                        data-item-id={item.id}
                                        transform={isDragging ? `translate(${drag.dx} ${drag.dy})` : undefined}
                                        className={cn(
                                            'touch-none hover:drop-shadow-[0_0_3px_rgba(59,130,246,0.9)]',
                                            isDragging ? 'cursor-grabbing drop-shadow-[0_0_3px_rgba(59,130,246,0.9)]' : 'cursor-move',
                                        )}
                                        style={{ pointerEvents: 'all' }}
                                        onPointerDown={(e) => handlePointerDown(e, item.id!)}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={(e) => handlePointerUp(e, item)}
                                        onPointerCancel={(e) => handlePointerUp(e, item)}
                                    >
                                        <OverlayElement
                                            el={item}
                                            x={item.x}
                                            y={item.y}
                                            placeholder={item.subcomponents ? undefined : item.type === 'image' ? 'image' : 'Enter text'}
                                        />
                                        {item.subcomponents?.map((sub, index) => (
                                            <OverlayElement
                                                key={sub.id ?? index}
                                                el={sub}
                                                x={item.x + (sub.x || 0)}
                                                y={item.y + (sub.y || 0)}
                                            />
                                        ))}
                                    </g>
                                );
                            })}
                            {selectionBox && (
                                <rect
                                    x={selectionBox.x - 3}
                                    y={selectionBox.y - 3}
                                    width={selectionBox.width + 6}
                                    height={selectionBox.height + 6}
                                    transform={drag?.id === selectedId ? `translate(${drag.dx} ${drag.dy})` : undefined}
                                    fill="none"
                                    stroke="rgb(59,130,246)"
                                    strokeWidth={1.5 / scale}
                                    strokeDasharray={`${4 / scale} ${3 / scale}`}
                                    pointerEvents="none"
                                />
                            )}
                        </svg>
                    )}
                </div>
            </div>

            <p className='border-t px-3 py-1.5 text-center text-xs text-muted-foreground'>
                I-click para piliin, i-drag para ilipat · Arrow keys = ilipat · Delete = tanggalin · I-drag ang PDF para mag-pan · Ctrl + scroll = zoom
            </p>
        </div>
    );
};

export default PdfViewer;
