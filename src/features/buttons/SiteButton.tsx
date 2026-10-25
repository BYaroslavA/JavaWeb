import type { ReactNode } from "react";
import ButtonTypes from "./types/ButtonTypes";
import './ui/SiteButton.css';

export default function SiteButton({buttonType, text, action, children} : {
  buttonType?:ButtonTypes, 
  text?:string,
  action?: () => void,
  children?: ReactNode}) {

    const extraClass = 
      buttonType == ButtonTypes.White ? 'button-white'
    : "button-red";

    return <div role="button" className={"site-button " + extraClass} onClick={action}>   
      <div className={"site-button-inner " + extraClass + "-inner"}>
        {text}
        {children}
      </div>
    </div>;
}