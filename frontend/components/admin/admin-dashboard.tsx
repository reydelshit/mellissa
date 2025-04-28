"use client"
import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyStores } from "@/lib/dummy-data"
import AdminSidebar from "@/components/admin/admin-sidebar"
import InteractiveMap from "@/components/map/interactive-map"
import axios from "axios"
import { toast } from "sonner"


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
};

type CustomerType = {
  user_id: string;
  fullname: string;
  email: string;
  created_at: string;
  role: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("map")
  const [showAddOwnerDialog, setShowAddOwnerDialog] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")


  const [ownerName, setOwnerName] = useState("")
  const [storeName, setStoreName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [storeCategory, setStoreCategory] = useState("retail")


  const [storeOwnersFromDB, setStoreOwners] = useState<StoreOwner[]>([])
  const [customersFromDB, setCustomers] = useState<CustomerType[]>([])

  // Create map markers from stores
  const storeMarkers = dummyStores.map((store, index) => {
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
  const availableSpaces = [
    {
      id: "available1",
      name: "Space 101",
      floor: 1,
      location: "First Floor, North Wing",
      size: "1,200 sq ft",
      x: 50,
      y: 30,
      label: "Available Space 101",
      color: "bg-yellow-500",
    },
    {
      id: "available2",
      name: "Space 201",
      floor: 2,
      location: "Second Floor, East Wing",
      size: "1,500 sq ft",
      x: 50,
      y: 60,
      label: "Available Space 201",
      color: "bg-yellow-500",
    },
    {
      id: "available3",
      name: "Space 102",
      floor: 1,
      location: "First Floor, South Wing",
      size: "800 sq ft",
      x: 30,
      y: 70,
      label: "Available Space 102",
      color: "bg-yellow-500",
    },
  ]

  const availableSpaceMarkers = availableSpaces.map((space) => ({
    id: space.id,
    x: space.x,
    y: space.y,
    label: space.label,
    floor: space.floor,
    color: space.color,
  }))

  const allMarkers = [...storeMarkers, ...availableSpaceMarkers]

  const handleMapMarkerClick = (markerId: string) => {
    // Check if it's an available space
    const space = availableSpaces.find((space) => space.id === markerId)
    if (space) {
      setSelectedSpace(space)
      setShowAddOwnerDialog(true)
    }
  }

  const fetchStoreOwners = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/store-owner")
      console.log(response.data)
      setStoreOwners(response.data)
    } catch (error) {
      console.error("Error fetching store owners:", error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/user")
      console.log(response.data)
      setCustomers(response.data)
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  useEffect(() => {
    Promise.all([fetchStoreOwners(), fetchCustomers()])
  }, []) 

  // const handleAddStoreOwner = () => {
  //   // In a real app, this would save the new store owner to the database
  //   setShowAddOwnerDialog(false)
  //   setSelectedSpace(null)
  //   // Show success message
  //   alert("Store owner added successfully!")
  // }

  // Create dummy store owners for the list
  const storeOwners = dummyStores.map((store) => ({
    id: `owner-${store.id}`,
    name: `${store.name.replace("Cafe", "").replace("Market", "").trim()} Owner`,
    email: `${store.name.toLowerCase().replace(/\s/g, "")}@example.com`,
    phone: "(555) 123-4567",
    storeId: store.id,
    storeName: store.name,
    status: "active",
  }))

  // Create dummy customers for the list
  const customers = [
    { id: "cust1", name: "John Smith", email: "john.smith@example.com", orders: 5, lastOrder: "2023-04-01" },
    { id: "cust2", name: "Jane Doe", email: "jane.doe@example.com", orders: 3, lastOrder: "2023-03-28" },
    { id: "cust3", name: "Bob Johnson", email: "bob.johnson@example.com", orders: 7, lastOrder: "2023-04-02" },
    { id: "cust4", name: "Alice Williams", email: "alice.williams@example.com", orders: 2, lastOrder: "2023-03-25" },
    { id: "cust5", name: "Charlie Brown", email: "charlie.brown@example.com", orders: 4, lastOrder: "2023-03-30" },
  ]

  // Filter store owners based on search query
  const filteredStoreOwners = storeOwnersFromDB.filter(
    (owner) =>
      owner.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.storeName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter customers based on search query
  const filteredCustomers = customersFromDB.filter(
    (customer) =>
      customer.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  
  const handleAddStoreOwner = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const res = await axios.post("http://localhost:8800/api/store-owner/create", {
        ownerName,
        storeName,
        email,
        phone,
        password,
        storeCategory,
        location: selectedSpace?.location,
        floor: selectedSpace?.floor,
        size: selectedSpace?.size,
      })


      console.log(res.data)
  
      // toast.success("Store owner added successfully!")
      // setShowAddOwnerDialog(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add store owner")
    }
  }

  
  return (
    <div className="flex h-screen w-full">
      {/* <AdminSidebar /> */}
      <div className="flex-1 overflow-auto w-full">
        <div className=" p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold"> Administration</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Mall Map</TabsTrigger>
              <TabsTrigger value="store-owners">Store Owners</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Mall Map</CardTitle>
                  <CardDescription>
                    View all stores and available spaces. Click on yellow markers to add new store owners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InteractiveMap markers={allMarkers} onMarkerClick={handleMapMarkerClick} />
                  <div className="mt-4 p-4 bg-muted rounded-lg">
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
                      <span className="font-medium">Tip:</span> Click on yellow markers to add a new store owner. Use
                      the floor tabs at the bottom to navigate between floors.
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
                    <CardDescription>Manage all store owners in the mall</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedSpace(availableSpaces[0])
                      setShowAddOwnerDialog(true)
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
                        <div key={owner.storeOwner_id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                          <div className="font-medium">{owner.ownerName}</div>
                          <div>{owner.storeName}</div>
                          <div className="text-sm text-muted-foreground">{owner.email}</div>
                          <div>
                            <Badge variant="success">Active</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
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
                    <CardDescription>View and manage customer accounts</CardDescription>
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
                        <div key={customer.user_id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                          <div className="font-medium">{customer.fullname}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          {/* <div>{customer.orders}</div>
                          <div>{customer.lastOrder}</div> */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
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
          <DialogTitle>Add Store Owner for {selectedSpace?.name}</DialogTitle>
          <DialogDescription>
            Assign a store owner to this space and provide their account credentials
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddStoreOwner} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner-name">Owner Name</Label>
              <Input id="owner-name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                  <span className="font-medium">Location:</span> {selectedSpace?.location}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {selectedSpace?.size}
                </div>
                <div>
                  <span className="font-medium">Floor:</span> {selectedSpace?.floor}
                </div>
                <div>
                  <span className="font-medium">Space ID:</span> {selectedSpace?.id}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddOwnerDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Store Owner</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  )
}

