import { useContext } from "react";
import type CartItem from "../../../entities/cart/model/CartItem";
import './CartItemCard.css';
import { AppContext } from "../../../features/app_context/AppContext";
import CartDao from "../../../entities/cart/api/CartDao";
import ButtonTypes from "../../../features/buttons/types/ButtonTypes";

export default function CartItemCard({ cartItem }: { cartItem: CartItem }) {
    const { cart, setCart, showModal } = useContext(AppContext);

    const incClick = () => {
        // задача: змінити кількість замовлення у {cartItem} та внести зміни
        // до загального кошику через виклик {setCart}
        if(cartItem.product.stock && cartItem.product.stock <= cartItem.quantity) {
            return;
        }
        let newCart = { ...cart };
        let item = newCart.cartItems.find(ci => ci.product.id == cartItem.product.id);
        if (item) {       
            item.quantity += 1;
            CartDao.calcPrices(newCart);
            // item.price = item.product.price * item.cnt;
            // newCart.price = newCart.items.reduce((s,ci) => s + ci.price, 0.0);
            setCart(newCart);
        }
    };
    const decClick = () => {
        // задача: реалізувати обмеження: кількість не можна зменшити до 0, а також
        // збільшити понад {stock} якщо його зазначено
        if(cartItem.quantity <= 1) {
            return;
        }
        let newCart = { ...cart };
        let item = newCart.cartItems.find(ci => ci.product.id == cartItem.product.id);
        if (item) { 
            item.quantity -= 1;
            CartDao.calcPrices(newCart);
            setCart(newCart);
        }
    };
    const removeClick = () => {
        showModal({
            title: "Незворотня дія",
            message: "Після видалення відновити позицію можна лише з прайсу. Підтверджуєте видалення?",
            buttons: [
                {title: "Так", callback: () => {
                    setCart({ ...cart,
                        cartItems: cart.cartItems.filter(ci => ci.product.id !== cartItem.product.id),
                        price: cart.price - cartItem.price
                    });
                }},
                {title: "Ні", type: ButtonTypes.White},
            ]
        });
    };

    return <div className="row m-3 p-2 cart-item-card">
        <div className="col col-2">
            <img
                src={cartItem.product.imageUrl}
                alt={cartItem.product.title}
                className="w-100" />
            <div className="text-center">
                <button className="btn btn-outline-secondary me-2" onClick={decClick}>-</button>
                {cartItem.quantity}
                <button className="btn btn-outline-secondary ms-2" onClick={incClick}>+</button>
            </div>
        </div>
        <div className="col col-6">
            <h3>{cartItem.product.title}</h3>
            <div>Гарантія 1 рік від {Math.round(cartItem.price * 0.1).toMoney()} грн</div>
            <div>Гарантія 2 роки від {Math.round(cartItem.price * 0.15).toMoney()} грн</div>
        </div>
        <div className="col col-3 text-center">
            <h4>{cartItem.price.toMoney()} грн</h4>
            {cartItem.product.discount &&
                <div className="text-decoration-line-through">
                    {(cartItem.price + (cartItem.product.discount ?? 0) * cartItem.quantity).toMoney()} грн
                </div>
            }
        </div>
        <div className="col col-1 text-end"><i className="bi bi-trash3" role="button" onClick={removeClick}></i></div>
    </div>;
}