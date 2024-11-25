import { IconPlus,IconMinus  } from '@tabler/icons-react';
import { Button } from '@/components/custom/button';


type Props = {
    dispatch: (action: any) => void;
    id: string;
};

export default function ImageSizeButton({ dispatch, id }: Props) {


    const handleImageSizeButtonClick = (operator: string) => {
        dispatch({
            type: 'handleImageSizeButtonClick',
            payload: { id, operator: operator },
        });
    };

    return (
        <div className="flex flex-row gap-[5px]">
            <Button onClick={() => handleImageSizeButtonClick('-')} variant="ghost"><IconMinus size={24} /></Button>
            <Button onClick={() => handleImageSizeButtonClick('+')} variant="ghost"><IconPlus size={24} /></Button>
        </div>
    );
}
