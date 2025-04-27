"use client"

import { useState } from "react"
import { Percent, Calendar, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { dummyStores } from "@/lib/dummy-data"
import StoreOwnerSidebar from "@/components/store-owner/store-owner-sidebar"

// For demo purposes, we'll assume the store owner owns the first store
const OWNER_STORE = dummyStores[0]

// Create dummy promotions
const dummyPromotions = [
  {
    id: "promo1",
    name: "Happy Hour 4-6PM",
    description: "Get 20% off on all beverages between 4PM and 6PM",
    discountType: "percent",
    discountValue: 20,
    startDate: "2023-04-01",
    endDate: "2023-06-30",
    status: "active",
  },
  {
    id: "promo2",
    name: "10% Off for Students",
    description: "Students get 10% off with valid ID",
    discountType: "percent",
    discountValue: 10,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "active",
  },
]

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState(dummyPromotions)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingPromo, setEditingPromo] = useState<any>(null)
  const [promoToDelete, setPromoToDelete] = useState<any>(null)

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo)
    setShowPromoDialog(true)
  }

  const handleDeletePromo = (promo: any) => {
    setPromoToDelete(promo)
    setShowDeleteDialog(true)
  }

  const confirmDeletePromo = () => {
    if (promoToDelete) {
      setPromotions(promotions.filter((promo) => promo.id !== promoToDelete.id))
      setShowDeleteDialog(false)
      setPromoToDelete(null)
    }
  }

  const handleSavePromo = () => {
    // In a real app, this would save to a database
    setShowPromoDialog(false)
    setEditingPromo(null)
  }

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Promotions Management</h1>
              <p className="text-muted-foreground">Create and manage special offers for your store</p>
            </div>

            <Button
              onClick={() => {
                setEditingPromo(null)
                setShowPromoDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Promotion
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <Card key={promo.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{promo.name}</CardTitle>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {promo.startDate} to {promo.endDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-2">{promo.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Percent className="h-4 w-4" />
                    <span>{promo.discountValue}% Discount</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => handleEditPromo(promo)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePromo(promo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingPromo ? "Edit Promotion" : "Add New Promotion"}</DialogTitle>
                <DialogDescription>
                  {editingPromo ? "Update promotion details" : "Create a new special offer for your customers"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-name">Promotion Name</Label>
                  <Input id="promo-name" defaultValue={editingPromo?.name || ""} placeholder="Summer Sale" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-desc">Description</Label>
                  <Textarea
                    id="promo-desc"
                    defaultValue={editingPromo?.description || ""}
                    placeholder="Get 20% off on all items"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" defaultValue={editingPromo?.startDate || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" defaultValue={editingPromo?.endDate || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discount"
                      type="number"
                      defaultValue={editingPromo?.discountValue || ""}
                      placeholder="20"
                    />
                    <Select defaultValue={editingPromo?.discountType || "percent"}>
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={editingPromo?.status || "active"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePromo}>{editingPromo ? "Save Changes" : "Add Promotion"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Delete Promotion
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{promoToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeletePromo} className="bg-destructive text-destructive-foreground">
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

