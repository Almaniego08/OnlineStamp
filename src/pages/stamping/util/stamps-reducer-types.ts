import { RGB } from "pdf-lib";


    
// Define a subcomponent type to avoid duplication
export interface Subcomponent {
    id?: string;
    component: string;
    height?: number;
    width?: number;
    x?: number;
    y?: number;
    isShown?: boolean;
    color?: RGB;
    type?: string;
    content?: string | HTMLImageElement | { title: string; src: string };
}

// Update the main Item interface to use the Subcomponent type
export interface Item {
    id?: string;
    component: string;
    height?: number;
    width?: number;
    x?: number;
    y?: number;
    isShown?: boolean;
    color?: RGB;
    type?: string;
    content?: string | HTMLImageElement | { title: string; src: string };
    subcomponents?: Subcomponent[];
}

export interface State {
    items: Item[];
}

export type Action =
    | { type: 'addItem'; payload: Item }
    | { type: 'removeItem'; payload: { id: string } }
    | { type: 'updateItem'; payload: Item }
    | { type: 'toggleVisibility'; payload: { id: string } }
    | { type: 'updateReceiveStampDetails'; payload: { id: string } }
    | { type: 'reset'; };
