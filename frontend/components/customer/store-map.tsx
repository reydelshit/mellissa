"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Heart, Star, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { dummyStores } from "@/lib/dummy-data"
import CustomerSidebar from "@/components/customer/customer-sidebar"
import InteractiveMap from "@/components/map/interactive-map"
import { toast } from "@/components/ui/use-toast"

export default function StoreMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedMapStore, setSelectedMapStore] = useState<any>(null)
  const [showStoreDialog, setShowStoreDialog] = useState(false)

  const filteredStores = dummyStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFavorite = (e: React.MouseEvent, storeId: string) => {
    e.preventDefault()
    e.stopPropagation()

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

  const handleMapMarkerClick = (storeId: string) => {
    const store = dummyStores.find((s) => s.id === storeId)
    if (store) {
      setSelectedMapStore(store)
      setShowStoreDialog(true)
    }
  }

  // Create map markers from stores
  const mapMarkers = dummyStores.map((store, index) => {
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

    return {
      id: store.id,
      x,
      y,
      label: store.name,
      floor,
      color: "bg-primary",
    }
  })

  // Add available spaces
  const availableSpaceMarkers = [
    {
      id: "available1",
      x: 50,
      y: 30,
      label: "Available Space 101",
      floor: 1,
      color: "bg-yellow-500",
    },
    {
      id: "available2",
      x: 50,
      y: 60,
      label: "Available Space 201",
      floor: 2,
      color: "bg-yellow-500",
    },
  ]

  const allMarkers = [...mapMarkers, ...availableSpaceMarkers]

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Stores</h1>
            <p className="text-muted-foreground">Discover stores in our shopping mall</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for stores or locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative">
              <InteractiveMap markers={allMarkers} onMarkerClick={handleMapMarkerClick} />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Tip:</span> Drag to pan the map. Use the buttons to zoom in/out or
                  navigate. Switch between floors using the tabs at the bottom.
                </p>
              </div>

             
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Available Stores</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <Card key={store.id} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{store.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleFavorite(e, store.id)}
                            className="h-8 w-8"
                          >
                            <Heart
                              className={`h-5 w-5 ${favorites.includes(store.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
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
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/customer/store/${store.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">No stores found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store details dialog for map markers */}
      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedMapStore?.name}
            </DialogTitle>
            <DialogDescription>{selectedMapStore?.location}</DialogDescription>
          </DialogHeader>

          {selectedMapStore && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>{selectedMapStore.openingHours}</span>
              </div>

              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < selectedMapStore.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                <span className="text-sm ml-1">({selectedMapStore.reviewCount} reviews)</span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{selectedMapStore.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Promotions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMapStore.promotions.map((promo: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {promo}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  variant="outline"
                  onClick={(e) => toggleFavorite(e, selectedMapStore.id)}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(selectedMapStore.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {favorites.includes(selectedMapStore.id) ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                <Button asChild>
                  <Link href={`/customer/store/${selectedMapStore.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

