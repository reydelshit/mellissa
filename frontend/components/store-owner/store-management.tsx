'use client';

import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { stallsGround, stallsSecond } from '@/lib/data';
import DEFDEFSEC from '@/lib/DEFDEFSEC';
import PathContainer from '@/lib/PathContainer';
import PathLines from '@/lib/PathLines';
import PathLines2nd from '@/lib/PathLines2nd';
import axios from 'axios';
import {
  Clock,
  Edit,
  MapPin,
  Minus,
  PanelRightClose,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import { toast } from 'sonner';
import { StoreDetailsType } from '../admin/admin-dashboard';
import { Badge } from '../ui/badge';

type StoreType = {
  created_at: string;
  description: string;
  id: string;
  location: string;
  ownerName: string;
  storeName: string;
  storeCategory: string;
  storeOwner_id: string;
  email: string;
  phone: string;
  floor: number;
  size: number;

  openingHours: string;
};

type ImageTypeGallery = {
  media_id: string;
  path: string;
  pathName: string;
  created_at: string;
  storeOwner_id: string;
};

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

export default function StoreManagement() {
  const [storeDetails, setStoreDetails] = useState<StoreDetailsType | null>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // store forms
  const [storeName, setStoreName] = useState(storeDetails?.storeName || '');
  const [storeCategory, setStoreCategory] = useState(
    storeDetails?.storeCategory || '',
  );
  const [description, setDescription] = useState(
    storeDetails?.description || '',
  );
  const [openingHours, setOpeningHours] = useState(
    storeDetails?.openingHours || '',
  );
  const [phone, setPhone] = useState(storeDetails?.phone || '');
  const [email, setEmail] = useState(storeDetails?.email || '');

  // Image upload states
  const [images, setImages] = useState<ImageTypeGallery[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [storeOwnersFromDB, setStoreOwners] = useState<StoreDetailsType[]>([]);

  // promotions
  const [title, setTitle] = useState('');
  const [descriptionPromotions, setDescriptionPromotions] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('percent');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storeOwnerDefaultDetails = localStorage.getItem(
        'store_owner_details',
      );
      if (storeOwnerDefaultDetails) {
        const parsed = JSON.parse(storeOwnerDefaultDetails);
        setStoreDetails(parsed as StoreDetailsType);
      }
    }
  }, []);

  useEffect(() => {
    console.log('details', storeDetails);
  }, [storeDetails]);

  const [viewStallDetails, setViewStallDetails] = useState(
    {} as StoreDetailsType,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSecondFloor, setShowSecondFloor] = useState(false);

  const [selectedStalls, setSelectedStalls] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [stallDetails, setStallDetails] = useState({
    stall_no: '',
    floor: '',
    size: '',
  });

  const hoveredStallId = storeDetails?.stall_no;

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

  const storeDetailsFromDBWithPromotionsProductsMedia = storeOwnersFromDB.find(
    (store) => store.storeOwner_id === storeDetails?.storeOwner_id,
  );

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

  const fetchMediaGallery = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8800/api/media-gallery',
      );
      console.log(response.data);
      setImages(response.data.media);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchMediaGallery()]);
  }, []);

  useEffect(() => {
    if (storeDetails) {
      setStoreName(storeDetails.storeName || '');
      setStoreCategory(storeDetails.storeCategory || '');
      setDescription(storeDetails.description || '');
      setOpeningHours(storeDetails.openingHours || '');
      setPhone(storeDetails.phone || '');
      setEmail(storeDetails.email || '');
    }
  }, [storeDetails]);

  const handleSaveStore = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8800/api/store-owner/${storeDetails?.storeOwner_id}`,
        {
          ownerName: storeDetails?.ownerName,
          storeName,
          storeCategory,
          description,
          openingHours,
          phone,
          email,
        },
      );

      console.log('Store updated:', response.data);
      setShowEditDialog(false);
      setShowSuccessMessage(true);

      // Save to localStorage
      localStorage.setItem(
        'store_owner_details',
        JSON.stringify({
          ...storeDetails,
          storeName,
          storeCategory,
          description,
          openingHours,
          phone,
          email,
        }),
      );

      // ✅ Also update your React state
      setStoreDetails((prev) =>
        prev
          ? {
              ...prev,
              storeName,
              storeCategory,
              description,
              openingHours,
              phone,
              email,
            }
          : null,
      );

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update store:', error);
    }
  };

  // Function to handle the file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();

      // Include the additional fields required by the backend
      formData.append('media_image', file);
      formData.append('mediaName', 'oh yeah');
      formData.append(
        'storeOwner_id',
        String(storeDetails?.storeOwner_id) || '',
      );

      // Set image preview
      setImagePreview(URL.createObjectURL(file));

      setIsUploading(true);

      try {
        const response = await axios.post(
          'http://localhost:8800/api/media-gallery/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );

        const uploadedImagePath = response.data.mediaPath;
        console.log('Image uploaded successfully:', uploadedImagePath);
        setImages((prevImages) => [...prevImages, uploadedImagePath]);

        fetchMediaGallery();
        // Reset the input field
        e.target.value = '';
        setImagePreview(null);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (imagePath: string) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/media-gallery/${imagePath}`,
      );
      setImages((prevImages) =>
        prevImages.filter((image) => image.path !== imagePath),
      );

      fetchMediaGallery();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowPromoDialog(false);

    try {
      const res = await axios.post(
        'http://localhost:8800/api/promotions/create',
        {
          title,
          startDate,
          endDate,
          discountType,
          discount,
          description: descriptionPromotions,
          storeOwner_id: storeDetails?.storeOwner_id,
          status: 'active',
        },
      );

      console.log(res.data);

      toast('Store owner added successfully!');

      // Show success message
      setShowSuccessMessage(true);

      // clear fields
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDiscount('');
      setDescriptionPromotions('');
      setDiscountType('percent');
      setShowPromoDialog(false);

      fetchStoreOwners();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add store owner');
    }
  };

  const handleDeletePromotions = async (ID: string) => {
    try {
      await axios.delete(`http://localhost:8800/api/promotions/${ID}`);

      fetchStoreOwners();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Store</h1>
              <p className="text-muted-foreground">
                Manage your store information and settings
              </p>
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
              <span className="block sm:inline">
                {' '}
                Your changes have been saved.
              </span>
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
                  <CardTitle>
                    {storeDetailsFromDBWithPromotionsProductsMedia?.storeName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {storeDetailsFromDBWithPromotionsProductsMedia?.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="font-semithin italic">
                      {(
                        storeDetailsFromDBWithPromotionsProductsMedia?.description ??
                        ''
                      ).length > 0
                        ? storeDetailsFromDBWithPromotionsProductsMedia?.description
                        : 'Empty store description'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Opening Hours</h3>
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {storeDetailsFromDBWithPromotionsProductsMedia
                        ?.openingHours?.length ?? 0 > 0
                        ? storeDetailsFromDBWithPromotionsProductsMedia?.openingHours
                        : 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Store Rating</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i <
                              Number(
                                storeDetailsFromDBWithPromotionsProductsMedia?.avg_rating,
                              )
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      <span className="text-sm ml-1">
                        (
                        {
                          storeDetailsFromDBWithPromotionsProductsMedia?.review_count
                        }
                        )
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Current Promotions</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPromoDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Promotion
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {storeDetailsFromDBWithPromotionsProductsMedia?.promotions.map(
                        (promo, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {promo.discount}% off - {promo.title}
                            <Button
                              onClick={() =>
                                handleDeletePromotions(
                                  String(promo.promotion_id),
                                )
                              }
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="pt-4 relative">
              <Card>
                <CardHeader>
                  <CardTitle>Store Location</CardTitle>
                  <CardDescription>
                    View your store location in the mall map
                  </CardDescription>
                </CardHeader>

                <CardContent>
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
                                  (s) =>
                                    String(s.stall_no) === String(stall.id),
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
                                  (s) =>
                                    String(s.stall_no) === String(stall.id),
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

                  <div className="mt-4 p-4 bg-muted rounded-lg absolute top-3 right-5">
                    <h3 className="font-medium mb-2">Map Legend</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span>Other Stores</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#FE7743]"></div>
                        <span>Your Store</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Your store location:</span>{' '}
                      {storeDetails?.location}, Floor {storeDetails?.floor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Media Gallery</CardTitle>
                  <CardDescription>
                    Upload and manage images for your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.length === 0 ? (
                      <p className="col-span-4 text-center text-gray-500">
                        No images uploaded
                      </p>
                    ) : (
                      images
                        .filter(
                          (img) =>
                            String(img.storeOwner_id) ===
                            String(storeDetails?.storeOwner_id),
                        )
                        .map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="bg-gray-200 aspect-square rounded-md flex items-center justify-center">
                              <img
                                src={`http://localhost:8800/api/${image.path}`}
                                alt={`Image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white"
                                onClick={() => handleDelete(image.media_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-50 transition-colors">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to browse and upload an image
                        </p>

                        {/* Input field for file upload */}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer hidden"
                          required
                        />
                      </div>
                    </label>

                    {/* Display image preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
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
            <DialogDescription>
              Update your store details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={storeCategory} onValueChange={setStoreCategory}>
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
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Opening Hours</Label>
              <Input
                id="hours"
                placeholder="Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <DialogDescription>
              Create a new promotion for your store
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPromotion}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="promo-name">Promotion Name</Label>
                <Input
                  id="promo-name"
                  placeholder="Summer Sale"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-desc">Description</Label>
                <Textarea
                  id="promo-desc"
                  placeholder="Get 20% off on all items"
                  value={descriptionPromotions}
                  onChange={(e) => setDescriptionPromotions(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount"
                    placeholder="20"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <Select
                    value={discountType}
                    onValueChange={(val) => setDiscountType(val)}
                  >
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
              <Button
                variant="outline"
                onClick={() => setShowPromoDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Promotion</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
