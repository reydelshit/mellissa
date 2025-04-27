"use client"
import Link from "next/link"
import { Store, ArrowRight, ArrowUp, ArrowDown, Tag, Percent } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dummyStores, dummyOrders, dummyMenuItems } from "@/lib/dummy-data"
import StoreOwnerSidebar from "@/components/store-owner/store-owner-sidebar"

// For demo purposes, we'll assume the store owner owns the first store
const OWNER_STORE = dummyStores[0]

// Filter orders for this store owner
const OWNER_ORDERS = dummyOrders.filter((order) =>
  order.items.some((item) => item.name.includes(OWNER_STORE.name.split(" ")[0])),
)

export default function StoreOwnerDashboard() {
  const totalRevenue = OWNER_ORDERS.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = OWNER_ORDERS.filter((order) => order.status === "pending")

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Store Dashboard</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    12%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{OWNER_ORDERS.length}</div>
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    8%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{dummyMenuItems.length}</div>
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    4%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Store Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{OWNER_STORE.rating}/5</div>
                  <div className="flex items-center text-red-500 text-sm">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    0.2
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Manage Products
                    </CardTitle>
                    <CardDescription>Add, edit or remove products from your store</CardDescription>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="h-5 w-5" />
                      Promotions
                    </CardTitle>
                    <CardDescription>Create special offers and discounts</CardDescription>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Store Profile
                    </CardTitle>
                    <CardDescription>Update your store information and settings</CardDescription>
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

            <section className="lg:col-span-2">
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
                {pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                        <CardDescription>
                          {order.date} - {order.customer}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${order.total.toFixed(2)}</span>
                      </CardFooter>
                    </Card>
                  ))
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
  )
}

