import { ReactNode, useEffect, useRef } from 'react';
import type { StampDispatch } from '../util/stamps-reducer-types';
import { IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Item } from '../util/stamps-reducer-types';
import { PositioningButton } from './positioning-button';

type Props = {
    item: Item;
    title: string;
    icon: ReactNode;
    selected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    dispatch: StampDispatch;
    pageWidth: number;
    pageHeight: number;
    children: ReactNode;
};

/*
 * Iisang itsura para sa lahat ng item: header (icon, pangalan, page, delete),
 * laman ng form, at position controls kapag naka-select.
 */
export default function ItemCard({ item, title, icon, selected, onSelect, onRemove, dispatch, pageWidth, pageHeight, children }: Props) {
    const ref = useRef<HTMLElement>(null);

    // Kapag pinili sa PDF, ipakita ang card nito
    useEffect(() => {
        if (selected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [selected]);

    return (
        <section
            ref={ref}
            onPointerDown={onSelect}
            onFocusCapture={onSelect}
            className={cn(
                'rounded-lg border bg-card transition-shadow',
                selected ? 'border-primary/60 ring-2 ring-primary/30' : 'hover:border-muted-foreground/40',
            )}
        >
            <header className="flex items-center gap-2 px-4 pb-2 pt-3">
                <span className={cn('text-muted-foreground', selected && 'text-foreground')}>{icon}</span>
                <h3 className="flex-1 truncate text-sm font-semibold">{title}</h3>
                {item.page && <Badge variant="secondary" className="font-normal">Page {item.page}</Badge>}
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    title="Remove"
                    aria-label={`Remove ${title}`}
                >
                    <IconTrash size={16} />
                </Button>
            </header>

            <div className="flex flex-col gap-3 px-4 pb-4">{children}</div>

            {selected && (
                <footer className="border-t bg-muted/40 px-3 py-2">
                    <PositioningButton item={item} dispatch={dispatch} pageWidth={pageWidth} pageHeight={pageHeight} />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        Tip: i-drag sa PDF, o gamitin ang arrow keys (Shift = mas malayo). Delete para tanggalin.
                    </p>
                </footer>
            )}
        </section>
    );
}
