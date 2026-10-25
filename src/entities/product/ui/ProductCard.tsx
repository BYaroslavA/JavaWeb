import './ProductCard.css';
import type { ProductType } from "../model/ProductType";
import Label from '../../../features/label/Label';
import LabelTypes from '../../../features/label/types/LabelTypes';
import SiteButton from '../../../features/buttons/SiteButton';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../../features/app_context/AppContext';
import ButtonTypes from '../../../features/buttons/types/ButtonTypes';

export default function ProductCard({product}:{product: ProductType}) {
    const {cart, setCart, showToast} = useContext(AppContext);
    const navigate = useNavigate();

    const buyClick = () => {
        let newCart = {...cart, price: cart.price + product.price};
        let item = (cart.cartItems ?? []).find(i => i.product.id == product.id);
        if(item) {
            item.quantity += 1;
            item.price += product.price;
        }
        else {
            if(!newCart.cartItems) newCart.cartItems = [];
            newCart.cartItems.push({
                product: product, 
                price: product.price, 
                quantity: 1
            });
        }
        setCart(newCart);
        showToast({message: "Додано до кошику " + product.title});
    };

    

    return <div className="product-card">
        <Link to={"/product/" + (product.slug ?? product.id)}>
            {product.discount && product.discount > 0 &&
                <div className='product-card-discount'>
                    <Label type={LabelTypes.Violet} title={product.discount + " ₴"} />
                </div>}

            <div className='product-card-imgs'>
                <img src={product.imageUrl} alt={product.title} />
            </div>

            <div className='product-card-rating' title={`Середня оцінка: ${product.rating}`}>
                {Array.from({ length: Math.round(product.rating ?? 1) }, 
                    (_,i) => <span key={i}>★</span>)}
                {Array.from({ length: Math.round(5-(product.rating ?? 1)) }, 
                    (_,i) => <span key={Math.round(product.rating ?? 1) + i}>☆</span>)}
            </div>
            
            <p className='two-line-ellipsis'>{product.title}</p>
        </Link>
        <div className='product-card-footer'>
            {(cart.cartItems ?? []).find(ci => ci.product.id == product.id)
            ? <SiteButton action={() => navigate("/cart")}>
                <i className="bi bi-cart-check"></i>&thinsp;
                <span>У кошику</span>
              </SiteButton>
            :  (product.stock ?? 1 ) == 0
                ? <SiteButton buttonType={ButtonTypes.White}>
                    <span>Нема</span>
                  </SiteButton>
                : <SiteButton action={buyClick} >
                    <i className="bi bi-cart"></i>&thinsp;
                    <span>Купити</span>
                </SiteButton>
            }
            <span>{product.price} грн</span>
        </div>
    </div>;
}