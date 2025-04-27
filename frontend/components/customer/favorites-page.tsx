"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, MapPin, Star, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dummyStores } from "@/lib/dummy-data"
import CustomerSidebar from "@/components/customer/customer-sidebar"

export default function FavoritesPage() {
  // For demo purposes, we'll start with some favorites
  const [favorites, setFavorites] = useState<string[]>(["store1", "store2"])

  const favoriteStores = dummyStores.filter((store) => favorites.includes(store.id))

  const toggleFavorite = (storeId: string) => {
    if (favorites.includes(storeId)) {
      setFavorites(favorites.filter((id) => id !== storeId))
    } else {
      setFavorites([...favorites, storeId])
    }
  }

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">Stores you've saved for quick access</p>
          </div>

          {favoriteStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteStores.map((store) => (
                <Card key={store.id} className="hover:border-primary transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(store.id)} className="h-8 w-8">
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted rounded-full p-6 mb-4">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">You haven't added any stores to your favorites.</p>
              <Button asChild>
                <a href="/customer/stores">Browse Stores</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

