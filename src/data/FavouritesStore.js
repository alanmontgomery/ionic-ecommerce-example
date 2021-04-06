import { Store } from "pullstate";

export const FavouritesStore = new Store({
    
    total: 0,
    product_ids: []
});

export const addToFavourites = (categorySlug, productID) => {

    FavouritesStore.update(s => { s.product_ids = [ ...s.product_ids, `${ categorySlug }/${ parseInt(productID) }` ]; } );
}