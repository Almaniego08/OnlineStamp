import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    icon: ReactNode;
    label: string;
    hint: string;
    onClick: () => void;
    disabled?: boolean;
};

export default function AddTileButton({ icon, label, hint, onClick, disabled }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'group flex w-full items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors',
                'hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
            )}
        >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{hint}</span>
            </span>
        </button>
    );
}
