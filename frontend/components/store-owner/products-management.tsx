"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, AlertCircle, DollarSign, FileText } from "lucide-react"
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
import { dummyMenuItems } from "@/lib/dummy-data"
import StoreOwnerSidebar from "@/components/store-owner/store-owner-sidebar"

export default function ProductsManagement() {
  const [products, setProducts] = useState(dummyMenuItems)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productToDelete, setProductToDelete] = useState<any>(null)

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowProductDialog(true)
  }

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete.id))
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  }

  const handleSaveProduct = () => {
    // In a real app, this would save to a database
    setShowProductDialog(false)
    setEditingProduct(null)
  }

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Products Management</h1>
              <p className="text-muted-foreground">Manage all products in your store</p>
            </div>

            <Button
              onClick={() => {
                setEditingProduct(null)
                setShowProductDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{product.name}</CardTitle>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />${product.price.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{product.description}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Update product information" : "Add a new product to your store"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" defaultValue={editingProduct?.name || ""} placeholder="Delicious Burger" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue={editingProduct?.category || "Main"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main">Main</SelectItem>
                        <SelectItem value="Side">Side</SelectItem>
                        <SelectItem value="Beverage">Beverage</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={editingProduct?.description || ""}
                    placeholder="Describe your product"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price || ""}
                      placeholder="9.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input
                      id="inventory"
                      type="number"
                      defaultValue={editingProduct?.inventory || "100"}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag and drop image here or click to browse</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct}>{editingProduct ? "Save Changes" : "Add Product"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Delete Product
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteProduct}
                  className="bg-destructive text-destructive-foreground"
                >
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

