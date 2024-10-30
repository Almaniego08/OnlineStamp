import React from 'react'
import { IconTextDecrease, IconTextIncrease, IconBold } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
type Props = {}

export default function TextSizeButton({ }: Props) {
    return (
        <div className='flex flex-row gap-[5px]'>
            <Button variant='ghost' className='' ><IconTextDecrease size={24} /></Button>
            <Button variant='ghost' className='' ><IconTextIncrease size={24} /></Button>
            <Button variant='ghost' className='' ><IconBold size={24} /></Button>
        </div>
    )
}