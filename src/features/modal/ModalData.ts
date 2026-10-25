import type ModalButton from "./ModalButton";
import type { ModalIcon } from "./ModalIcon";

export default interface ModalData {
    title: string,
    message: string,
    buttons?: Array<ModalButton>,
    isCancellable?: boolean,
    onCancel?: () => void,
    icon?: ModalIcon,
};