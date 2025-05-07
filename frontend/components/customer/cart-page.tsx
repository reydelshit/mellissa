'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomerSidebar from '@/components/customer/customer-sidebar';
import axios from 'axios';
import { toast } from 'sonner';

// Dummy cart data
type CartItem = {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  product_image: string;
  store_id: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');

  const user_id = localStorage.getItem('user_id');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send a review for each product in the cart
      await Promise.all(
        cart.map((item) =>
          axios.post('http://localhost:8800/api/review/create', {
            user_id,
            product_id: item.product_id,
            rating,
            fullname: reviewName,
            reviewText: reviewText,
          }),
        ),
      );

      toast('Reviews submitted successfully!');

      // Reset form state
      setRating(0);
      setReviewText('');
      setShowCheckout(false);
      setShowReviewDialog(false);

      localStorage.removeItem('cart');
      setCart([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit reviews');
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.product_id === itemId ? { ...item, quantity: newQuantity } : item,
      );
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.product_id !== itemId);
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8800/api/orders/create', {
        user_id,
        total_price: cartTotal,
        status: 'pending',
        fullname: fullName,
        delivery_address: address,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        store_id: cart[0].store_id,
      });

      console.log(res.data);

      toast('Order placed successfully!');

      setShowReviewDialog(true);
      setShowCheckout(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                    <CardDescription>
                      You have {cart.length} items in your cart
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cart.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center justify-between py-4 border-b last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-muted w-16 h-16 rounded-md flex items-center justify-center">
                            <img
                              src={`http://localhost:8800/api/${item.product_image}`}
                              alt={`Image `}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.product_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₱{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.product_id,
                                  Number.parseInt(e.target.value) || 1,
                                )
                              }
                              className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              +
                            </Button>
                          </div>

                          <div className="w-20 text-right font-medium">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.product_id)}
                          >
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
                      <span>₱{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>₱2.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₱{(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ₱{(cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => setShowCheckout(true)}
                    >
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
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button asChild>
                <a href="/customer/stores">Browse Stores</a>
              </Button>
            </div>
          )}

          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleCheckout}>
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                  <DialogDescription>
                    Complete your order by providing payment details.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Gcash</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">Paymaya</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₱{cartTotal.toFixed(2)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₱2.99</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>₱{(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ₱{(cartTotal + 2.99 + cartTotal * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Place Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this store.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Star Rating */}
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <Star
                        className="h-6 w-6"
                        fill={
                          (hoveredRating || rating) >= star ? '#facc15' : 'none'
                        }
                        stroke={
                          (hoveredRating || rating) >= star
                            ? '#facc15'
                            : 'currentColor'
                        }
                      />
                    </Button>
                  ))}
                </div>

                {/* Review Name */}
                <div className="space-y-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    placeholder="John Doe"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || reviewText.trim() === ''}
                >
                  Submit Review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
