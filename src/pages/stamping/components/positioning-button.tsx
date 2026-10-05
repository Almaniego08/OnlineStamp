import { Button } from '@/components/custom/button';
import type { StampDispatch } from '../util/stamps-reducer-types';
import {
    IconArrowUp,
    IconArrowDown,
    IconArrowLeft,
    IconArrowRight,
    IconLayoutAlignTop,
    IconLayoutAlignBottom,
    IconLayoutAlignRight,
    IconLayoutAlignLeft,
    IconLayoutAlignCenter,
    IconLayoutAlignMiddle,
} from '@tabler/icons-react';
import { Item } from '../util/stamps-reducer-types';

type Props = {
    dispatch: StampDispatch;
    item: Item;
    pageWidth: number;
    pageHeight: number;
};

type Align = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'middle';

const NUDGE = 5;

/*
 * Ilipat nang paunti-unti, o i-align sa gilid ng page.
 * Ang align ay gumagamit ng totoong sukat ng item sa preview (stamp + laman nito, o text),
 * kaya tama kahit anong klase ng item.
 */
export function PositioningButton({ dispatch, item, pageWidth, pageHeight }: Props) {
    const id = item.id!;

    const nudge = (axis: 'X' | 'Y', operator: '+' | '-') =>
        dispatch({ type: `updatePosition${axis}`, payload: { id, operator, value: NUDGE } });

    const align = (where: Align) => {
        const group = document.querySelector<SVGGraphicsElement>(`[data-item-id="${CSS.escape(id)}"]`);
        if (!group || !pageWidth || !pageHeight) return;
        const box = group.getBBox();

        let { x, y } = item;
        if (where === 'left') x += -box.x;
        if (where === 'right') x += pageWidth - (box.x + box.width);
        if (where === 'center') x += (pageWidth - box.width) / 2 - box.x;
        if (where === 'top') y += -box.y;
        if (where === 'bottom') y += pageHeight - (box.y + box.height);
        if (where === 'middle') y += (pageHeight - box.height) / 2 - box.y;

        dispatch({ type: 'updateItemPosition', payload: { id, x: Math.round(x), y: Math.round(y) } });
    };

    const iconButton = (label: string, onClick: () => void, icon: JSX.Element) => (
        <Button variant="ghost" size="icon" className="size-8" onClick={onClick} title={label} aria-label={label}>
            {icon}
        </Button>
    );

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
                <span className="mr-1 text-xs text-muted-foreground">Move</span>
                {iconButton('Move left', () => nudge('X', '-'), <IconArrowLeft size={16} />)}
                {iconButton('Move up', () => nudge('Y', '-'), <IconArrowUp size={16} />)}
                {iconButton('Move down', () => nudge('Y', '+'), <IconArrowDown size={16} />)}
                {iconButton('Move right', () => nudge('X', '+'), <IconArrowRight size={16} />)}
            </div>
            <div className="flex items-center gap-0.5">
                <span className="mr-1 text-xs text-muted-foreground">Align</span>
                {iconButton('Align left', () => align('left'), <IconLayoutAlignLeft size={16} />)}
                {iconButton('Center horizontally', () => align('center'), <IconLayoutAlignCenter size={16} />)}
                {iconButton('Align right', () => align('right'), <IconLayoutAlignRight size={16} />)}
                {iconButton('Align top', () => align('top'), <IconLayoutAlignTop size={16} />)}
                {iconButton('Center vertically', () => align('middle'), <IconLayoutAlignMiddle size={16} />)}
                {iconButton('Align bottom', () => align('bottom'), <IconLayoutAlignBottom size={16} />)}
            </div>
        </div>
    );
}
