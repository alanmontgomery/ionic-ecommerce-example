import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { cart, chevronBackOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import { CartStore } from "../data/CartStore";
import { FavouritesStore } from "../data/FavouritesStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./CategoryProducts.module.css";

const FavouriteProducts = () => {

    const cartRef = useRef();
    const products = ProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ searchResults, setSearchResults ] = useState([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);

    useEffect(() => {

        const getFavourites = () => {

            favourites.forEach(favourite => {

                var favouriteParts = favourite.split("/");
                var categorySlug = favouriteParts[0];
                var productID = favouriteParts[1];
                
                const tempCategory = products.filter(p => p.slug === categorySlug)[0];
                const tempProduct = tempCategory.products.filter(p => parseInt(p.id) === parseInt(productID))[0];

                const tempFavourite = {

                    category: tempCategory,
                    product: tempProduct
                };

                setSearchResults(prevSearchResults => [ ...prevSearchResults, tempFavourite ]);
            });
        }

        getFavourites();
    }, [ favourites ]);

    const fetchMore = async (e) => {

		//	Increment the amount loaded by 6 for the next iteration
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    return (

        <IonPage id="category-page" className={ styles.categoryPage }>
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Categories
                        </IonButton>
                    </IonButtons>
					<IonTitle>Favourites</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>
                <IonGrid>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ searchResults && searchResults.length } { (searchResults.length > 1 || searchResults.length === 0) ? " favourites" : " favourite" } found</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {

                            if ((index <= amountLoaded)) {
                                return (
                                    <ProductCard key={ `category_product_${ index }`} product={ product.product } index={ index } cartRef={ cartRef } category={ product.category } />
                                );
                            }
                        })}
                    </IonRow>
                </IonGrid>

                <IonInfiniteScroll threshold="100px" onIonInfinite={ fetchMore }>
					<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Fetching more...">
					</IonInfiniteScrollContent>
				</IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
}

export default FavouriteProducts;