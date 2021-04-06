import { useState } from 'react';
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';

import styles from "./Home.module.css";
import { cart, heart } from 'ionicons/icons';

import { ProductStore } from '../data/ProductStore';
import { FavouritesStore } from '../data/FavouritesStore';
import { CartStore } from '../data/CartStore';

const Home = () => {

  	const products = ProductStore.useState(s => s.products);
  	const favourites = FavouritesStore.useState(s => s.product_ids);
	const shopCart = CartStore.useState(s => s.product_ids);

	return (
		<IonPage id="home-page" className={ styles.homePage }>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Categories</IonTitle>

					<IonButtons slot="start" className="ion-padding-start">
						<IonCardSubtitle className={ styles.logo }>Ionic Furniture</IonCardSubtitle>
					</IonButtons>

					<IonButtons slot="end">
						<IonBadge color="danger">
                            { favourites.length }
                        </IonBadge>
						<IonButton color="danger" routerLink="/favourites">
							<IonIcon icon={ heart } />
						</IonButton>

						<IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
					<IonTitle size="large">
						Categories
					</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonGrid>
					<IonRow>
						{ products.map((category, index) => {

							return (
								<IonCol size="6" key={ `category_list_${ index }`}>
									<IonCard routerLink={ `/category/${ category.slug }`} className={ styles.categoryCard }>
										
										<img src={ category.cover } alt="category cover" />

										<IonCardContent className={ styles.categoryCardContent }>
											<IonCardSubtitle>{ category.name }</IonCardSubtitle>
										</IonCardContent>
									</IonCard>
								</IonCol>
							)
						})}
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Home;