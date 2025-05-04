'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Eye, Download, Check, Clock, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyOrders } from '@/lib/dummy-data';
import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
import axios from 'axios';

export type OrderTypes = {
  order_id: string;
  user_id: string;
  total_price: string;
  status: string;
  created_at: string;
  fullname: string;
  delivery_address: string;
  payment_method: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null as OrderTypes | null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

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

  useEffect(() => {
    fetchOrders();
  }, []);

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

      if (selectedOrder && selectedOrder.order_id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      // Send update to backend
      await axios.put(`http://localhost:8800/api/orders/status/₱{orderId}`, {
        status,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const viewOrderDetails = (order: OrderTypes) => {
    console.log('Selected order:', order);
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

  const handleExportData = () => {
    // In a real app, this would generate a CSV or PDF
    alert('Exporting order data...');
  };

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-muted-foreground">
              View and manage customer orders
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <ShoppingBag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Select
                defaultValue="all"
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="pt-4">
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
                        filteredOrders.map((order) => (
                          <TableRow key={order.order_id}>
                            <TableCell className="font-medium">
                              {order.order_id}
                            </TableCell>
                            <TableCell>{order.fullname}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>
                              ₱{Number(order.total_price).toFixed(2)}
                            </TableCell>
                            <TableCell>{order.created_at}</TableCell>
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
            </TabsContent>

            <TabsContent value="pending" className="pt-4">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter((order) => order.status === 'pending')
                        .length > 0 ? (
                        orders
                          .filter((order) => order.status === 'pending')
                          .map((order) => (
                            <TableRow key={order.order_id}>
                              <TableCell className="font-medium">
                                {order.order_id}
                              </TableCell>
                              <TableCell>{order.fullname}</TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell>
                                {' '}
                                ₱{Number(order.total_price).toFixed(2)}
                              </TableCell>
                              <TableCell>{order.created_at}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => viewOrderDetails(order)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant={'default'}
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateOrderStatus(
                                        order.order_id,
                                        'completed',
                                      )
                                    }
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No pending orders
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processing" className="pt-4">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No orders in processing
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="pt-4">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter((order) => order.status === 'completed')
                        .length > 0 ? (
                        orders
                          .filter((order) => order.status === 'completed')
                          .map((order) => (
                            <TableRow key={order.order_id}>
                              <TableCell className="font-medium">
                                {order.order_id}
                              </TableCell>
                              <TableCell>{order.fullname}</TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell>
                                {' '}
                                ₱{Number(order.total_price).toFixed(2)}
                              </TableCell>
                              <TableCell>{order.created_at}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => viewOrderDetails(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No completed orders
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cancelled" className="pt-4">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter((order) => order.status === 'cancelled')
                        .length > 0 ? (
                        orders
                          .filter((order) => order.status === 'cancelled')
                          .map((order) => (
                            <TableRow key={order.order_id}>
                              <TableCell className="font-medium">
                                {order.order_id}
                              </TableCell>
                              <TableCell>{order.fullname}</TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell>
                                {' '}
                                ₱{Number(order.total_price).toFixed(2)}
                              </TableCell>
                              <TableCell>{order.created_at}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => viewOrderDetails(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No cancelled orders
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder?.order_id} - {selectedOrder?.created_at}
                </DialogDescription>
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <Badge
                        variant={getStatusVariant(selectedOrder.status)}
                        className="mt-1 flex w-fit items-center"
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </Badge>
                    </div>

                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) =>
                        handleUpdateOrderStatus(selectedOrder.order_id, value)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Customer Information</h3>
                      <p className="text-sm">Name: {selectedOrder.fullname}</p>
                      <p className="text-sm">Email: 'N/A'</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Delivery Information</h3>
                      <p className="text-sm">
                        Address: {selectedOrder.delivery_address || 'N/A'}
                      </p>
                      <p className="text-sm">Delivery Method: Standard</p>
                      <p className="text-sm">
                        Estimated Delivery: 30-45 minutes
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              ₱{Number(item.price).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ₱{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>
                        ₱{Number(selectedOrder.total_price).toFixed(2)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>₱2.99</span>
                    </div> */}
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>
                        ₱{(Number(selectedOrder.total_price) * 0.08).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ₱{Number(selectedOrder.total_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderDetails(false)}
                >
                  Close
                </Button>

                {selectedOrder && selectedOrder.status === 'pending' && (
                  <Button
                    variant={'default'}
                    onClick={() => {
                      handleUpdateOrderStatus(
                        selectedOrder.order_id,
                        'completed',
                      );
                      setShowOrderDetails(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
