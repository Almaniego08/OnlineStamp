import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/custom/button';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function ModalImageView({ isOpen, onClose, title, children }: Props) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md md:w-1/3 bg-background p-6 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
                <Dialog.Title className="text-xl font-bold text-foreground text-nowrap">{title}</Dialog.Title>
                <Dialog.Description className="mt-2">{children}</Dialog.Description>
                <div className="mt-4 flex justify-end">
                    <Dialog.Close>
                        <Button className="bg-background text-foreground" variant='outline'>
                            Confirm
                        </Button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
}
