"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Clock, Star, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dummyStores, dummyOrders } from "@/lib/dummy-data"
import CustomerSidebar from "@/components/customer/customer-sidebar"

export default function CustomerDashboard() {
  const [recentOrders, setRecentOrders] = useState(dummyOrders.slice(0, 3))
  const [nearbyStores, setNearbyStores] = useState(dummyStores)

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Welcome, Jed Agayan</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
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
                <p className="text-3xl font-bold">{dummyOrders.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Favorite Stores</CardTitle>
                <CardDescription>Stores you love</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
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
                {nearbyStores.map((store) => (
                  <Card key={store.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{store.name}</CardTitle>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < store.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
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
                            {promo}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/customer/store/${store.id}`}>View Store</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <Button variant="ghost">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "success"
                              : order.status === "pending"
                                ? "warning"
                                : "default"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{order.date}</CardDescription>
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
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

