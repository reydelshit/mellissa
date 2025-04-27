"use client"

import { useState } from "react"
import { Store, MapPin, ShoppingBag, BarChart3, Upload, Plus, Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { dummyStores, dummyOrders, dummyReviews } from "@/lib/dummy-data"

export default function StoreOwnerWorkflow() {
  const [stores, setStores] = useState(dummyStores)
  const [selectedStore, setSelectedStore] = useState(stores[0])
  const [showStoreDialog, setShowStoreDialog] = useState(false)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [editingStore, setEditingStore] = useState<any>(null)
  const [orders, setOrders] = useState(dummyOrders)

  const handleEditStore = (store: any) => {
    setEditingStore(store)
    setShowStoreDialog(true)
  }

  const handleSaveStore = () => {
    // In a real app, this would save to a database
    setShowStoreDialog(false)
    setEditingStore(null)
  }

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  return (
    <div className="space-y-8">
      <section className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Store className="h-5 w-5" />
          Manage Your Stores
        </h2>

        <div className="flex justify-between mb-6">
          <Select
            value={selectedStore.id}
            onValueChange={(value) => setSelectedStore(stores.find((store) => store.id === value) || stores[0])}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setEditingStore(null)
              setShowStoreDialog(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Store
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedStore.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedStore.location}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditStore(selectedStore)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Store Information</h3>
                <p className="text-sm mb-2">{selectedStore.description}</p>
                <p className="text-sm mb-2">Opening Hours: {selectedStore.openingHours}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < selectedStore.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                  </div>
                  <span className="text-sm">({selectedStore.reviewCount})</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Current Promotions</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowPromoDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStore.promotions.map((promo: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {promo}
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Media Gallery</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                    <p className="text-xs text-gray-500">Image {i}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Manage Orders
        </h2>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
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
                    {orders
                      .filter((order) => order.status === "pending")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={order.status}
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Orders in processing will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Completed orders will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Cancelled orders will appear here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-muted p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Feedback
          </h2>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="text-3xl font-bold mr-2">4.2</p>
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="font-medium mb-3">Recent Reviews</h3>
        <ScrollArea className="h-[300px] rounded-md border">
          {dummyReviews.map((review) => (
            <div key={review.id} className="p-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{review.customer}</h4>
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </ScrollArea>
      </section>

      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStore ? "Edit Store" : "Add New Store"}</DialogTitle>
            <DialogDescription>
              {editingStore ? "Update your store information" : "Add a new store to your account"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input id="name" defaultValue={editingStore?.name || ""} placeholder="My Store" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={editingStore?.category || "restaurant"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                defaultValue={editingStore?.location || ""}
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={editingStore?.description || ""}
                placeholder="Describe your store"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Opening Hours</Label>
              <Input
                id="hours"
                defaultValue={editingStore?.openingHours || ""}
                placeholder="Mon-Fri: 9AM-5PM, Sat-Sun: 10AM-4PM"
              />
            </div>

            <div className="space-y-2">
              <Label>Store Images</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop images here or click to browse</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Upload Images
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStore}>{editingStore ? "Save Changes" : "Add Store"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Promotion</DialogTitle>
            <DialogDescription>Create a new promotion for your store.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promo-name">Promotion Name</Label>
              <Input id="promo-name" placeholder="Summer Sale" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-desc">Description</Label>
              <Textarea id="promo-desc" placeholder="Get 20% off on all items" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <div className="flex gap-2">
                <Input id="discount" placeholder="20" />
                <Select defaultValue="percent">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPromoDialog(false)}>Add Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

