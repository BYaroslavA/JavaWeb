import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../../features/layout/Layout";
import Home from "../../pages/home/Home";
import Auth from "../../pages/auth/Auth";
import Cart from "../../pages/cart/Cart";
import Privacy from "../../pages/privacy/Privacy";
import Product from "../../pages/product/Product";
import Section from "../../pages/section/Section";
import Search from "../../pages/search/Search";
import NotFound from "../../pages/not_found/NotFound";
import Back from "../../pages/back/Back";

export default function AppRouter() {
    return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='auth' element={<Auth />} />
        <Route path='cart' element={<Cart />} />
        <Route path='cart/:id' element={<Cart />} />
        <Route path='privacy' element={<Privacy />} />
        <Route path='product/:slug' element={<Product />} />
        <Route path='search/:slug' element={<Search />} />
        <Route path='section/:slug' element={<Section />} />
        <Route path='back' element={<Back />} />

        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>;
}
