"use client"

import { useState } from "react"
import { MapPin, Search, Heart, ShoppingCart, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { dummyStores, dummyMenuItems } from "@/lib/dummy-data"

export default function CustomerWorkflow() {
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  const filteredStores = dummyStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFavorite = (storeId: string) => {
    if (favorites.includes(storeId)) {
      setFavorites(favorites.filter((id) => id !== storeId))
    } else {
      setFavorites([...favorites, storeId])
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
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleCheckout = () => {
    // In a real app, this would process payment
    setShowCheckout(false)
    setCart([])
    setShowReviewDialog(true)
  }

  return (
    <div className="space-y-8">
      <section className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Browse Map & Locate Store
        </h2>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for stores or locations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
          <p className="text-gray-500">Interactive Map View (Placeholder)</p>
        </div>

        <h3 className="font-medium mb-3">Available Stores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <Card key={store.id} className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(store.id)} className="h-8 w-8">
                    <Heart className={`h-5 w-5 ${favorites.includes(store.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <CardDescription>{store.location}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
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
                        className={`h-4 w-4 ${i < store.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  <span className="text-sm ml-1">({store.reviewCount})</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setSelectedStore(store)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {selectedStore && (
        <section className="bg-muted p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">{selectedStore.name}</h2>
            <Button variant="outline" size="icon" onClick={() => toggleFavorite(selectedStore.id)}>
              <Heart className={`h-5 w-5 ${favorites.includes(selectedStore.id) ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500">Store Image Gallery (Placeholder)</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-300 h-16 w-16 flex-shrink-0 rounded"></div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Store Information</h3>
              <p className="text-sm mb-2">{selectedStore.location}</p>
              <p className="text-sm mb-2">{selectedStore.openingHours}</p>
              <p className="text-sm mb-4">{selectedStore.description}</p>

              <h3 className="font-medium mb-2">Current Promotions</h3>
              {selectedStore.promotions.map((promo: any, index: number) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {promo}
                </Badge>
              ))}
            </div>
          </div>

          <h3 className="font-medium mb-4">Menu Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dummyMenuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>${item.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full" onClick={() => addToCart(item)}>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {cart.length > 0 && (
        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </h2>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <span className="sr-only">Remove</span>×
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="flex justify-between items-center mt-4 mb-6">
            <h3 className="font-bold text-lg">Total</h3>
            <p className="font-bold text-lg">${cartTotal.toFixed(2)}</p>
          </div>

          <Button className="w-full" onClick={() => setShowCheckout(true)}>
            Proceed to Checkout
          </Button>
        </section>
      )}

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order by providing payment details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea id="address" placeholder="Enter your full address" />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(cartTotal + 2.99).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCheckout}>Place Order</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>Share your experience with this store.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button key={rating} variant="ghost" size="icon">
                  <Star className="h-6 w-6" />
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea id="review" placeholder="Tell us about your experience..." />
            </div>
          </div>

          <Button onClick={() => setShowReviewDialog(false)}>Submit Review</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

