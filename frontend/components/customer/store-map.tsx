'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Heart,
  Star,
  Clock,
  Plus,
  PanelRightClose,
  Minus,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { dummyStores } from '@/lib/dummy-data';
import CustomerSidebar from '@/components/customer/customer-sidebar';
import InteractiveMap from '@/components/map/interactive-map';
import { toast } from '@/components/ui/use-toast';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import PathContainer from '@/lib/PathContainer';
import DEFDEFSEC from '@/lib/DEFDEFSEC';
import PathLines2nd from '@/lib/PathLines2nd';
import { stallsGround, stallsSecond } from '@/lib/data';
import PathLines from '@/lib/PathLines';

const Controls = ({
  showSecondFloor,
  setShowSecondFloor,
}: {
  showSecondFloor: boolean;
  setShowSecondFloor: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { zoomIn, zoomOut } = useControls();
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomIn()}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <Plus className="h-4 w-4" color="black" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomOut()}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <Minus className="h-4 w-4 " color="black" />
        <span className="sr-only">Zoom out</span>
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={() => setShowSecondFloor(!showSecondFloor)}
        className="bg-white/90 hover:bg-white shadow-md text-black"
      >
        <PanelRightClose className="h-4 w-4 " color="black" />
        <span className="sr-only">Proceed 2nd Floor</span>
      </Button>
    </div>
  );
};

