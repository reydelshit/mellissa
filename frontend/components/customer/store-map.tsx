'use client';

import type React from 'react';

import CustomerSidebar from '@/components/customer/customer-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { stallsGround, stallsSecond } from '@/lib/data';
import DEFDEFSEC from '@/lib/DEFDEFSEC';
import { dummyStores } from '@/lib/dummy-data';
import PathContainer from '@/lib/PathContainer';
import PathLines from '@/lib/PathLines';
import PathLines2nd from '@/lib/PathLines2nd';
import axios from 'axios';
import {
  Clock,
  Heart,
  MapPin,
  Minus,
  PanelRightClose,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import { StoreDetails } from '../admin/admin-dashboard';

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
  const [storeOwnersFromDB, setStoreOwners] = useState<StoreDetails[]>([]);

  const [showSecondFloor, setShowSecondFloor] = useState(false);
  const [selectedStalls, setSelectedStalls] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [stallDetails, setStallDetails] = useState({
    stall_no: '',
    floor: '',
    size: '',
  });

  const filteredStores = storeOwnersFromDB.filter(
    (store) =>
      store.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [hoveredStallId, setHoveredStallId] = useState<string | null>(null);

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

  const [stalls, setStalls] = useState<any[]>([]);

  const [viewStallDetails, setViewStallDetails] = useState({} as StoreDetails);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/store-owner');
      console.log(response.data);
      setStoreOwners(response.data);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchStoreOwners()]);
  }, []);

  const updatedStallsGround = stallsGround.map((stall) => ({
    ...stall,
    floor: '1',
    size: `${Math.floor(Math.random() * (1350 - 1150 + 1)) + 1150} sq`,
  }));

  const updatedStalSecondFllot = stallsSecond.map((stall) => ({
    ...stall,
    floor: '1',
    size: `${Math.floor(Math.random() * (1350 - 1150 + 1)) + 1150} sq`,
  }));

  const hasImages = viewStallDetails.media && viewStallDetails.media.length > 0;
  const visibleStores = filteredStores.filter(
    (store) => store.floor === (showSecondFloor ? 2 : 1),
  );
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
                          {updatedStalSecondFllot.map((stall, index) => {
                            let fillColor = '#eab308'; // Default to black (occupied)

                            const stallData = storeOwnersFromDB.find(
                              (s) => String(s.stall_no) === String(stall.id),
                            );

                            if (stallData) {
                              fillColor = '#222831'; // Stall is occupied
                            }

                            // If hovered, override the color
                            if (hoveredStallId === String(stall.id)) {
                              fillColor = '#FE7743'; // Hover color
                            }

                            return (
                              <PathContainer
                                key={index}
                                onClick={() => {
                                  console.log(stall.id);
                                  setStallDetails({
                                    stall_no: stall.id,
                                    floor: stall.floor,
                                    size: stall.size,
                                  });
                                  setSelectedStalls(stall.id);
                                  if (stallData) {
                                    setShowModal(true);
                                    setViewStallDetails(stallData);
                                  } else {
                                    // setShowAddOwnerDialog(true);
                                  }
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

                          {updatedStallsGround.map((stall, index) => {
                            let fillColor = '#eab308'; // Default to black (occupied)

                            const stallData = storeOwnersFromDB.find(
                              (s) => String(s.stall_no) === String(stall.id),
                            );

                            if (stallData) {
                              fillColor = '#222831'; // Stall is occupied
                            }

                            // If hovered, override the color
                            if (hoveredStallId === String(stall.id)) {
                              fillColor = '#FE7743'; // Hover color
                            }

                            return (
                              <PathContainer
                                key={index}
                                onClick={() => {
                                  console.log(stall.id);
                                  setStallDetails({
                                    stall_no: stall.id,
                                    floor: stall.floor,
                                    size: stall.size,
                                  });
                                  setSelectedStalls(stall.id);
                                  if (stallData) {
                                    setShowModal(true);
                                    setViewStallDetails(stallData);
                                  } else {
                                    // setShowAddOwnerDialog(true);
                                  }
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
                {visibleStores.length > 0 ? (
                  visibleStores.map((store) => (
                    <Card
                      key={store.storeOwner_id}
                      className="cursor-pointer hover:border-primary transition-colors hover:border-[#FE7743]"
                      onMouseEnter={() =>
                        setHoveredStallId(String(store.stall_no))
                      }
                      onMouseLeave={() => setHoveredStallId(null)}
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
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(String(store.storeOwner_id))
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
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/customer/store/${store.storeOwner_id}`}>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Store Information</h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Store Images */}
              {hasImages && (
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`http://localhost:8800/api/${viewStallDetails.media[selectedImage]?.path}`}
                      alt={viewStallDetails.media[selectedImage]?.pathName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {viewStallDetails.media.map((image, index) => (
                      <button
                        key={image.media_id}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={`http://localhost:8800/api/${image.path}`}
                          alt={image.pathName}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stall Number
                    </label>
                    <div className="mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewStallDetails.stall_no}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Name
                    </label>
                    <div className="mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewStallDetails.ownerName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Store Name
                    </label>
                    <div className="mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewStallDetails.storeName}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewStallDetails.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                      {viewStallDetails.phone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {viewStallDetails.storeCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Space Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Space Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Location
                    </span>
                    <p className="mt-1">{viewStallDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Size
                    </span>
                    <p className="mt-1">{viewStallDetails.size}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Floor
                    </span>
                    <p className="mt-1">
                      {viewStallDetails.floor === 1
                        ? 'Ground Floor'
                        : `${viewStallDetails.floor}nd Floor`}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Opening Hours
                    </span>
                    <p className="mt-1">{viewStallDetails.openingHours}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{viewStallDetails.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
