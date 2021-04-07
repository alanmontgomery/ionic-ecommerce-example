import { Store } from "pullstate";

export const FavouritesStore = new Store({
    
    total: 0,
    product_ids: []
});

export const addToFavourites = (categorySlug, productID) => {
    FavouritesStore.update(s => {
        if (s.product_ids.find(id => id === `${ categorySlug }/${ parseInt(productID) }`)) {
            s.product_ids = s.product_ids.filter(id => id !== `${ categorySlug }/${ parseInt(productID) }`);
        } else {
            s.product_ids = [ ...s.product_ids, `${ categorySlug }/${ parseInt(productID) }` ];
        }
    });
}