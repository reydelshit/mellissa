"use client"

import { useState, useEffect } from "react"
import { Heart, Star, Clock, ShoppingCart, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyStores, dummyMenuItems } from "@/lib/dummy-data"
import CustomerSidebar from "@/components/customer/customer-sidebar"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function StoreDetails({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundStore = dummyStores.find((s) => s.id === storeId)
    if (foundStore) {
      setStore(foundStore)
    }
    setLoading(false)
  }, [storeId])

  const toggleFavorite = (storeId: string) => {
    if (favorites.includes(storeId)) {
      setFavorites(favorites.filter((id) => id !== storeId))
      toast({
        title: "Removed from favorites",
        description: "This store has been removed from your favorites.",
      })
    } else {
      setFavorites([...favorites, storeId])
      toast({
        title: "Added to favorites",
        description: "This store has been added to your favorites.",
      })
    }
  }

  const addToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      action: (
        <ToastAction altText="View Cart" asChild>
          <a href="/customer/cart">View Cart</a>
        </ToastAction>
      ),
    })
  }

  const updateQuantity = (itemId: string, change: number) => {
    const existingItem = cart.find((item) => item.id === itemId)

    if (!existingItem) return

    const newQuantity = existingItem.quantity + change

    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== itemId))
      toast({
        title: "Removed from cart",
        description: `${existingItem.name} has been removed from your cart.`,
      })
    } else {
      setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <CustomerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <p className="text-muted-foreground">{store.location}</p>
            </div>
            <Button
              variant={favorites.includes(store.id) ? "default" : "outline"}
              size="icon"
              onClick={() => toggleFavorite(store.id)}
            >
              <Heart className={`h-5 w-5 ${favorites.includes(store.id) ? "fill-white" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500">Store Image Gallery (Placeholder)</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-300 h-16 w-16 flex-shrink-0 rounded"></div>
                ))}
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
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < store.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    <span className="text-sm ml-1">({store.reviewCount} reviews)</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm">{store.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Current Promotions</h3>
                    <div className="flex flex-wrap gap-2">
                      {store.promotions.map((promo: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {promo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="menu">
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="info">Additional Info</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dummyMenuItems.map((item) => {
                  const cartItem = cart.find((i) => i.id === item.id)

                  return (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>${item.price.toFixed(2)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{item.description}</p>
                      </CardContent>
                      <CardFooter>
                        {cartItem ? (
                          <div className="flex items-center justify-between w-full">
                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">{cartItem.quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="default" className="w-full" onClick={() => addToCart(item)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>

              {cart.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Your Cart</h3>
                    <Badge variant="secondary">{cart.reduce((total, item) => total + item.quantity, 0)} items</Badge>
                  </div>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <a href="/customer/cart">View Cart</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-base">Customer Name</CardTitle>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <Star
                                key={j}
                                className={`h
                                className={\`h-4 w-4 ${j < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                        </div>
                      </div>
                      <CardDescription>2 weeks ago</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Great store with excellent service and products. Would definitely recommend to others!
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="info" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p className="text-sm">Phone: (555) 123-4567</p>
                      <p className="text-sm">Email: contact@{store.name.toLowerCase().replace(/\s/g, "")}.com</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Delivery Information</h3>
                      <p className="text-sm">Delivery available within 5 miles radius</p>
                      <p className="text-sm">Estimated delivery time: 30-45 minutes</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Payment Methods</h3>
                      <p className="text-sm">Credit/Debit Cards, Cash on Delivery, Mobile Payments</p>
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

