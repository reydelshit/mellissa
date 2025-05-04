'use client';

import CustomerSidebar from '@/components/customer/customer-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import axios from 'axios';
import { Clock, Heart, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Promotion, StoreDetailsType } from '../admin/admin-dashboard';

interface ReviewType {
  productName: string;
  storeName: string;
  customerName: string;
  reviewText: string;
  rating: number;
  createdAt: string;
}

export default function StoreDetails({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<StoreDetailsType | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<{ product_id: string; quantity: number }[]>(
    () => {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    },
  );
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [storeOwnersFromDB, setStoreOwners] = useState<StoreDetailsType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const fetchStoreReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/review');
      console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/store-owner');
      console.log(response.data);
      setStoreOwners(response.data);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!storeId || storeOwnersFromDB.length === 0) return;

    const foundStore = storeOwnersFromDB.find(
      (s) => String(s.storeOwner_id) === storeId,
    );

    if (foundStore) {
      setStore(foundStore);
    }

    setLoading(false);
  }, [storeId, storeOwnersFromDB]);

  useEffect(() => {
    fetchStoreOwners();
    fetchStoreReviews();
  }, []);

  const toggleFavorite = (storeId: string) => {
    if (favorites.includes(storeId)) {
      setFavorites(favorites.filter((id) => id !== storeId));
      toast('Removed from favorites', {
        description: 'This store has been removed from your favorites.',
      });
    } else {
      setFavorites([...favorites, storeId]);
      toast('Added to favorites', {
        description: 'This store has been added to your favorites.',
      });
    }
  };

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem.product_id === item.product_id,
      );

      if (existingItem) {
        // If the item exists, update its quantity
        return prevCart.map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      } else {
        // If the item doesn't exist, add it with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    toast('Added to cart successful', {
      description: 'This item has been added to your cart.',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <CustomerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex h-screen">
        <CustomerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Store Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The store you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/customer/stores">Browse Stores</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{store.storeName}</h1>
              <p className="text-muted-foreground">{store.location}</p>
            </div>
            <Button
              variant={
                favorites.includes(String(store.storeOwner_id))
                  ? 'default'
                  : 'outline'
              }
              size="icon"
              onClick={() => toggleFavorite(String(store.storeOwner_id))}
            >
              <Heart
                className={`h-5 w-5 ${
                  favorites.includes(String(store.storeOwner_id))
                    ? 'fill-white'
                    : ''
                }`}
              />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={`http://localhost:8800/api/${store.media[selectedImage]?.path}`}
                    alt={store.media[selectedImage]?.pathName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {store.media.map((image, index) => (
                    <button
                      key={image.media_id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={`http://localhost:8800/api/${image.path}`}
                        alt={image.pathName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{store.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Number(store.avg_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    <span className="text-sm ml-1">({store.review_count})</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm">{store.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Current Promotions</h3>
                    <div className="flex flex-wrap gap-2">
                      {store.promotions.map(
                        (promo: Promotion, index: number) => (
                          <Badge key={index} variant="secondary">
                            {promo.discount} off {promo.title}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="menu">
            <TabsList>
              <TabsTrigger value="menu">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="info">Additional Info</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="pt-4">
              <div className="min-h-screen bg-gradient-to-b  py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Our Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Discover our curated collection of premium products
                      designed to enhance your lifestyle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {store.products.map((item) => {
                      const cartItem = cart.find(
                        (i: { product_id: string; quantity: number }) =>
                          i.product_id === String(item.product_id),
                      );

                      return (
                        <div
                          key={item.product_id}
                          className="group relative transition-all duration-300 hover:-translate-y-1"
                        >
                          <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="h-48 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 flex items-center justify-center">
                              <img
                                src={`http://localhost:8800/api/${item.product_image}`}
                                alt={`Image ${item.product_id}`}
                                className="object-cover w-full h-full"
                              />
                            </div>

                            <CardHeader className="pb-2 pt-4">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                                  {item.product_name}
                                </CardTitle>
                                <CardDescription className="text-lg font-medium text-primary">
                                  ${item.price.toFixed(2)}
                                </CardDescription>
                              </div>
                            </CardHeader>

                            <CardContent className="pb-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {item.description}
                              </p>
                            </CardContent>

                            <CardFooter className="pt-2 pb-4">
                              <Button
                                variant="default"
                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-2 transition-all duration-200 shadow-sm hover:shadow group-hover:scale-[1.02]"
                                onClick={() => addToCart(item)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </CardFooter>
                          </Card>

                          {item.created_at && (
                            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                              NEW
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <main className="min-h-screen px-4 py-12">
                <div className="mx-auto max-w-7xl">
                  <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Customer Reviews
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Read what our customers have to say about our products and
                      services.
                    </p>
                  </div>

                  {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-64 animate-pulse rounded-xl bg-gray-200"
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {reviews.map((review, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                          style={{
                            animation: 'fadeInUp 0.5s ease-out forwards',
                            opacity: 0,
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {review.customerName}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {review.createdAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                                  />
                                ))}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="font-medium text-gray-900">
                              {review.productName}
                            </h3>
                            <p className="mt-2 text-gray-600 leading-relaxed">
                              {review.reviewText}
                            </p>
                          </div>

                          <div className="absolute -right-12 -top-12 h-24 w-24 rotate-12 bg-gradient-to-br from-gray-100 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </main>
            </TabsContent>

            <TabsContent value="info" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p className="text-sm">Phone: {store.phone}</p>
                      <p className="text-sm">
                        Email:
                        {store.email.toLowerCase().replace(/\s/g, '')}.com
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Delivery Information</h3>
                      <p className="text-sm">
                        Delivery available within 5 miles radius
                      </p>
                      <p className="text-sm">
                        Estimated delivery time: 30-45 minutes
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Payment Methods</h3>
                      <p className="text-sm">
                        Credit/Debit Cards, Cash on Delivery, Mobile Payments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
