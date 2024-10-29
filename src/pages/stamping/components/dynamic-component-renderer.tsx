import StampReceivedForm from './stamp-received-form';
import StampCtcForm from './stamp-ctc-form';
import AddTextForm from './add-text-form';
import AddDateForm from './add-date-form';
import AddTimeForm from './add-time-form';
import { State, Item } from '../util/stamps-reducer-types'

// Define the props that each component will receive
type ComponentProps = {
  removeItem: (id: string) => void;
  id: string; // Include the id prop
  dispatch: (action: any) => void;
};

type Props = {
  state: State;
  dispatch: any;
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
};

export default function DynamicComponentRenderer({ state, dispatch }: Props) {
  return (
    <>
      {state.items.map((item) => {
        const Component = componentMap[item?.component];
        return Component ? (
          <Component
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
