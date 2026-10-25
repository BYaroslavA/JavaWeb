import { Link, Outlet, useNavigate } from "react-router-dom";
import "./ui/Layout.css";
import Label from "../label/Label";
import LabelTypes from "../label/types/LabelTypes";
import { useContext } from "react";
import type { FormEventHandler } from "react";
import { AppContext } from "../app_context/AppContext";

export default function Layout() {
    const { user, cart } = useContext(AppContext);
    const profileTitle = user == null ? "Вхід" : "Профіль";
    const navigate = useNavigate();

    const onSearch: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = (new FormData(e.target as HTMLFormElement).get("search"))?.toString();
        const slug = encodeURIComponent(data ?? "");
        navigate(`/search/${slug}`);
    };

    return <>
    <header>
        <nav className="navbar navbar-expand-lg border-bottom">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    Комерція
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <div className="nav-item">
                    <Label title="Каталог" type={LabelTypes.Black} />
                </div>

                <form className="d-flex flex-grow-1" role="search" onSubmit={onSearch}>
                    <input name="search" className="form-control me-2 nav-search" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>

                <ul className="navbar-nav mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link to="/trade-in" className="nav-link" title="Trade-In" aria-label="Trade-In">
                            <Label title="Trade-In" />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/privacy" className="nav-link" title="Правка" aria-label="Правка">
                            <Label title="Правка" type={LabelTypes.Violet} />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/back" className="nav-link" title="HTTP /back" aria-label="HTTP /back">
                            <Label title="/back" type={LabelTypes.Teal} />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/auth" className="nav-link" title={profileTitle} aria-label={profileTitle}>
                            <Label title={profileTitle} type={LabelTypes.Blue} />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/cart" className="nav-link" title={["Кошик", ...(cart.cartItems ?? []).map(item => item.product.title + ": " + item.quantity) ].join('\n')} aria-label="Кошик">
                            <Label title={"Кошик " + (cart.cartItems ?? []).reduce((n, item) => n + item.quantity, 0)} type={LabelTypes.White} />
                        </Link>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    </header>
    <main className="container mt-4"><Outlet /></main>
    <footer className="border-top p-3">
        &copy; IT Step University &copy; KN-P-231, 2025. &emsp;
        Всі права захищені. &emsp;
        <Link to="/privacy">Політика конфіденційності</Link>
    </footer>
    </>;
}
