"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dummyStores } from "@/lib/dummy-data"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function StoreOwnersManagement() {
  const [storeOwners, setStoreOwners] = useState(
    dummyStores.map((store) => ({
      id: `owner-${store.id}`,
      name: `${store.name.replace("Cafe", "").replace("Market", "").trim()} Owner`,
      email: `${store.name.toLowerCase().replace(/\s/g, "")}@example.com`,
      phone: "(555) 123-4567",
      storeId: store.id,
      storeName: store.name,
      status: "active",
    })),
  )

  const [showOwnerDialog, setShowOwnerDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingOwner, setEditingOwner] = useState<any>(null)
  const [ownerToDelete, setOwnerToDelete] = useState<any>(null)

  const handleEditOwner = (owner: any) => {
    setEditingOwner(owner)
    setShowOwnerDialog(true)
  }

  const handleDeleteOwner = (owner: any) => {
    setOwnerToDelete(owner)
    setShowDeleteDialog(true)
  }

  const confirmDeleteOwner = () => {
    if (ownerToDelete) {
      setStoreOwners(storeOwners.filter((owner) => owner.id !== ownerToDelete.id))
      setShowDeleteDialog(false)
      setOwnerToDelete(null)
    }
  }

  const handleSaveOwner = () => {
    // In a real app, this would save to a database
    setShowOwnerDialog(false)
    setEditingOwner(null)
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Store Owners Management</h1>
              <p className="text-muted-foreground">Manage all store owners in the mall</p>
            </div>

            <Button
              onClick={() => {
                setEditingOwner(null)
                setShowOwnerDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Store Owner
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Store Owners</CardTitle>
              <CardDescription>View and manage all store owners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeOwners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell className="font-medium">{owner.name}</TableCell>
                        <TableCell>{owner.storeName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{owner.email}</span>
                            <span className="text-xs text-muted-foreground">{owner.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditOwner(owner)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteOwner(owner)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Dialog open={showOwnerDialog} onOpenChange={setShowOwnerDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingOwner ? "Edit Store Owner" : "Add New Store Owner"}</DialogTitle>
                <DialogDescription>
                  {editingOwner ? "Update store owner information" : "Add a new store owner to the mall"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={editingOwner?.name || ""} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store">Store</Label>
                    <Select defaultValue={editingOwner?.storeId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyStores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={editingOwner?.email || ""}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={editingOwner?.phone || ""} placeholder="(555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select defaultValue={editingOwner?.status || "active"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={editingOwner ? "Leave blank to keep current password" : "Create a password"}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowOwnerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveOwner}>{editingOwner ? "Save Changes" : "Add Store Owner"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Delete Store Owner
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{ownerToDelete?.name}"? This action cannot be undone and will remove
                  their store access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteOwner} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

