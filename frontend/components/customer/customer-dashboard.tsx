'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyStores, dummyOrders } from '@/lib/dummy-data';
import CustomerSidebar from '@/components/customer/customer-sidebar';
import { StoreFavorites } from './favorites-page';
import axios from 'axios';
import { OrderTypes } from '../store-owner/order-management';
import { StoreDetailsType } from '../admin/admin-dashboard';
import { formatDate } from '@/lib/formatDate';

export default function CustomerDashboard() {
  const [recentOrders, setRecentOrders] = useState(dummyOrders.slice(0, 3));
  const [nearbyStores, setNearbyStores] = useState(dummyStores);
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [storeOwnersFromDB, setStoreOwners] = useState<StoreDetailsType[]>([]);

  interface CustomerDetails {
    fullname?: string;
    [key: string]: any;
  }

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({});

  useEffect(() => {
    const storedData = localStorage.getItem('customer_details');
    if (storedData) {
      setCustomerDetails(JSON.parse(storedData));
    }
  }, []);
  const [favorites, setFavorites] = useState<StoreFavorites[]>([]);
  const [user_id, setUser_id] = useState('');

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
    Promise.all([fetchStoreOwners()]);
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/favorites');

      console.log('Fetched favorites:', response.data);
      console.log('User ID:', user_id);

      // Filter favorites based on the user_id
      const userFavorites = response.data.filter(
        (store: StoreFavorites) => String(store.user_id) === String(user_id),
      );

      console.log('Filtered User Favorites:', userFavorites);

      // Set favorites to the filtered list of favorite stores
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/orders');
      const filteredOrders = response.data.filter(
        (order: any) => String(order.user_id) === String(user_id),
      );
      setOrders(filteredOrders);
      console.log('Fetched orders:', response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      setUser_id(storedId);
    }
  }, []);

  useEffect(() => {
    if (user_id) {
      fetchFavorites();
      fetchOrders();
    }
  }, [user_id]);

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              Welcome, {customerDetails.fullname || 'Guest'}
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>Your lifetime orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Favorite Stores</CardTitle>
                <CardDescription>Stores you love</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{favorites.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Promotions</CardTitle>
                <CardDescription>Current deals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Nearby Stores</h2>
                <Button variant="ghost" asChild>
                  <Link href="/customer/stores">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {storeOwnersFromDB
                  .map((store) => (
                    <Card key={store.storeOwner_id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle>{store.storeName}</CardTitle>
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
                            <span className="text-sm ml-1">
                              ({store.review_count})
                            </span>
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{store.openingHours}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {store.promotions.map((promo, index) => (
                            <Badge key={index} variant="secondary">
                              {promo.discount}% off - {promo.title}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/customer/store/${store.storeOwner_id}`}>
                            View Store
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                  .slice(0, 5)}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <Button variant="ghost" asChild>
                  <Link href="/customer/orders">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {orders
                  .map((order) => (
                    <Card key={order.order_id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">
                            Order #{order.order_id}
                          </CardTitle>
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'success'
                                : order.status === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.quantity}x {item.product_name}
                              </span>
                              <span>
                                ₱{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">
                          ₱{Number(order.total_price).toFixed(2)}
                        </span>
                      </CardFooter>
                    </Card>
                  ))
                  .slice(0, 5)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
