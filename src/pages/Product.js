import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { arrowRedoOutline, cart, cartOutline, chevronBackOutline, heart, heartOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router"
import ProductCard from "../components/ProductCard";
import { addToCart, CartStore } from "../data/CartStore";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./Product.module.css";

const Product = () => {

    const params = useParams();
    const cartRef = useRef();
    const products = ProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const [ isFavourite, setIsFavourite ] = useState(false);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ product, setProduct ] = useState({});
    const [ category, setCategory ] = useState({});

    useEffect(() => {

        const categorySlug = params.slug;
        const productID = params.id;
        const tempCategory = products.filter(p => p.slug === categorySlug)[0];
        const tempProduct = tempCategory.products.filter(p => parseInt(p.id) === parseInt(productID))[0];

        const tempIsFavourite = favourites.find(f => f === `${ categorySlug }/${ productID }`);

        setIsFavourite(tempIsFavourite);
        setCategory(tempCategory);
        setProduct(tempProduct);
    }, [ params.slug, params.id ]);

    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f === `${ category.slug }/${ product.id }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [favourites, product]);

    const addProductToFavourites = (e, categorySlug, productID) => {

        e.preventDefault();
        addToFavourites(categorySlug, productID);


        document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).style.display = "";
        document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutTopRight");
    }

    const addProductToCart = (e, categorySlug, productID) => {

        e.preventDefault();

        document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).style.display = "";
        document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutUp");

        setTimeout(() => {

            cartRef.current.classList.add("animate__tada");
            addToCart(categorySlug, productID);

            setTimeout(() => {
                cartRef.current.classList.remove("animate__tada");
            }, 500);
        }, 500);
    }

    return (

        <IonPage id="category-page" className={ styles.categoryPage }>
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" text={ category.name } routerLink={ `/category/${ category.slug }` } routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;{ category.name }
                        </IonButton>
                    </IonButtons>

                    <IonTitle>View Product</IonTitle>

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

                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <IonCard className={ styles.categoryCard }>
                                <IonCardHeader className={ styles.productCardHeader }>
                                    <div className={ styles.productCardActions }>
                                        <IonIcon className={ styles.productCardAction }  color={ isFavourite ? "danger" : "medium" } icon={ isFavourite ? heart : heartOutline } onClick={ e => addProductToFavourites(e, category.slug, product.id) } />
                                        <IonIcon style={{ position: "absolute", display: "none" }} id={ `placeholder_favourite_product_${ category.slug }_${ product.id }` } className={ `${ styles.productCardAction } animate__animated` } color="danger" icon={ heart } />
                                        <IonIcon className={ styles.productCardAction } size="medium" icon={ arrowRedoOutline } />
                                    </div>
                                    <img src={ product.image } alt="product pic" />
                                    <p className="ion-text-wrap">{ product.name }</p>
                                </IonCardHeader>

                                <IonCardContent className={ styles.categoryCardContent }>
                                    
                                    <div className={ styles.productPrice }>
                                        <IonButton color="light" size="large">
                                            { product.price }
                                        </IonButton>
                                        <IonButton size="large" color="dark" onClick={ e => addProductToCart(e, category.slug, product.id) }>
                                            <IonIcon icon={ cartOutline } />&nbsp;&nbsp;Add to Cart
                                        </IonButton>

                                        <IonIcon icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} id={ `placeholder_cart_${ category.slug }_${ product.id }` } className="animate__animated" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        </IonRow>

                        <IonRow className="ion-text-center">
                            <IonCol size="12">
                                <IonCardSubtitle>Similar products...</IonCardSubtitle>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            { (category && category.products) && category.products.map((similar, index) => {

                                if ((similar.id !== product.id) && product.image && index < 4) {

                                    return (

                                        <ProductCard key={ `similar_product_${ index }`} product={ similar } index={ index } isFavourite={ false } cartRef={ cartRef } category={ category } />
                                    );
                                }
                            })}
                        </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Product;