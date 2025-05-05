'use client';
import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
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
import { dummyMenuItems, dummyOrders, dummyStores } from '@/lib/dummy-data';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  DollarSign,
  Percent,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { OrderTypes } from './order-management';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { Check, Clock, Eye, X } from 'lucide-react';
import { useEffect } from 'react';
import { Product, StoreDetailsType } from '../admin/admin-dashboard';

// For demo purposes, we'll assume the store owner owns the first store
const OWNER_STORE = dummyStores[0];

// Filter orders for this store owner
const OWNER_ORDERS = dummyOrders.filter((order) =>
  order.items.some((item) =>
    item.name.includes(OWNER_STORE.name.split(' ')[0]),
  ),
);

export default function StoreOwnerDashboard() {
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter] = useState('all');
  const [storeOwnersFromDB, setStoreOwners] = useState<StoreDetailsType[]>([]);

  // const [store_owner_id, setStore_Owner_id] = useState('');

  const store_owner_id = localStorage.getItem('store_owner_id');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/orders');
      const filteredOrders = response.data.filter(
        (order: any) => String(order.store_id) === store_owner_id,
      );
      setOrders(filteredOrders);
      console.log('Fetched orders:', response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/products');
      console.log(response.data);
      const filteredProducts = response.data.filter(
        (product: any) => String(product.storeOwner_id) === store_owner_id,
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
    Promise.all([fetchProducts(), fetchOrders(), fetchStoreOwners()]);
  }, []);

  // useEffect(() => {
  //   const storedId = localStorage.getItem('store_owner_id');
  //   if (storedId) {
  //     setStore_Owner_id(storedId);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (store_owner_id) {
  //     fetchOrders();
  //   }
  // }, [store_owner_id]);

  const totalRevenue = OWNER_ORDERS.reduce(
    (sum, order) => sum + order.total,
    0,
  );
  const pendingOrders = OWNER_ORDERS.filter(
    (order) => order.status === 'pending',
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.fullname
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      // Optimistically update UI
      setOrders(
        orders.map((order) =>
          order.order_id === orderId ? { ...order, status } : order,
        ),
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      // Send update to backend
      await axios.put(`http://localhost:8800/api/orders/status/${orderId}`, {
        status,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Optional: Revert UI update or show a toast if needed
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 mr-1" />;
      case 'pending':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <X className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Store Dashboard</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    ₱
                    {orders.reduce(
                      (sum, order) => sum + parseFloat(order.total_price),
                      0,
                    )}
                  </div>
                  <div className="flex items-center text-green-500 text-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <div className="flex items-center text-green-500 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="flex items-center text-green-500 text-sm">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Store Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {
                      storeOwnersFromDB.find(
                        (store) =>
                          String(store.storeOwner_id) ===
                          String(store_owner_id),
                      )?.avg_rating
                    }
                    /5
                  </div>
                  <div className="flex items-center text-green-500 text-sm">
                    <Star className="h-4 w-4 mr-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col">
            <section className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
              </div>

              <div className="flex  w-full justify-between gap-4">
                <Card className="w-full h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Manage Products
                    </CardTitle>
                    <CardDescription>
                      Add, edit or remove products from your store
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/store-owner/products">
                        Manage Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="w-full h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="h-5 w-5" />
                      Promotions
                    </CardTitle>
                    <CardDescription>
                      Create special offers and discounts
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/store-owner/promotions">
                        Manage Promotions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Store Profile
                    </CardTitle>
                    <CardDescription>
                      Update your store information and settings
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/store-owner/store">
                        Edit Store Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>

            <section className="lg:col-span-2 mt-[2rem]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <Button variant="ghost" asChild>
                  <Link href="/store-owner/orders">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length > 0 ? (
                            filteredOrders
                              .map((order) => (
                                <TableRow key={order.order_id}>
                                  <TableCell className="font-medium">
                                    {order.order_id}
                                  </TableCell>
                                  <TableCell>{order.fullname}</TableCell>
                                  <TableCell>
                                    {order.items.length} items
                                  </TableCell>
                                  <TableCell>
                                    ₱{Number(order.total_price).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(order.created_at)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={getStatusVariant(order.status)}
                                      className="flex w-fit items-center"
                                    >
                                      {getStatusIcon(order.status)}
                                      {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => viewOrderDetails(order)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Select
                                        value={order.status}
                                        onValueChange={(value) =>
                                          handleUpdateOrderStatus(
                                            order.order_id,
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-[130px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">
                                            Pending
                                          </SelectItem>
                                          <SelectItem value="processing">
                                            Processing
                                          </SelectItem>
                                          <SelectItem value="completed">
                                            Completed
                                          </SelectItem>
                                          <SelectItem value="cancelled">
                                            Cancelled
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                              .slice(0, 5)
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-6 text-muted-foreground"
                              >
                                No orders found matching your criteria
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No pending orders at the moment
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
