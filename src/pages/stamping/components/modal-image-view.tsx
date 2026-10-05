import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function ModalImageView({ isOpen, onClose, title, children }: Props) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-5 shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                        <Dialog.Title className="truncate text-base font-semibold text-foreground">{title}</Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon" className="size-8" aria-label="Close">
                                <IconX size={16} />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description asChild>
                        <div className="mt-3">{children}</div>
                    </Dialog.Description>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
