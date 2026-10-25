import type ButtonTypes from "../buttons/types/ButtonTypes";

export default interface ModalButton {
    title: string,
    type?: ButtonTypes,
    callback?: () => void,
}