export default function StoreMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedMapStore, setSelectedMapStore] = useState<any>(null);
  const [showStoreDialog, setShowStoreDialog] = useState(false);

  const [showSecondFloor, setShowSecondFloor] = useState(false);
  const [selectedStalls, setSelectedStalls] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [stalls, setStalls] = useState<any[]>([]);

  const filteredStores = dummyStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleFavorite = (e: React.MouseEvent, storeId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorites.includes(storeId)) {
      setFavorites(favorites.filter((id) => id !== storeId));
      toast({
        title: 'Removed from favorites',
        description: 'This store has been removed from your favorites.',
      });
    } else {
      setFavorites([...favorites, storeId]);
      toast({
        title: 'Added to favorites',
        description: 'This store has been added to your favorites.',
      });
    }
  };

  const handleMapMarkerClick = (storeId: string) => {
    const store = dummyStores.find((s) => s.id === storeId);
    if (store) {
      setSelectedMapStore(store);
      setShowStoreDialog(true);
    }
  };

  // Create map markers from stores
  const mapMarkers = dummyStores.map((store, index) => {
    // Assign stores to different floors and positions
    const floor = index % 2 === 0 ? 1 : 2;

    // Calculate positions based on index
    let x, y;
    if (floor === 1) {
      // Position stores on first floor
      if (index % 4 === 0) {
        x = 17.5; // Store A
        y = 20;
      } else if (index % 4 === 2) {
        x = 17.5; // Store B
        y = 55;
      } else if (index % 4 === 1) {
        x = 72.5; // Store C
        y = 20;
      } else {
        x = 72.5; // Store D
        y = 55;
      }
    } else {
      // Position stores on second floor
      if (index % 3 === 0) {
        x = 17.5; // Store E
        y = 25;
      } else if (index % 3 === 1) {
        x = 17.5; // Store F
        y = 70;
      } else {
        x = 65; // Food Court
        y = 47.5;
      }
    }

    return {
      id: store.id,
      x,
      y,
      label: store.name,
      floor,
      color: 'bg-primary',
    };
  });

  // Add available spaces
  const availableSpaceMarkers = [
    {
      id: 'available1',
      x: 50,
      y: 30,
      label: 'Available Space 101',
      floor: 1,
      color: 'bg-yellow-500',
    },
    {
      id: 'available2',
      x: 50,
      y: 60,
      label: 'Available Space 201',
      floor: 2,
      color: 'bg-yellow-500',
    },
  ];

  const allMarkers = [...mapMarkers, ...availableSpaceMarkers];

  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Stores</h1>
            <p className="text-muted-foreground">
              Discover stores in our shopping mall
            </p>
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
              {/* <InteractiveMap markers={allMarkers} onMarkerClick={handleMapMarkerClick} /> */}

              <div className="h-screen flex items-center justify-center gap-8 relative">
                <div className="mb-[2rem] absolute left-5 top-[1rem] text-2xl font-bold">
                  {showSecondFloor ? (
                    <h1>Second Floor</h1>
                  ) : (
                    <h1>Ground Floor</h1>
                  )}
                </div>
                <div className="relative w-full h-[700px] grid place-content-center place-items-center overflow-hidden bg-transparent">
                  {showSecondFloor ? (
                    <TransformWrapper
                      initialScale={5}
                      minScale={0.5}
                      maxScale={4}
                    >
                      <TransformComponent
                        wrapperClass="w-fit h-fit"
                        contentClass="w-fit h-fit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="1080"
                          zoomAndPan="magnify"
                          viewBox="0 0 810 809.999993"
                          height="1080"
                          preserveAspectRatio="xMidYMid meet"
                          version="1.0"
                        >
                          <DEFDEFSEC />
                          {stallsSecond.map((stall, index) => {
                            let fillColor = '#22c55e'; // Default to blue (occupied)

                            const stallData = stalls.find(
                              (s) => String(s.stall_no) === String(stall.id),
                            );

                            if (stallData) {
                              fillColor = '#3b82f6 '; // Green (available)
                            }

                            return (
                              <PathContainer
                                key={index}
                                onClick={() => {
                                  console.log(stall.id);
                                  setSelectedStalls(stall.id);
                                  setShowModal(true);
                                }}
                                id={stall.id}
                                d={stall.d}
                                fillColor={fillColor} // Pass the fillColor as a prop
                              />
                            );
                          })}

                          <PathLines2nd />
                        </svg>
                      </TransformComponent>
                      <Controls
                        showSecondFloor={showSecondFloor}
                        setShowSecondFloor={setShowSecondFloor}
                      />
                    </TransformWrapper>
                  ) : (
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={4}
                    >
                      <TransformComponent
                        wrapperClass="w-fit h-fit"
                        contentClass="w-fit h-fit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="1080"
                          zoomAndPan="magnify"
                          viewBox="0 0 810 809.999993"
                          height="1080"
                          preserveAspectRatio="xMidYMid meet"
                          version="1.0"
                        >
                          <DEFDEFSEC />

                          {stallsGround.map((stall, index) => {
                            let fillColor = '#22c55e'; // Default to blue (occupied)

                            const stallData = stalls.find(
                              (s) => String(s.stall_no) === String(stall.id),
                            );

                            if (stallData) {
                              fillColor = '#3b82f6 '; // Green (available)
                            }

                            return (
                              <PathContainer
                                key={index}
                                onClick={() => {
                                  console.log(stall.id);
                                  setSelectedStalls(stall.id);
                                  setShowModal(true);
                                }}
                                id={stall.id}
                                d={stall.d}
                                fillColor={fillColor} // Pass the fillColor as a prop
                              />
                            );
                          })}

                          <PathLines />
                        </svg>
                      </TransformComponent>
                      <Controls
                        showSecondFloor={showSecondFloor}
                        setShowSecondFloor={setShowSecondFloor}
                      />
                    </TransformWrapper>
                  )}
                </div>
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Tip:</span> Drag to pan the map.
                  Use the buttons to zoom in/out or navigate. Switch between
                  floors using the tabs at the bottom.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Available Stores</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <Card
                      key={store.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {store.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleFavorite(e, store.id)}
                            className="h-8 w-8"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(store.id)
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                              }`}
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
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/customer/store/${store.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      No stores found matching your search.
                    </p>
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
                      className={`h-4 w-4 ${
                        i < selectedMapStore.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                <span className="text-sm ml-1">
                  ({selectedMapStore.reviewCount} reviews)
                </span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{selectedMapStore.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Promotions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMapStore.promotions.map(
                    (promo: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {promo}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  variant="outline"
                  onClick={(e) => toggleFavorite(e, selectedMapStore.id)}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(selectedMapStore.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                  {favorites.includes(selectedMapStore.id)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </Button>

                <Button asChild>
                  <Link href={`/customer/store/${selectedMapStore.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
