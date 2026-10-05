import {
  IconRubberStamp,
  IconLetterCase,
  IconCalendarMonth,
  IconClockHour1,
  IconPhoto,
  IconStack2,
} from '@tabler/icons-react';
import StampReceivedForm from './stamp-received-form';
import StampReleasedForm from './stamp-released-form';
import AddTextForm from './add-text-form';
import AddDateForm from './add-date-form';
import AddTimeForm from './add-time-form';
import SelectImageForm from './select-image-form';
import ItemCard from './item-card';
import { State, Item, StampDispatch } from '../util/stamps-reducer-types'

// Props na natatanggap ng bawat form
export type ItemFormProps = {
  id: string;
  item: Item;
  dispatch: StampDispatch;
};

type Props = {
  state: State;
  dispatch: StampDispatch;
  pageWidth: number;
  pageHeight: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const componentMap: Record<string, { Form: React.ComponentType<ItemFormProps>; title: string; icon: JSX.Element }> = {
  StampReceivedForm: { Form: StampReceivedForm, title: 'RECEIVED stamp', icon: <IconRubberStamp size={18} /> },
  StampReleasedForm: { Form: StampReleasedForm, title: 'RELEASED stamp', icon: <IconRubberStamp size={18} /> },
  AddTextForm: { Form: AddTextForm, title: 'Text', icon: <IconLetterCase size={18} /> },
  AddDateForm: { Form: AddDateForm, title: 'Date', icon: <IconCalendarMonth size={18} /> },
  AddTimeForm: { Form: AddTimeForm, title: 'Time', icon: <IconClockHour1 size={18} /> },
  SelectImageForm: { Form: SelectImageForm, title: 'Image', icon: <IconPhoto size={18} /> },
};

export default function DynamicComponentRenderer({ state, dispatch, pageWidth, pageHeight, selectedId, onSelect }: Props) {
  if (state.items.length === 0) {
    return (
      <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center text-muted-foreground'>
        <IconStack2 size={28} />
        <p className='text-sm'>Wala pang nakalagay.</p>
        <p className='text-xs'>Pumili ng stamp, text o image sa itaas, tapos i-drag ito sa PDF.</p>
      </div>
    );
  }

  return (
    <>
      {state.items.map((item) => {
        const entry = componentMap[item?.component];
        if (!entry || !item.id) return null;
        const { Form, title, icon } = entry;
        const id = item.id;

        return (
          <ItemCard
            key={id}
            item={item}
            title={title}
            icon={icon}
            selected={selectedId === id}
            onSelect={() => selectedId !== id && onSelect(id)}
            onRemove={() => {
              dispatch({ type: 'removeItem', payload: { id } });
              if (selectedId === id) onSelect(null);
            }}
            dispatch={dispatch}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          >
            <Form id={id} item={item} dispatch={dispatch} />
          </ItemCard>
        );
      })}
    </>
  );
}
