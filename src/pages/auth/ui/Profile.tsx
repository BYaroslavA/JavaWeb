import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../features/app_context/AppContext";
import SiteButton from "../../../features/buttons/SiteButton";
import ButtonTypes from "../../../features/buttons/types/ButtonTypes";
import type CartType from "../../../entities/cart/model/CartType";
import CartDao from "../../../entities/cart/api/CartDao";
import { Link } from "react-router-dom";
import BaseDao from "../../../entities/config/BaseDao";

export default function Profile() {
    const { user, setUser, showToast } = useContext(AppContext);
    const [history, setHistory] = useState<Array<CartType>>([]);

    useEffect(() => {
        if (!user) {
            setHistory([]);
        }
        else {
            CartDao.loadHistory().then(setHistory);
        }
    }, [user]);

    const exitAuth = () => {
        window.localStorage.removeItem("user-231");
        setUser(null);
    };

    const testAuth = (mode: "valid" | "none" | "malformed" | "invalid") => {
        let token: string | null = "";

        switch (mode) {
            case "valid":
                token = user?.token ?? null;
                break;
            case "none":
                token = null;
                break;
            case "malformed":
                token = user?.token?.substring(0, 10) ?? "broken";
                break;
            case "invalid":
                token = (user?.token ?? "") + "modified";
                break;
        }

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        BaseDao.request("api://product/123", {
            headers: headers
        })
            .then(async r => {
                if (r.ok) {
                    const data = await r.json();
                    showToast({ message: "Успіх: дані отримано!" });
                    console.log(data);
                } else {
                    let errorMsg = `Помилка: ${r.status} ${r.statusText}`;
                    try {
                        const errorData = await r.json();
                        if (errorData.message) errorMsg += ` - ${errorData.message}`;
                    } catch {
                    }
                    showToast({ message: errorMsg, timeout: 5000 });
                }
            })
            .catch(err => {
                showToast({ message: "Помилка мережі: " + err.message });
            });
    };

    return <>
        <h1 className="display-4 text-center">Кабінет користувача</h1>
        <div className="row">
            <div className="col col-6 offset-1 border text-center p-3">
                <div className="row">
                    <div className="col col-4 offset-4">
                        <img src={user?.imageUrl} alt={user?.login} className="w-100 rounded-circle" />
                    </div>
                </div>
                <h2 className="display-5">{user?.name}</h2>
                <div className="row text-start mt-3">
                    <div className="col col-3 offset-2">Ім'я</div>
                    <div className="col col-5">{user?.name}</div>
                    <div className="col col-1"><i className="bi bi-pencil"></i></div>
                </div>
                <div className="row text-start mt-3">
                    <div className="col col-3 offset-2">E-mail</div>
                    <div className="col col-5">{user?.email}</div>
                    <div className="col col-1"><i className="bi bi-pencil"></i></div>
                </div>
                <div className="row text-start mt-3">
                    <div className="col col-3 offset-2">Адреса</div>
                    <div className="col col-5">{user?.address}</div>
                    <div className="col col-1"><i className="bi bi-pencil"></i></div>
                </div>

                <div className="row mt-5">
                    <div className="col col-10 offset-1 mt-4">
                        <div className="row g-2">
                            <div className="col col-6">
                                <SiteButton
                                    text="Валідний токен"
                                    buttonType={ButtonTypes.White}
                                    action={() => testAuth("valid")} />
                            </div>
                            <div className="col col-6">
                                <SiteButton
                                    text="Без токена"
                                    buttonType={ButtonTypes.White}
                                    action={() => testAuth("none")} />
                            </div>
                            <div className="col col-6">
                                <SiteButton
                                    text="Обрізаний токен"
                                    buttonType={ButtonTypes.White}
                                    action={() => testAuth("malformed")} />
                            </div>
                            <div className="col col-6">
                                <SiteButton
                                    text="Невірний токен"
                                    buttonType={ButtonTypes.White}
                                    action={() => testAuth("invalid")} />
                            </div>
                        </div>
                    </div>

                    <div className="col col-4 offset-4 mt-4">
                        <div className="row">
                            <SiteButton
                                text="Вихід"
                                buttonType={ButtonTypes.Red}
                                action={exitAuth} />
                        </div>
                    </div>
                </div>

            </div>

            <div className="col col-4 offset-1 border" style={{ minHeight: 500 }}>
                <h2 className="display-5">Історія замовлень</h2>
                {history.map((cart, i) => {
                    const cnt = cart.cartItems.reduce((n, item) => n + item.quantity, 0);
                    return <Link to={"/cart/" + cart.id} key={cart.id ?? i}>
                        {cart.createDt && new Date(cart.createDt).pretty()}<br />
                        Загальна сума: {cart.price}, {cnt} {"Товар".ending(cnt, "ів", "", "и")}
                        {cart.cartItems.map(ci => <p>
                            {ci.product.title}
                        </p>)}
                    </Link>
                })}
            </div>
        </div>
    </>;
}
