'use client';

import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyOrders, dummyReviews } from '@/lib/dummy-data';
import { Calendar, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from 'recharts';

const BarGraph = ({ data, dataKey, color, label }: any) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} name={label} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  const totalRevenue = dummyOrders.reduce((sum, order) => sum + order.total, 0);
  const averageRating =
    dummyReviews.reduce((sum, review) => sum + review.rating, 0) /
    dummyReviews.length;

  const [orderData, setOrderData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [ordersRes, reviewsRes, customersRes] = await Promise.all([
          fetch('http://localhost:8800/api/graphs/monthly-stats/orders'),
          fetch('http://localhost:8800/api/graphs/monthly-stats/ratings'),
          fetch('http://localhost:8800/api/graphs/monthly-stats/customers'),
        ]);

        if (!ordersRes.ok || !reviewsRes.ok || !customersRes.ok) {
          throw new Error('Failed to fetch data.');
        }

        const [orders, reviews, customers] = await Promise.all([
          ordersRes.json(),
          reviewsRes.json(),
          customersRes.json(),
        ]);

        console.log('Orders:', orders);
        console.log('Reviews:', reviews);
        console.log('Customers:', customers);

        setOrderData(orders);
        setReviewData(reviews);
        setCustomerData(customers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics & Reporting</h1>
              <p className="text-muted-foreground">
                View insights and export data for your stores
              </p>
            </div>

            <div className="flex gap-2">
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>

              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₱{totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last {timeRange}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyOrders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8% from last {timeRange}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₱{(totalRevenue / dummyOrders.length).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +4% from last {timeRange}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {averageRating.toFixed(1)}/5
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  -0.2 from last {timeRange}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="pt-4">
              <BarGraph
                data={orderData}
                dataKey="orderCount"
                color="#3b82f6"
                label="Orders"
              />
            </TabsContent>
            <TabsContent value="sales" className="pt-4">
              <BarGraph
                data={orderData}
                dataKey="totalRevenue"
                color="#10b981"
                label="Sales (₱)"
              />
            </TabsContent>

            <TabsContent value="customers" className="pt-4">
              <BarGraph
                data={customerData}
                dataKey="customerCount"
                color="#8b5cf6"
                label="Customers"
              />
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <BarGraph
                data={reviewData}
                dataKey="reviewCount"
                color="#ef4444"
                label="Reviews"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
