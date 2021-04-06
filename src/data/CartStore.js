import { Store } from "pullstate";

export const CartStore = new Store({
    
    total: 0,
    product_ids: []
});

export const addToCart = (categorySlug, productID) => {

    CartStore.update(s => { s.product_ids = [ ...s.product_ids, `${ categorySlug }/${ parseInt(productID) }` ]; });
}

export const removeFromCart = productIndex => {

    CartStore.update(s => { s.product_ids.splice(productIndex, 1) });
}