import type ModalData from "../../../features/modal/ModalData";
import SiteButton from "../../../features/buttons/SiteButton";
import "./Modal.css";
import { ModalIcon } from "../../../features/modal/ModalIcon";


export default function Modal({modalData, setModalData}:{modalData:ModalData|null, setModalData: React.Dispatch<React.SetStateAction<ModalData | null>>}) {

  const onCancel = () => {
    if(modalData?.isCancellable) {
      if(modalData?.onCancel) {
        modalData.onCancel();
      }
      setModalData(null);
    }
  };

  return modalData == null
  ? <></>
  : <div className='app-modal' onClick={onCancel}>
      <div className='app-modal-dlg' onClick={e => e.stopPropagation()}>
        <h2 className='app-modal-title'>
            {modalData.icon && (
                modalData.icon == ModalIcon.information ? <i className="bi bi-info-circle"></i>
                : modalData.icon == ModalIcon.warning ? <i className="bi bi-exclamation-triangle"></i>
                : <i className="bi bi-sign-stop"></i>
            )}
            {modalData.icon && <>&thinsp;</>}
            {modalData.title}
        </h2>
        <p className='app-modal-message'>{modalData.message}</p>
        <div className='app-modal-footer'>
          {modalData.buttons && modalData.buttons.length > 0
          ? modalData.buttons.map(b => <SiteButton key={b.title}
              buttonType={b.type} 
              text={b.title} 
              action={() => {
                if(b.callback) {
                  b.callback();
                }
                setModalData(null);
              }} />)
        : <SiteButton 
            text='Close' 
            action={() => {
              if(modalData?.onCancel) {
                modalData.onCancel();
              }
              setModalData(null);
            }}/>
        }
          
        </div>          
      </div>
    </div>
}