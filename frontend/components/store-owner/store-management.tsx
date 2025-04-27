"use client"

import { useEffect, useState } from "react"
import { MapPin, Upload, Plus, Edit, Trash2, Clock, Star, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyStores } from "@/lib/dummy-data"
import StoreOwnerSidebar from "@/components/store-owner/store-owner-sidebar"
import InteractiveMap from "@/components/map/interactive-map"



type StoreType = {
  created_at: string
  description: string
  id: string
  location: string
  ownerName: string
  storeName: string
  storeCategory: string
  storeOwner_id: string
  email: string
  phone: string
  floor: number
  size: number

  openingHours: string
}

interface StoreOwnerDetails {
  store: StoreType;
}

export default function StoreManagement() {
  // For demo purposes, we'll assume the store owner owns the first store
  const [store, setStore] = useState<StoreType | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeOwnerDefaultDetails = localStorage.getItem("store_owner_details");
      if (storeOwnerDefaultDetails) {
        const parsed = JSON.parse(storeOwnerDefaultDetails);
        setStore(parsed as StoreType);
      }
    }
  }, []);

  useEffect(() => {
    console.log('details', store);
  }, [store]);


  // Create map markers from all stores
  const storeMarkers = dummyStores.map((s, index) => {
    // Assign stores to different floors and positions
    const floor = index % 2 === 0 ? 1 : 2

    // Calculate positions based on index
    let x, y
    if (floor === 1) {
      // Position stores on first floor
      if (index % 4 === 0) {
        x = 17.5 // Store A
        y = 20
      } else if (index % 4 === 2) {
        x = 17.5 // Store B
        y = 55
      } else if (index % 4 === 1) {
        x = 72.5 // Store C
        y = 20
      } else {
        x = 72.5 // Store D
        y = 55
      }
    } else {
      // Position stores on second floor
      if (index % 3 === 0) {
        x = 17.5 // Store E
        y = 25
      } else if (index % 3 === 1) {
        x = 17.5 // Store F
        y = 70
      } else {
        x = 65 // Food Court
        y = 47.5
      }
    }

    // Highlight the current store owner's store
    const isCurrentStore = s.id === store?.id

    return {
      id: s.id,
      x,
      y,
      label: s.name,
      floor,
      color: isCurrentStore ? "bg-green-500" : "bg-primary",
    }
  })

  const handleSaveStore = () => {
    // In a real app, this would save to a database
    setShowEditDialog(false)
    setShowSuccessMessage(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleAddPromotion = () => {
    // In a real app, this would add a promotion to the database
    setShowPromoDialog(false)

    // Show success message
    setShowSuccessMessage(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Store</h1>
              <p className="text-muted-foreground">Manage your store information and settings</p>
            </div>

            <Button onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Store
            </Button>
          </div>

          {showSuccessMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Your changes have been saved.</span>
            </div>
          )}

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Store Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="media">Media Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{store?.storeName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {store?.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="font-semithin italic">{(store?.description ?? "").length > 0 ? store?.description : 'Empty store description'}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Opening Hours</h3>
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {store?.openingHours?.length ?? 0 > 0
                        ? store?.openingHours
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Current Promotions</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowPromoDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Promotion
                      </Button>
                    </div>
                    {/* <div className="flex flex-wrap gap-2">
                      {store.promotions.map((promo, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {promo}
                          <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div> */}
                  </div>

                  {/* <div>
                    <h3 className="font-medium mb-2">Store Rating</h3>
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < store.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      <span className="ml-2">
                        {store.rating}/5 ({store.reviewCount} reviews)
                      </span>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Store Location</CardTitle>
                  <CardDescription>View your store location in the mall map</CardDescription>
                </CardHeader>
                <CardContent>
                  <InteractiveMap markers={storeMarkers} onMarkerClick={() => {}} />
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Map Legend</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span>Other Stores</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span>Your Store</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Your store location:</span> {store?.location}, Floor{" "}
                      {store?.floor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Media Gallery</CardTitle>
                  <CardDescription>Upload and manage images for your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative group">
                        <div className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                          <p className="text-xs text-gray-500">Image {i}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button variant="ghost" size="icon" className="text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag and drop images here or click to browse</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Images
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Store Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Store Information</DialogTitle>
            <DialogDescription>Update your store details and settings</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input id="name" defaultValue={store?.storeName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={store?.storeCategory}>
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
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" defaultValue={store?.description} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Opening Hours</Label>
              <Input id="hours" placeholder="Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM" defaultValue={store?.openingHours} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" defaultValue={store?.phone} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={store?.email}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStore}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Promotion Dialog */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Promotion</DialogTitle>
            <DialogDescription>Create a new promotion for your store</DialogDescription>
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
            <Button onClick={handleAddPromotion}>Add Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

