import { RGB } from "pdf-lib";
import { dispatchPosition, } from './stamps-reducer-dispatch'


// Define a subcomponent type to avoid duplication
export interface Subcomponent {
    id?: string;
    component: string;
    height?: number;
    width?: number;
    x: number;
    y: number;
    isShown?: boolean;
    color?: RGB;
    type?: string;
    size?: number;
    content: string | HTMLImageElement | { title: string; src: string | File };
}

// Update the main Item interface to use the Subcomponent type
export interface Item {
    id?: string;
    component: string;
    height?: number;
    width?: number;
    x: number;
    y: number;
    isShown?: boolean;
    color?: RGB;
    type?: string;
    size?: number;
    content: string | HTMLImageElement | { title: string; src: string | File };
    subcomponents?: Subcomponent[];
    page?: number; // 1-based page ng PDF kung saan nakalagay
}

export interface State {
    items: Item[];
}

export type Action =
    | { type: 'addItem'; payload: Item }
    | { type: 'removeItem'; payload: { id: string } }
    | { type: 'updateItem'; payload: Item }
    | { type: 'toggleVisibility'; payload: { id: string } }
    | {
        type: 'updateReceiveStampDetails'; payload: {
            id: string,
            subId: string,
            value: string | { title: string; src: string },
        }
    }
    |
    {
        type: 'updatePositionY';
        payload: dispatchPosition
    }
    |
    {
        type: 'updatePositionX';
        payload: dispatchPosition
    }
    |
    {
        type: 'updateTextDetails',
        payload: {
            id: string;
            value: string;
        },
    }
    |
    {
        type: 'updatePositionTopBottomLeftRight',
        payload: {
            id: string;
            position: string;
            value: number;
        },
    }
    |
    {
        type: 'updateImageUploadDetails',
        payload: {
            id: string;
            value: { title: string; src: string | File },
            width: number,
            height: number,
        }
    }
    | {
        type: 'handleTextSizeButtonClick',
        payload: {
            id: string;
            operator: string
        }
    }
    | {
        type: 'handleImageSizeButtonClick',
        payload: {
            id: string;
            operator: string
        }
    }
    |
    {
        type: 'updateSubcomponentText',
        payload: {
            parentId: string;
            subcomponentIndex: number; // Index na ang gagamitin natin imbis na Y
            value: string;
        }
    }
    |
    {
        type: 'updateTextColor',
        payload: {
            id: string;
            value: RGB
        }
    }
    | { type: 'reset'; }
    | {
        type: 'updateSubcomponentSize';
        payload: {
            parentId: string;
            subcomponentIndex: number;
            width: number;
            height: number;
        }
    }
    | { type: 'updateSubcomponentPosition'; payload: { parentId: string; subcomponentIndex: number; x: number; y: number } }
    | { type: 'updateItemPosition'; payload: { id: string; x: number; y: number } };

export type StampDispatch = React.Dispatch<Action>;
