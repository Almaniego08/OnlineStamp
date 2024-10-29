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

        case 'updatePositionY':
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            y: (item.y ?? 0) + (action.payload.operator === '+' ? action.payload.value : -action.payload.value)
                        };
                    }
                    return item;
                })
            };

        case 'updatePositionX':
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            x: (item.x ?? 0) + (action.payload.operator === '+' ? action.payload.value : -action.payload.value)
                        };
                    }
                    return item;
                })
            };

        case 'updateReceiveStampDetails':
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        const updatedSubcomponents = item.subcomponents?.map(sub => {
                            if (sub.id === action.payload.subId) {
                                return {
                                    ...sub,
                                    content: action.payload.value
                                };
                            }
                            return sub;
                        });
                        return {
                            ...item,
                            subcomponents: updatedSubcomponents
                        };
                    }
                    return item;
                })
            };
        case 'updateTextDetails':
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            content: action.payload.value
                        };
                    }
                    return item;
                })
            }

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
