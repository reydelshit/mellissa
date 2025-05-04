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
import { cn } from '@/lib/utils';

export interface StoreFavorites extends StoreDetailsType {
  created_at: string;
  favorites_id: number;
  store_id: string;
  user_id: string;
}

export interface StoreProps {
  favorites_id: number | string;
  storeOwner_id: number | string;
  storeName: string;
  location: string;
  openingHours: string;
  isFavorite?: boolean;
  onToggleFavorite: (
    e: React.MouseEvent<HTMLButtonElement>,
    storeId: string,
  ) => void;
}

export function FavoriteStoreCard({
  favorites_id,
  storeOwner_id,
  storeName,
  location,
  openingHours,
  isFavorite = true,
  onToggleFavorite,
}: StoreProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:translate-y-[-4px]">
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {storeName}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onToggleFavorite(e, String(storeOwner_id))}
            className="h-8 w-8 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors absolute right-4 top-4"
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all duration-300',
                isFavorite
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-muted-foreground hover:fill-rose-300 hover:text-rose-500',
              )}
            />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="line-clamp-1">{location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{openingHours}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-300 group-hover:border-primary/70"
          asChild
        >
          <Link href={`/customer/store/${storeOwner_id}`}>View Store</Link>
        </Button>
      </CardFooter>
    </Card>
  );
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
      <div className="w-full flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            My Favorite Stores
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Stores you've marked as favorites for quick access
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">
              You haven't added any favorite stores yet
            </p>
            <p className="text-sm text-muted-foreground">
              Mark stores as favorites to access them quickly from this page
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {favorites.map((store) => (
              <FavoriteStoreCard
                key={store.favorites_id}
                {...store}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
