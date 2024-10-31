import StampReceivedForm from './stamp-received-form';
import StampCtcForm from './stamp-ctc-form';
import AddTextForm from './add-text-form';
import AddDateForm from './add-date-form';
import AddTimeForm from './add-time-form';
import SelectImageForm from './select-image-form';
import { State, Item } from '../util/stamps-reducer-types'

// Define the props that each component will receive
type ComponentProps = {
  removeItem: (id: string) => void;
  id: string; // Include the id prop
  dispatch: (action: any) => void;
  pdfHeight: number;
  pdfWidth: number;
};

type Props = {
  state: State;
  dispatch: any;
  pdfHeight: number;
  pdfWidth: number;
}

// Update the ComponentMap to use the new ComponentProps type
type ComponentMap = {
  [key in Item['component']]?: React.ComponentType<ComponentProps>;
};

const componentMap: ComponentMap = {
  StampReceivedForm,
  StampCtcForm,
  AddTextForm,
  AddDateForm,
  AddTimeForm,
  SelectImageForm,

};

export default function DynamicComponentRenderer({ state, dispatch, pdfHeight, pdfWidth }: Props) {
  return (
    <>
      {state.items.map((item) => {
        const Component = componentMap[item?.component];
        return Component ? (
          <Component
            pdfHeight={pdfHeight}
            pdfWidth={pdfWidth}
            key={item.id}
            id={item.id!}
            dispatch={dispatch}
            removeItem={(id) => dispatch({ type: 'removeItem', payload: { id } })}
          />
        ) : null;
      })}
    </>
  );
}
