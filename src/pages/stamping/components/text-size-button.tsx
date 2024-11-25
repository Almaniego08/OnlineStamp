import { IconTextDecrease, IconTextIncrease, IconBold } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';
import useColorPicker from './use-color-picker';
import { RGB } from 'pdf-lib';

type Props = {
    dispatch: (action: any) => void;
    id: string;
};

export default function TextSizeButton({ dispatch, id }: Props) {
    const updateTextColor = (rgbColor: RGB) => {
        dispatch({
            type: 'updateTextColor',
            payload: { id, value: rgbColor },
        });
    };

    const [ColorPicker] = useColorPicker({ updateTextColor });

    const handleTextSizeButtonClick = (operator: string) => {
        dispatch({
            type: 'handleTextSizeButtonClick',
            payload: { id, operator: operator },
        });
    };

    return (
        <div className="flex flex-row gap-[5px]">
            <ColorPicker />
            <Button onClick={() => handleTextSizeButtonClick('-')} variant="ghost"><IconTextDecrease size={24} /></Button>
            <Button onClick={() => handleTextSizeButtonClick('+')} variant="ghost"><IconTextIncrease size={24} /></Button>
            <Button variant="ghost"><IconBold size={24} /></Button>
        </div>
    );
}
