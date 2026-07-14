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
                                // TINGNAN: Kung ang subcomponent ay Image (ID '4') at ang payload ay ang bagong file payload object
                                if (sub.type === 'image' && typeof action.payload.value === 'object') {
                                    return {
                                        ...sub,
                                        // Kinukuha natin ang object structure na galing sa handleInitialUpload ({ title, src })
                                        content: action.payload.value,
                                    };
                                }

                                // Default fallback para sa mga normal text inputs (ID '1', '2', '3')
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
        case 'updateSubcomponentSize':
            return {
                ...state,
                items: state.items.map((item: any) => {
                    if (item.id !== action.payload.parentId) return item;

                    return {
                        ...item,
                        subcomponents: item.subcomponents?.map((sub: any, index: number) => {
                            if (index !== action.payload.subcomponentIndex) return sub;
                            return {
                                ...sub,
                                width: action.payload.width,
                                height: action.payload.height
                            };
                        })
                    };
                })
            };
        case 'updateSubcomponentPosition': 
            const { parentId, subcomponentIndex, x, y } = action.payload;
            return {
                ...state,
                items: state.items.map((item) => {
                    // Kung hindi ito ang hawak nating stamp card, huwag pakialaman
                    if (item.id !== parentId) return item;

                    // Gumawa ng shallow copy ng subcomponents array
                    const updatedSubcomponents = [...(item.subcomponents || [])];

                    // I-update lang ang x at y coordinates ng specific subcomponent (Signature o Stamp)
                    if (updatedSubcomponents[subcomponentIndex]) {
                        updatedSubcomponents[subcomponentIndex] = {
                            ...updatedSubcomponents[subcomponentIndex],
                            x: x,
                            y: y
                        };
                    }

                    return {
                        ...item,
                        subcomponents: updatedSubcomponents
                    };
                })
            };
        
        case 'reset':
            return initialState; // Reset to the initial state
        default:
            return state; // Ensure a default case to handle unknown actions
    }
};
