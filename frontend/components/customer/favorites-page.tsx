'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Star, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyStores } from '@/lib/dummy-data';
import CustomerSidebar from '@/components/customer/customer-sidebar';
import axios from 'axios';
import { StoreDetailsType } from '../admin/admin-dashboard';
import { toast } from 'sonner';

export interface StoreFavorites extends StoreDetailsType {
  created_at: string;
  favorites_id: number;
  store_id: string;
  user_id: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<StoreFavorites[]>([]);

  const [user_id, setUser_id] = useState('');

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/favorites');

      console.log('Fetched favorites:', response.data);
      console.log('User ID:', user_id);

      // Filter favorites based on the user_id
      const userFavorites = response.data.filter(
        (store: StoreFavorites) => String(store.user_id) === String(user_id),
      );

      console.log('Filtered User Favorites:', userFavorites);

      // Set favorites to the filtered list of favorite stores
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      setUser_id(storedId);
    }
  }, []);

  useEffect(() => {
    if (user_id) {
      fetchFavorites();
    }
  }, [user_id]);

  const toggleFavorite = async (e: React.MouseEvent, storeId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Get user_id from localStorage
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      toast('Error', {
        description: 'You need to be logged in to favorite stores.',
      });
      return;
    }

    // Check if the store is already favorited
    const isFavorited = favorites.some(
      (favorite) => favorite && String(favorite.store_id) === String(storeId),
    );

    try {
      if (isFavorited) {
        // If store is already in favorites, delete it
        await axios.delete('http://localhost:8800/api/favorites', {
          data: { user_id, store_id: storeId },
        });

        // Update the local state after deletion
        setFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => String(favorite.store_id) !== String(storeId),
          ),
        );
        toast('Removed from favorites', {
          description: 'This store has been removed from your favorites.',
        });
      } else {
        // Add store to favorites
        await axios.post('http://localhost:8800/api/favorites/create', {
          user_id,
          store_id: storeId,
        });

        fetchFavorites();
        toast('Added to favorites', {
          description: 'This store has been added to your favorites.',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast('Error', {
        description: 'There was a problem updating your favorites.',
      });
    }
  };

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">
              Stores you've saved for quick access
            </p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((store) => (
                <Card
                  key={store.favorites_id}
                  className="hover:border-primary transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {store.storeName}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) =>
                          toggleFavorite(e, String(store.storeOwner_id))
                        }
                        className="h-8 w-8"
                      >
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
                    {/* <div className="flex items-center gap-1 mt-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < store.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      <span className="text-sm ml-1">
                        ({store.reviewCount})
                      </span>
                    </div> */}
                    {/* <div className="flex flex-wrap gap-2 mt-2">
                      {store.promotions.map((promo, index) => (
                        <Badge key={index} variant="secondary">
                          {promo.title} - {promo.discount}%
                        </Badge>
                      ))}
                    </div> */}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/customer/store/${store.storeOwner_id}`}>
                        View Store
                      </Link>
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
              <p className="text-muted-foreground mb-6">
                You haven't added any stores to your favorites.
              </p>
              <Button asChild>
                <a href="/customer/stores">Browse Stores</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
