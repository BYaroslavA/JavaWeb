import { useEffect, useState } from 'react';
import { AppContext } from '../../features/app_context/AppContext';
import type { UserType } from '../../entities/user/model/UserType';
import type ToastData from '../../features/app_context/ToastData';
import type CartType from '../../entities/cart/model/CartType';
import CartDao from '../../entities/cart/api/CartDao';
import './App.css';
import type ModalData from '../../features/modal/ModalData';
import Modal from './Modal/Modal';
import AppRouter from '../router/AppRouter';
import GlobalState from '../../features/global_state/GlobalState';
import '../../shared/extensions/NumberExtensions';
import '../../shared/extensions/StringExtensions';
import '../../shared/extensions/DateExtensions';

export default function App() {
  const [user, setUser] = useState<UserType|null>(null);
  useEffect(() => {
    // GlobalState.token = user?.token ?? null;
    // console.log("app: GlobalState.token = ", GlobalState.token)
  }, [user]);

  const [cart, setCart] = useState<CartType>(CartDao.restoreSaved());
  useEffect(() => {
    CartDao.save(cart);
  }, [cart]);
  
  const [toastData, setToastData] = useState<ToastData|null>(null);
  const [toastQueue, setToastQueue] = useState<Array<ToastData>>([]);

  const dequeueToast = () => {
      setToastQueue(q => q.slice(0, q.length - 1));
  };

  const showToast = (data: ToastData) => {
      setToastQueue(q => [data, ...q]);
  };

  useEffect(() => {
      // console.log(toastQueue);
      if(toastQueue.length == 0) {
          setToastData(null);
      }
      else {
          // якщо останнє повідомлення не те, що показується, то перемикаємо на нього
          let lastToastData = toastQueue[toastQueue.length - 1];
          if(toastData != lastToastData) {
              setToastData(lastToastData);
              setTimeout(dequeueToast, lastToastData.timeout ?? 2000);
          }
      }
  }, [toastQueue]);

  useEffect(() => {  // useEffect з порожнім масивом "спостереження"
    // виконується одноразово коли елемент вбудовується у DOM
    console.log("App started");

    const handleAuthError = () => {
      window.localStorage.removeItem("user-231");
      setUser(null);
      GlobalState.token = null;
      showToast({ message: "Сесію завершено через помилку авторизації", timeout: 5000 });
    };
    window.addEventListener("auth-error", handleAuthError);

    // на старті перевіряємо наявність у постійному сховищі збережених даних
    const savedUser = window.localStorage.getItem("user-231");
    if(savedUser) {
      // відновлюємо авторизацію
      try {
        let u:UserType|null = JSON.parse(savedUser);
        if(u) {
          GlobalState.token = u.token;
        }
        setUser(u);
      }
      catch(err) {
        console.error("User restore error: ", err);
        GlobalState.token = null;
      }
      
    }

    // повернена дія буде виконана при руйнуванні елемента (вилучення з DOM)
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
      console.log("App finished");
    };
  }, []);



  
  const [modalData, setModalData] = useState<ModalData|null>(null);
  const showModal = (data:ModalData) => {
    setModalData(data);
  }
  const [isBusy, setBusy] = useState<boolean>(false);

  return <AppContext.Provider value={{ isBusy, setBusy, showModal, user, setUser, showToast, cart, setCart}}>
    <AppRouter />

    <div className="toaster">
        {/* <div className="toast-text" style={{display: toastData ? "block" : "none"}}>
            {toastData?.message}
        </div> */}
            {toastQueue.map((td, i) => <div key={i + td.message} className="toast-text">
                {td.message}
            </div>)}
    </div>

    <Modal modalData={modalData} setModalData={setModalData} />
    {isBusy && 
    <div className='preloader'>
      <div className='preloader-content'>
        
      </div>
    </div>}

  </AppContext.Provider>;
}

