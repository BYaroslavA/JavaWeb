import type CartItem from "./CartItem";

export default interface CartType {
    cartItems: Array<CartItem>,
    price: number,
    id?: string,
    createDt?: string,
    deleteDt?: string|null,
    orderDt?: string|null,
}

/*
"id": "bf206a05-86ac-484b-a291-00ca673f1b4b",
"userId": "db9488b3-1fd0-445a-9022-fcbadd0753d8",
"discountId": null,
"createDt": "2026-04-06T10:40:37.704365",
"deleteDt": null,
"orderDt": "2026-04-06T11:18:43.5869",

*/