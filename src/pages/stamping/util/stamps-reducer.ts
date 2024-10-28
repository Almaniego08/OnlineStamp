import { State, Action } from './stamps-reducer-types';
import { initialState } from './stamps-reducer-initialize';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'addItem':
            return { ...state, items: [...state.items, action.payload] };
        case 'removeItem':
            return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
        case 'updateItem':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload } : item
                )
            };
        // case 'updateReceiveStampDetails':
        //     return {
        //         ...state,
        //         items: state.items.map(item => {
        //             if (item.id === action.payload.id) {
        //                 return {
        //                     ...item,
        //                     subcomponents: item.subcomponents?.map(sub => {
        //                         if (sub.id === action.payload.subId) {
        //                             return {
        //                                 ...sub,
        //                                 content: {
        //                                     trackingNo: action.payload.trackingNo,
        //                                     date: action.payload.date,
        //                                     time: action.payload.time,
        //                                 } as Content, // Explicitly cast to ensure type safety
        //                             };
        //                         }
        //                         return sub;
        //                     }) || [], // Fallback to empty array if subcomponents is undefined
        //                 };
        //             }
        //             return item;
        //         }),
        //     };



        case 'toggleVisibility':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, isShown: !item.isShown } : item
                )
            };
        case 'reset':
            return initialState; // Reset to the initial state
        default:
            return state; // Ensure a default case to handle unknown actions
    }
};
