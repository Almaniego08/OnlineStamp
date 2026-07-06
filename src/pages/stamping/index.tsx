import { useState, useEffect } from 'react'
import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Received } from './components/received'
import { CTC } from './components/ctc'
import { Text } from './components/text'
import { Date } from './components/date'
import { Time } from './components/time'
import { NoFileAddedDisplay } from './components/no-file-added-display'
import { AddFileButton as useAddFileButton } from './components/add-file-button';
import { PDFDocument } from 'pdf-lib';

// USE REDUCER FOR ADD STAMPS
import { useReducer } from 'react';
import { initialState } from './util/stamps-reducer-initialize';
import { reducer } from './util/stamps-reducer';
import { Item } from './util/stamps-reducer-types';
import DynamicComponentRenderer from './components/dynamic-component-renderer'
import PdfViewer from './components/pdf-viewer'
import PagerButton from './components/pager-button'
import { Selectfile } from './components/select-image'

export default function Tasks() {
  // USE REDUCER FOR ADD STAMPS
  const [stampsState, dispatch] = useReducer(reducer, initialState);
  const addItem = (item: Item) => dispatch({ type: 'addItem', payload: item });

  // EXTRACT COMPONENTS WITH SAME ID AND COMPONENT NAME
  useEffect(() => {

  }, [stampsState])

  //  PDF
  const { component: AddFileButton, pdfFile, } = useAddFileButton();
  const [pdfHeight, setPdfHeight] = useState<number>(0)
  const [pdfWidth, setPdfWidth] = useState<number>(0)
  const [pdfPages, setPdfPages] = useState<number>(0)
  const [pdfCurrentPage, setPdfCurrentPage] = useState<number>(1)

  useEffect(() => {
    async function loadFile() {
      if (pdfFile) {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const page = pdfDoc.getPages()[pdfCurrentPage - 1];
        setPdfPages(pdfDoc.getPageCount())

        setPdfHeight(page.getHeight())
        setPdfWidth(page.getWidth())
      }
    }
    loadFile()
  }, [pdfFile])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <h1 className='text-2xl font-bold tracking-tight'>STAMPING</h1>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className='flex flex-col lg:flex-row items-start gap-[20px] w-full lg:h-[calc(100vh-140px)] lg:overflow-hidden'>

          {/* Left Column: Independent Scrollable Panel on Desktop */}
          <div className='flex flex-col gap-2 w-full lg:w-1/2 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-zinc-800
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700'>
            {AddFileButton}
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center ">
                <Received addItem={addItem} state={stampsState} />
              </div>
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center">
                <CTC addItem={addItem} state={stampsState} />
              </div>
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center">
                <Text addItem={addItem} state={stampsState} />
              </div>
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center">
                <Date addItem={addItem} state={stampsState} />
              </div>
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center">
                <Time addItem={addItem} state={stampsState} />
              </div>
              <div className="flex flex-1 shrink-0 min-w-[150px] items-center justify-center">
                <Selectfile addItem={addItem} state={stampsState} />
              </div>
            </div>

            <div className='flex flex-col gap-[20px] mt-2'>
              <DynamicComponentRenderer
                pdfHeight={pdfHeight}
                pdfWidth={pdfWidth}
                state={stampsState}
                dispatch={dispatch}
              />
            </div>
          </div>

          {/* Right Column: Sticky / Fixed Viewport Panel on Desktop */}
          {pdfFile ? (
            <div className='flex flex-col gap-2 w-full lg:w-1/2 lg:h-full lg:sticky lg:top-0 lg:overflow-y-auto bg-background/50 p-1 rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700'>
              <PagerButton
                setPage={setPdfCurrentPage}
                pdfPages={pdfPages}
                pdfCurrentPage={pdfCurrentPage}
              />
              <div className="w-full overflow-x-auto flex justify-center">
                <PdfViewer state={stampsState} pdfFile={pdfFile} pdfCurrentPage={pdfCurrentPage} />
              </div>
            </div>
          ) : (
            <NoFileAddedDisplay />
          )}

        </div>
      </Layout.Body>
    </Layout>
  )
}