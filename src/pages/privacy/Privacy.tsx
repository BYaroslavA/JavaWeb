import { useContext, useEffect, useRef } from "react";
import SiteButton from "../../features/buttons/SiteButton";
import ButtonTypes from "../../features/buttons/types/ButtonTypes";
import './ui/Privacy.css';
import { AppContext } from "../../features/app_context/AppContext";
import { ModalIcon } from "../../features/modal/ModalIcon";


export default function Privacy() {
    const {showToast, showModal, setBusy} = useContext(AppContext);
    const taskRef = useRef(0);

    useEffect(() => {
        return () => {   // Finalizer                // self.task = task
            console.log(`clear task: ${taskRef.current}`);      //  ...${task}.. -> ${self.task}
            if(taskRef.current) {                               //     
                clearTimeout(taskRef.current);
                setBusy(false);                         
            }                                   
        };
    }, []);

    return <>
    <h1 className="display-4"><i className="bi bi-shield-check"></i> Політика конфіденційності</h1>
    <SiteButton 
        buttonType={ButtonTypes.Red} 
        text="Loading..."
        action={() => {
            setBusy(true);
            taskRef.current = setTimeout(() => {setBusy(false); console.log("Task finished")}, 4000);
            console.log(`set task: ${taskRef.current}`);
        }} />
    <br/>
    <br/>
    <SiteButton 
        buttonType={ButtonTypes.Red} 
        text="Toast"
        action={() => showToast({message:"Hello " + Math.random()})} />
    &emsp;    
    <SiteButton 
        buttonType={ButtonTypes.White} 
        text="Long Toast"
        action={() => showToast({
            message:"Long " + Math.random(), 
            timeout: 4000})} />
    <br/>
    <br/>
    <SiteButton 
        action={() => showModal({
            title: "The Title", 
            message: "The message",
            onCancel: () => console.log("Cancelled"),
            icon: ModalIcon.danger,
        })} 
        buttonType={ButtonTypes.Red} 
        text="Red Button"/>
    &emsp;    
    <SiteButton 
        action={() => showModal({
            title: "The Title", 
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            buttons: [
                {title: "Cancel"},
            ],
            icon: ModalIcon.warning,
        })}
        buttonType={ButtonTypes.White} text="White Button"/>
    &emsp;    
    <SiteButton 
        action={() => showModal({
            title: "The Title", 
            message: "The message",
            buttons: [
                {title: "Ok", callback: () => console.log("Ok")},
                {title: "Cancel", type: ButtonTypes.White},
            ],
            isCancellable: true,
            onCancel: () => console.log("Cancelled"),
            icon: ModalIcon.information,
        })} 
        buttonType={ButtonTypes.Red} 
        text="Red Button"/>
            
    </>;
}
/*
Д.З. Впровадити у власний курсовий проєкт 
систему прелоадера
Прикладати скріншоти проєкту
*/