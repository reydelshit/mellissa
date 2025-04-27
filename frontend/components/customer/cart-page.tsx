"use client"

import { useState } from "react"
import { ShoppingCart, Trash2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CustomerSidebar from "@/components/customer/customer-sidebar"

// Dummy cart data
const initialCart = [
  { id: "item1", name: "Classic Burger", price: 9.99, quantity: 2 },
  { id: "item2", name: "French Fries", price: 3.99, quantity: 1 },
  { id: "item3", name: "Chocolate Milkshake", price: 4.99, quantity: 1 },
]

export default function CartPage() {
  const [cart, setCart] = useState(initialCart)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
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
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground">Review your items and proceed to checkout</p>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                    <CardDescription>You have {cart.length} items in your cart</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted w-16 h-16 rounded-md flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>

                          <div className="w-20 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>

                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setShowCheckout(true)}>
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted rounded-full p-6 mb-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Button asChild>
                <a href="/customer/stores">Browse Stores</a>
              </Button>
            </div>
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
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleCheckout}>Place Order</Button>
              </DialogFooter>
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

              <DialogFooter>
                <Button onClick={() => setShowReviewDialog(false)}>Submit Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

