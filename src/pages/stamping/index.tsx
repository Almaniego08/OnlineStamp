import { useState, useEffect, useReducer } from 'react'
import { IconLock, IconRubberStamp } from '@tabler/icons-react'
import { PDFDocument } from 'pdf-lib';
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { toast } from '@/components/ui/use-toast'
import { Received } from './components/received'
import { Released } from './components/released';
import { Text } from './components/text'
import { Date } from './components/date'
import { Time } from './components/time'
import { Selectfile } from './components/select-image'
import { PdfFileCard, PdfDropzone } from './components/pdf-file-input'
import DynamicComponentRenderer from './components/dynamic-component-renderer'
import PdfViewer from './components/pdf-viewer'
// USE REDUCER FOR ADD STAMPS
import { initialState } from './util/stamps-reducer-initialize';
import { reducer } from './util/stamps-reducer';
import { Item } from './util/stamps-reducer-types';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [role="listbox"], [role="menu"], [role="combobox"]');

export default function Tasks() {
  // USE REDUCER FOR ADD STAMPS
  const [stampsState, dispatch] = useReducer(reducer, initialState);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  //  PDF
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<number>(0)
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)

  const handlePdfFile = (file: File) => {
    setPdfFile(file);
    setPdfCurrentPage(1);
    setSelectedId(null);
  };

  useEffect(() => {
    let cancelled = false;
    async function loadFile() {
      if (!pdfFile) return;
      try {
        const doc = await PDFDocument.load(await pdfFile.arrayBuffer());
        if (cancelled) return;
        const count = doc.getPageCount();
        setPdfDoc(doc);
        setPdfPages(count);
        // Kung mas kaunti ang pages ng bagong PDF, ilipat sa huling page ang mga lampas
        stampsState.items.forEach((item) => {
          if (item.page && item.page > count) dispatch({ type: 'updateItem', payload: { ...item, page: count } });
        });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Hindi mabuksan ang PDF', description: 'Baka sira o naka-password ang file.' });
        setPdfFile(null);
      }
    }
    loadFile()
    return () => { cancelled = true; };
  }, [pdfFile])

  // Sukat ng kasalukuyang page (para sa align buttons)
  useEffect(() => {
    const page = pdfDoc?.getPages()[pdfCurrentPage - 1];
    if (page) setPageSize({ width: page.getWidth(), height: page.getHeight() });
  }, [pdfDoc, pdfCurrentPage])

  // Bagong item: sa kasalukuyang page, bahagyang naka-offset para hindi magpatong-patong, at naka-select agad
  const addItem = (item: Item) => {
    const onThisPage = stampsState.items.filter((i) => i.page === pdfCurrentPage).length;
    const offset = (onThisPage % 6) * 12;
    dispatch({ type: 'addItem', payload: { ...item, page: pdfCurrentPage, x: item.x + offset, y: item.y + offset } });
    if (item.id) setSelectedId(item.id);
  };

  // Kapag pinili ang card ng item na nasa ibang page, pumunta sa page na iyon
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    const item = stampsState.items.find((i) => i.id === id);
    if (item?.page && item.page !== pdfCurrentPage) setPdfCurrentPage(item.page);
  };

  // Keyboard: arrows = ilipat (Shift = 10), Delete = tanggalin, Esc = alisin ang selection
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedId || isTyping(e.target)) return;
      const step = e.shiftKey ? 10 : 1;
      const move = (axis: 'X' | 'Y', operator: '+' | '-') =>
        dispatch({ type: `updatePosition${axis}`, payload: { id: selectedId, operator, value: step } });

      switch (e.key) {
        case 'ArrowLeft': move('X', '-'); break;
        case 'ArrowRight': move('X', '+'); break;
        case 'ArrowUp': move('Y', '-'); break;
        case 'ArrowDown': move('Y', '+'); break;
        case 'Delete':
        case 'Backspace':
          dispatch({ type: 'removeItem', payload: { id: selectedId } });
          setSelectedId(null);
          break;
        case 'Escape': setSelectedId(null); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  const addProps = { addItem, state: stampsState, disabled: !pdfFile };
  const itemCount = stampsState.items.length;

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky className='border-b'>
        <div className='flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary'>
          <IconRubberStamp size={20} />
        </div>
        <div className='min-w-0'>
          <h1 className='text-lg font-semibold leading-tight'>Stamping</h1>
          <p className='hidden truncate text-xs text-muted-foreground sm:block'>
            Lagyan ng RECEIVED o RELEASED stamp, pirma, text, date at time ang PDF. Sa device mo lang ito; walang ina-upload.
          </p>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeSwitch />
          {/* Sign out sa password gate (netlify/edge-functions/password.ts) */}
          <a
            href='/__logout'
            className='inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            title='Sign out'
          >
            <IconLock size={16} />
            <span className='hidden sm:inline'>Lock</span>
          </a>
        </div>
      </Layout.Header>
      <Layout.Body className='py-4'>
        <div className='flex w-full flex-col gap-4 lg:h-[calc(100vh-var(--header-height)-2rem)] lg:flex-row'>

          {/* Left Column: Independent Scrollable Panel on Desktop */}
          <aside className='custom-scrollbar flex w-full flex-col gap-4 lg:h-full lg:w-[400px] lg:shrink-0 lg:overflow-y-auto lg:pr-1'>
            <PdfFileCard file={pdfFile} pages={pdfPages} onFile={handlePdfFile} />

            <section className='rounded-lg border bg-card p-4'>
              <h2 className='mb-1 text-sm font-semibold'>
                Add to {pdfFile ? `page ${pdfCurrentPage}` : 'the PDF'}
              </h2>
              <p className='mb-3 text-xs text-muted-foreground'>
                {pdfFile ? 'Lalabas sa PDF; i-drag para ilipat.' : 'Pumili muna ng PDF.'}
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <Received {...addProps} />
                <Released {...addProps} />
                <Text {...addProps} />
                <Date {...addProps} />
                <Time {...addProps} />
                <Selectfile {...addProps} />
              </div>
            </section>

            <div className='flex flex-col gap-3'>
              <h2 className='px-1 text-sm font-semibold'>
                On this PDF {itemCount > 0 && <span className='font-normal text-muted-foreground'>({itemCount})</span>}
              </h2>
              <DynamicComponentRenderer
                pageWidth={pageSize.width}
                pageHeight={pageSize.height}
                state={stampsState}
                dispatch={dispatch}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </div>
          </aside>

          {/* Right Column: Sticky / Fixed Viewport Panel on Desktop */}
          <div className='flex min-w-0 flex-1 lg:h-full'>
            {pdfFile ? (
              <PdfViewer
                state={stampsState}
                dispatch={dispatch}
                pdfFile={pdfFile}
                pdfCurrentPage={pdfCurrentPage}
                pdfPages={pdfPages}
                setPage={setPdfCurrentPage}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            ) : (
              <PdfDropzone onFile={handlePdfFile} />
            )}
          </div>

        </div>
      </Layout.Body>
    </Layout>
  )
}
