import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { cart, chevronBackOutline, searchOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router"
import ProductCard from "../components/ProductCard";

import { CartStore } from "../data/CartStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./CategoryProducts.module.css";

const CategoryProducts = () => {

    const params = useParams();
    const cartRef = useRef();
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ category, setCategory ] = useState({});
    const [ searchResults, setsearchResults ] = useState([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);

    useEffect(() => {

        const categorySlug = params.slug;
        const tempCategory = products.filter(p => p.slug === categorySlug)[0];
        setCategory(tempCategory);
        setsearchResults(tempCategory.products);
    }, [ params.slug ]);

    const fetchMore = async (e) => {

		//	Increment the amount loaded by 6 for the next iteration
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    const search = async e => {

        const searchVal = e.target.value;

        if (searchVal !== "") {
         
            const tempResults = category.products.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase()));
            setsearchResults(tempResults);
        } else {

            setsearchResults(category.products);
        }
    }

    return (

        <IonPage id="category-page" className={ styles.categoryPage }>
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" text={ category.name } routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Categories
                        </IonButton>
                    </IonButtons>
					<IonTitle>{ category && category.name }</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>

                <IonSearchbar className={ styles.search } onKeyUp={ search } placeholder="Try 'high back'" searchIcon={ searchOutline } animated={ true } />

                <IonGrid>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ searchResults && searchResults.length } { (searchResults.length > 1 || searchResults.length === 0) ? " products" : " product" } found</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {

                            if ((index <= amountLoaded) && product.image) {
                                return (
                                    <ProductCard key={ `category_product_${ index }`} product={ product } index={ index } cartRef={ cartRef } category={ category } />
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

export default CategoryProducts;