'use client';
import { Badge } from '@/components/ui/badge';
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
import DEFDEFSEC from '@/lib/DEFDEFSEC';
import PathContainer from '@/lib/PathContainer';
import PathLines from '@/lib/PathLines';
import PathLines2nd from '@/lib/PathLines2nd';
import { stallsGround, stallsSecond } from '@/lib/data';
import { dummyStores } from '@/lib/dummy-data';
import axios from 'axios';
import { Minus, PanelRightClose, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import { toast } from 'sonner';

type StoreOwner = {
  storeOwner_id: string;
  ownerName: string;
  storeName: string;
  email: string;
  phone: string;
  password: string;
  storeCategory: string;
  location: string;
  floor: string;
  size: string;
  created_at: string;
  stall_no: string;
};

type CustomerType = {
  user_id: string;
  fullname: string;
  email: string;
  created_at: string;
  role: string;
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  const [showAddOwnerDialog, setShowAddOwnerDialog] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [ownerName, setOwnerName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [storeCategory, setStoreCategory] = useState('retail');

  const [storeOwnersFromDB, setStoreOwners] = useState<StoreOwner[]>([]);
  const [customersFromDB, setCustomers] = useState<CustomerType[]>([]);

  const [showSecondFloor, setShowSecondFloor] = useState(false);
  const [selectedStalls, setSelectedStalls] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [stallDetails, setStallDetails] = useState({
    stall_no: '',
    floor: '',
    size: '',
  });

  const [stalls, setStalls] = useState<any[]>([]);

  // Create map markers from stores
  const storeMarkers = dummyStores.map((store, index) => {
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
  const availableSpaces = [
    {
      id: 'available1',
      name: 'Space 101',
      floor: 1,
      location: 'First Floor, North Wing',
      size: '1,200 sq ft',
      x: 50,
      y: 30,
      label: 'Available Space 101',
      color: 'bg-yellow-500',
    },
    {
      id: 'available2',
      name: 'Space 201',
      floor: 2,
      location: 'Second Floor, East Wing',
      size: '1,500 sq ft',
      x: 50,
      y: 60,
      label: 'Available Space 201',
      color: 'bg-yellow-500',
    },
    {
      id: 'available3',
      name: 'Space 102',
      floor: 1,
      location: 'First Floor, South Wing',
      size: '800 sq ft',
      x: 30,
      y: 70,
      label: 'Available Space 102',
      color: 'bg-yellow-500',
    },
  ];

  const availableSpaceMarkers = availableSpaces.map((space) => ({
    id: space.id,
    x: space.x,
    y: space.y,
    label: space.label,
    floor: space.floor,
    color: space.color,
  }));

  const allMarkers = [...storeMarkers, ...availableSpaceMarkers];

  const handleMapMarkerClick = (markerId: string) => {
    // Check if it's an available space
    const space = availableSpaces.find((space) => space.id === markerId);
    if (space) {
      setSelectedSpace(space);
      setShowAddOwnerDialog(true);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/store-owner');
      console.log(response.data);
      setStoreOwners(response.data);
    } catch (error) {
      console.error('Error fetching store owners:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/user');
      console.log(response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchStoreOwners(), fetchCustomers()]);
  }, []);

  // Filter store owners based on search query
  const filteredStoreOwners = storeOwnersFromDB.filter(
    (owner) =>
      owner.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.storeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter customers based on search query
  const filteredCustomers = customersFromDB.filter(
    (customer) =>
      customer.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddStoreOwner = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:8800/api/store-owner/create',
        {
          ownerName,
          storeName,
          email,
          phone,
          password,
          storeCategory,
          location:
            stallDetails?.floor === '1' ? 'Ground Floor' : 'Second Floor',
          floor: stallDetails?.floor,
          size: stallDetails?.size,
          stall_no: stallDetails?.stall_no,
        },
      );

      console.log(res.data);

      toast('Store owner added successfully!');

      // Reset form fields
      setOwnerName('');
      setStoreName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setStoreCategory('retail');
      setShowAddOwnerDialog(false);
      setSelectedSpace(null);
      setSelectedStalls('');
      setStallDetails({
        stall_no: '',
        floor: '',
        size: '',
      });

      fetchStoreOwners(); // Refresh store owners list
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add store owner');
    }
  };

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

  return (
    <div className="flex h-screen w-full">
      {/* <AdminSidebar /> */}
      <div className="flex-1 overflow-auto w-full">
        <div className=" p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold"> Administration</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <Tabs
            defaultValue="map"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Mall Map</TabsTrigger>
              <TabsTrigger value="store-owners">Store Owners</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="pt-4 relative">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Mall Map</CardTitle>
                  <CardDescription>
                    View all stores and available spaces. Click on yellow
                    markers to add new store owners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                                let fillColor = '#22c55e'; // Default to blue (occupied)

                                const stallData = stalls.find(
                                  (s) =>
                                    String(s.stall_no) === String(stall.id),
                                );

                                if (stallData) {
                                  fillColor = '#3b82f6 '; // Green (available)
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
                                      setShowAddOwnerDialog(true);
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
                                let fillColor = '#222831'; // Default to blue (occupied)

                                const stallData = storeOwnersFromDB.find(
                                  (s) =>
                                    String(s.stall_no) === String(stall.id),
                                );

                                if (stallData) {
                                  fillColor = '#eab308  '; // Green (available)
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
                                      setShowAddOwnerDialog(true);
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
                  <div className="mt-4 p-4 bg-muted rounded-lg absolute right-5 top-5 ">
                    <h3 className="font-medium mb-2">Map Legend</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span>Occupied Stores</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span>Available Spaces</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Tip:</span> Click on yellow
                      markers to add a new store owner. Use the floor tabs at
                      the bottom to navigate between floors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="store-owners" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Store Owners</CardTitle>
                    <CardDescription>
                      Manage all store owners in the mall
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedSpace(availableSpaces[0]);
                      setShowAddOwnerDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store Owner
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search store owners..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Store</div>
                      <div>Email</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>

                    {filteredStoreOwners.length > 0 ? (
                      filteredStoreOwners.map((owner) => (
                        <div
                          key={owner.storeOwner_id}
                          className="grid grid-cols-5 p-4 border-b last:border-0 items-center"
                        >
                          <div className="font-medium">{owner.ownerName}</div>
                          <div>{owner.storeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {owner.email}
                          </div>
                          <div>
                            <Badge variant="success">Active</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              Deactivate
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No store owners found matching your search.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>
                      View and manage customer accounts
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Orders</div>
                      <div>Last Order</div>
                      <div>Actions</div>
                    </div>

                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.user_id}
                          className="grid grid-cols-5 p-4 border-b last:border-0 items-center"
                        >
                          <div className="font-medium">{customer.fullname}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                          {/* <div>{customer.orders}</div>
                          <div>{customer.lastOrder}</div> */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              Deactivate
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No customers found matching your search.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Store Owner Dialog */}
      <Dialog open={showAddOwnerDialog} onOpenChange={setShowAddOwnerDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Add Store Owner for{' '}
              <span className="bg-black p-2 rounded-sm text-white">
                {selectedStalls}
              </span>
            </DialogTitle>
            <DialogDescription>
              Assign a store owner to this space and provide their account
              credentials
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStoreOwner} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner Name</Label>
                <Input
                  id="owner-name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-category">Store Category</Label>
                <Select value={storeCategory} onValueChange={setStoreCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Space Information</Label>
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Location:</span>{' '}
                    {stallDetails?.floor === '1'
                      ? 'Ground Floor'
                      : 'Second Floor'}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>{' '}
                    {stallDetails?.size}
                  </div>
                  <div>
                    <span className="font-medium">Floor:</span>{' '}
                    {stallDetails?.floor}
                  </div>
                  <div>
                    <span className="font-medium">Space ID:</span>{' '}
                    {stallDetails?.stall_no}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddOwnerDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Store Owner</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
