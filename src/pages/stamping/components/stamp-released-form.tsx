import StampFormBase, { StampFormConfig } from "./stamp-form-base";
import type { ItemFormProps } from "./dynamic-component-renderer";
import {
    released_stamp,
    initialMLC,
    signatureSSG,
    signatureAMS,
} from "../data/images";

/*
 * RELEASED STAMP
 *
 * Approver: Maricel L. Caballero (fixed)
 * Released by: Silva Ganados (default) o Alexander Luis M. Santos
 */
const CONFIG: StampFormConfig = {
    stampImage: released_stamp,
    approver: { label: "Maricel L. Caballero", data: initialMLC },
    people: [
        { id: "silva", label: "Silva Ganados", fullName: "Silva Ganados", data: signatureSSG },
        { id: "alexander", label: "Alexander Luis M. Santos", fullName: "Alexander Luis M. Santos", data: signatureAMS },
    ],
    defaultPersonId: "silva",
    personLabel: "Released by",
};

export default function StampReleasedForm({ id, dispatch }: ItemFormProps) {
    return <StampFormBase id={id} dispatch={dispatch} {...CONFIG} />;
}
