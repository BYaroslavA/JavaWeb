import { useContext, useEffect, useState } from 'react';
import './ui/Cart.css';
import { AppContext } from '../../features/app_context/AppContext';
import CartItemCard from './ui/CartItemCard';
import SiteButton from '../../features/buttons/SiteButton';
import { useNavigate, useParams } from 'react-router-dom';
import CartDao from '../../entities/cart/api/CartDao';
import type CartType from '../../entities/cart/model/CartType';

export default function Cart() {
    const {cart, setCart, user, setUser, showModal} = useContext(AppContext);
    const navigate = useNavigate();
    const {id} = useParams();

    const buyClick = () => {
        if(!user) {
            showModal({
                title: "Кошик",
                message: "Для оформлення замовлення необхідно увійти в систему",
                buttons: [
                    {title: "Увійти", callback: () => navigate('/auth')},
                    {title: "До покупок"},
                ]
            });
        }
        else {
            CartDao.order(cart)
            .then(_ => {
                showModal({
                    title: "Кошик",
                    message: "Замовлення створене",
                });
                setCart({
                    price: 0.0,
                    cartItems: []
                });
            })
            .catch(err => {
                if(typeof err == 'number' && err == 401) {
                    setUser(null);
                    showModal({
                        title: "Кошик",
                        message: "Авторизована сесія добігла кінця",
                        buttons: [
                            {title: "Увійти", callback: () => navigate('/auth')},
                        ]
                    });
                }
                else {
                    showModal({
                        title: "Кошик",
                        message: "Виникла помилка, повторіть спробу пізніше",
                    });
                }
            });
        }
    };

    return id ? <CartId id={id} /> : <>
    <h1 className="display-4">
        <i className="bi bi-cart"></i>&thinsp; 
        Мій кошик &thinsp; 
        {cart.cartItems.length} позицій &thinsp; 
        {cart.cartItems.reduce((s,ci) => s + ci.quantity, 0)} товарів &thinsp; 
        на суму {cart.cartItems.reduce((s,ci) => s + ci.price, 0)} грн
    </h1>
    {cart.cartItems.map(cartItem => <CartItemCard key={cartItem.product.id} cartItem={cartItem} />)}

    {cart.cartItems.length > 0 && <SiteButton text='Придбати' action={buyClick} />}
    </>;
}

function CartId({id}:{id:string}) {
    const {user} = useContext(AppContext);
    const [order, setOrder] = useState<CartType|null>(null);

    useEffect(() => {
        CartDao.loadOrderDetails(id).then(setOrder);
    }, [id, user]);

    return <>
    {!order ? <i>Loading...</i> : <div>
        <h1 className="display-4">
            <i className="bi bi-cart"></i>&thinsp; 
            Замовлення від {new Date(order.orderDt ?? order.deleteDt ?? order.createDt!).pretty()} &thinsp; 
            {order.cartItems.length} позицій &thinsp; 
            {order.cartItems.reduce((s,ci) => s + ci.quantity, 0)} товарів &thinsp; 
            на суму {order.cartItems.reduce((s,ci) => s + ci.price, 0)} грн
        </h1>
        {order.cartItems.map(cartItem => <CartItemCard key={cartItem.product.id} cartItem={cartItem} />)}

    </div>}
    </>;
}