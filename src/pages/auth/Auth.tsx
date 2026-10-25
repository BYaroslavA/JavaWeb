import { useContext, useEffect, useState } from "react";
import SiteButton from "../../features/buttons/SiteButton";
import ButtonTypes from "../../features/buttons/types/ButtonTypes";
import UserDao from "../../entities/user/api/UserDao";
import { AppContext } from "../../features/app_context/AppContext";
import Profile from "./ui/Profile";
import GlobalState from "../../features/global_state/GlobalState";

export default function Auth() {
    const { user } = useContext(AppContext);
    return user == null ? <AuthContainer /> : <Profile />;
}

function AuthContainer() {
    const [mode, setMode] = useState<"auth" | "register">("auth");

    return <>
        <div className="d-flex justify-content-center mt-3 mb-2">
            <button
                type="button"
                className={`btn btn-sm ${mode === "auth" ? "btn-danger" : "btn-outline-secondary"} me-2`}
                onClick={() => setMode("auth")}>
                Автентифікація
            </button>
            <button
                type="button"
                className={`btn btn-sm ${mode === "register" ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setMode("register")}>
                Реєстрація
            </button>
        </div>

        {mode === "auth" ? <AuthForm /> : <RegisterForm />}
    </>;
}

function AuthForm() {
    const { setUser, setBusy } = useContext(AppContext);

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isFormValid, setFormValid] = useState<boolean>(false);
    const [remember, setRemember] = useState(true);

    useEffect(() => {
        setFormValid(login.length > 2 && password.length > 2);
    }, [login, password]);

    const onAuthClick = () => {
        setBusy(true);
        UserDao
            .authenticate(login, password)
            .then(res => {
                if (res == null) {
                    GlobalState.token = null;
                    alert("У вході відмовлено");
                } else {
                    if (remember) {
                        window.localStorage.setItem("user-231", JSON.stringify(res));
                    }
                    GlobalState.token = res.token;
                    setUser(res);
                }
            })
            .finally(() => {
                setBusy(false);
            });
    };

    return <>
        <h1 className="display-4 text-center">Автентифікація</h1>
        <div className="row mt-4">
            <div className="col col-6 offset-3 text-center">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="login-addon"><i className="bi bi-key"></i></span>
                    <input type="text" className="form-control" placeholder="Логін"
                        value={login} onChange={e => setLogin(e.target.value)}
                        aria-label="Логін" aria-describedby="login-addon"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="password-addon"><i className="bi bi-unlock2"></i></span>
                    <input type="password" className="form-control" placeholder="Пароль"
                        value={password} onChange={e => setPassword(e.target.value)}
                        aria-label="Пароль" aria-describedby="password-addon"/>
                </div>

                <div>
                    <label>
                        <input type="checkbox" checked={remember} className="mb-3"
                            onChange={e => setRemember(e.target.checked)}/>&thinsp;
                        Запам'ятати
                    </label>
                </div>

                <SiteButton
                    text="Вхід"
                    action={onAuthClick}
                    buttonType={isFormValid ? ButtonTypes.Red : ButtonTypes.White}
                />
            </div>
        </div>
    </>;
}

function RegisterForm() {
    const { setUser, setBusy } = useContext(AppContext);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isFormValid, setFormValid] = useState<boolean>(false);
    const [remember, setRemember] = useState(true);

    useEffect(() => {
        setFormValid(
            name.trim().length >= 2 &&
            email.includes("@") &&
            email.includes(".") &&
            login.trim().length >= 3 &&
            password.length >= 6
        );
    }, [name, email, login, password]);

    const onRegister = () => {
        setBusy(true);
        const signupData = {
            name: name.trim(),
            email: email.trim(),
            login: login.trim(),
            password: password
        };

        UserDao.signUp(signupData)
            .then(r => {
                console.log("Signup success:", r);
                return UserDao.authenticate(signupData.login, signupData.password);
            })
            .then(res => {
                if (res != null) {
                    if (signupData.name) {
                        res.name = signupData.name;
                    }
                    if (signupData.email) {
                        res.email = signupData.email;
                    }
                    if (remember) {
                        window.localStorage.setItem("user-231", JSON.stringify(res));
                    }
                    GlobalState.token = res.token;
                    setUser(res);
                } else {
                    alert("Реєстрація успішна, але автоматичний вхід не вдався");
                }
            })
            .catch(err => {
                console.error("Signup error:", err);
                alert("Помилка реєстрації: " + (err.message || err));
            })
            .finally(() => {
                setBusy(false);
            });
    };

    return <>
        <h1 className="display-4 text-center">Реєстрація</h1>
        <div className="row mt-4">
            <div className="col col-6 offset-3 text-center">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="name-addon"><i className="bi bi-person"></i></span>
                    <input type="text" className="form-control" placeholder="Ім'я"
                        value={name} onChange={e => setName(e.target.value)}
                        aria-label="Ім'я" aria-describedby="name-addon"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="reg-email-addon"><i className="bi bi-at"></i></span>
                    <input type="email" className="form-control" placeholder="E-mail"
                        value={email} onChange={e => setEmail(e.target.value)}
                        aria-label="E-mail" aria-describedby="reg-email-addon"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="reg-login-addon"><i className="bi bi-key"></i></span>
                    <input type="text" className="form-control" placeholder="Логін"
                        value={login} onChange={e => setLogin(e.target.value)}
                        aria-label="Логін" aria-describedby="reg-login-addon"/>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="reg-password-addon"><i className="bi bi-unlock2"></i></span>
                    <input type="password" className="form-control" placeholder="Пароль"
                        value={password} onChange={e => setPassword(e.target.value)}
                        aria-label="Пароль" aria-describedby="reg-password-addon"/>
                </div>

                <div>
                    <label>
                        <input type="checkbox" checked={remember} className="mb-3"
                            onChange={e => setRemember(e.target.checked)}/>&thinsp;
                        Запам'ятати
                    </label>
                </div>

                <SiteButton
                    text="Реєстрація"
                    action={onRegister}
                    buttonType={isFormValid ? ButtonTypes.Red : ButtonTypes.White}
                />
            </div>
        </div>
    </>;
}
