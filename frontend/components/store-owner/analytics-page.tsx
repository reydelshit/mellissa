"use client"

import { useState } from "react"
import { BarChart3, LineChart, PieChart, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyOrders, dummyReviews } from "@/lib/dummy-data"
import StoreOwnerSidebar from "@/components/store-owner/store-owner-sidebar"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

  const totalRevenue = dummyOrders.reduce((sum, order) => sum + order.total, 0)
  const averageRating = dummyReviews.reduce((sum, review) => sum + review.rating, 0) / dummyReviews.length

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics & Reporting</h1>
              <p className="text-muted-foreground">View insights and export data for your stores</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last {timeRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyOrders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">+8% from last {timeRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalRevenue / dummyOrders.length).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">+4% from last {timeRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground mt-1">-0.2 from last {timeRange}</p>
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

            <TabsContent value="sales" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Sales data for the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/40 rounded-md">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Sales chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Analytics</CardTitle>
                  <CardDescription>Order data for the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/40 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Order analytics visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                  <CardDescription>Customer data for the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/40 rounded-md">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Customer insights visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Analysis</CardTitle>
                  <CardDescription>Review data for the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/40 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Review analysis visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

