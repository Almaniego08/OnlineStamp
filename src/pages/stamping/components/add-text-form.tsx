import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TextSizeButton from './text-size-button';
import type { ItemFormProps } from './dynamic-component-renderer';

export default function AddTextForm({ id, item, dispatch }: ItemFormProps) {
    const [text, setText] = useState<string>(typeof item.content === 'string' ? item.content : '');

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const new_value = e.target.value;
        setText(new_value);
        dispatch({
            type: 'updateTextDetails',
            payload: { id: id, value: new_value }
        });
    };

    return (
        <div className='flex flex-col gap-2'>
            <Label htmlFor={`text-${id}`}>Text</Label>
            <div className='flex flex-wrap items-center gap-2'>
                <Input
                    placeholder='Enter text'
                    id={`text-${id}`}
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    className="min-w-[160px] flex-1"
                    autoFocus
                />
                <TextSizeButton dispatch={dispatch} id={id} size={item.size} color={item.color} />
            </div>
        </div>
    )
}
