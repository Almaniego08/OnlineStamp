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
        case 'updateTextColor':
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            color: action.payload.value
                        };
                    }
                    return item;
                })
            }

        case 'updatePositionTopBottomLeftRight':
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.height && item.width || item.type === 'text') {
                        if (item.id === action.payload.id) {
                            if (action.payload.position === 'top') {
                                return {
                                    ...item,
                                    y: item.y = action.payload.value
                                }
                            } else if (action.payload.position === 'bottom') {
                                return {
                                    ...item,
                                    y: item.y = action.payload.value - (item.width ?? 0)
                                }
                            }
                            else if (action.payload.position === 'left') {
                                return {
                                    ...item,
                                    x: item.x = action.payload.value
                                }
                            }
                            else if (action.payload.position === 'right') {
                                return {
                                    ...item,
                                    x: item.x = action.payload.value - (item.width ?? 0)
                                }
                            }

                        }
                    }
                    return item;
                })
            }
        case 'updateImageUploadDetails':
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            width: action.payload.width,  // Set width directly on the item
                            height: action.payload.height, // Set height directly on the item
                            content: {
                                title: action.payload.value.title, // Only include title
                                src: action.payload.value.src,     // Only include src
                            },
                        };
                    }
                    return item; // Return unchanged item if id does not match
                }),
            };


        case 'handleTextSizeButtonClick':
            return {
                ...state,
                items: state.items.map((item) => {

                    if (item.id === action.payload.id) {
                        if (item.type === 'text' && item.size) {
                            return {
                                ...item,
                                size: action.payload.operator === '+' ? item.size + 1 : item.size - 1
                            }
                        }
                    }
                    return item;
                })
            }
        case 'handleImageSizeButtonClick':
            return {
                ...state,
                items: state.items.map((item) => {

                    if (item.id === action.payload.id) {
                        if (item.type === 'image' && item.height && item.width) {
                            return {
                                ...item,
                                width: action.payload.operator === '+' ? item.width + 5 : item.width - 5,
                                height: action.payload.operator === '+' ? item.height + 5 : item.height - 5

                            }
                        }
                    }
                    return item;
                })
            }

        case 'toggleVisibility':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, isShown: !item.isShown } : item
                )
            };
        // Add this action switch handler block case to your stamps-reducer logic:
        case 'updateSubcomponentText':
            return {
                ...state,
                items: state.items.map((item: any) => {
                    if (item.id !== action.payload.parentId) return item;

                    return {
                        ...item,
                        subcomponents: item.subcomponents?.map((sub: any, index: number) => {
                            // Index na ang tinitingnan natin dito, ligtas na sa galaw ng Y!
                            if (index !== action.payload.subcomponentIndex) return sub;
                            return {
                                ...sub,
                                content: action.payload.value
                            };
                        })
                    };
                })
            };
        case 'reset':
            return initialState; // Reset to the initial state
        default:
            return state; // Ensure a default case to handle unknown actions
    }
};
