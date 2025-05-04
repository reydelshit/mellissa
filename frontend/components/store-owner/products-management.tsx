'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  DollarSign,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { dummyMenuItems } from '@/lib/dummy-data';
import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
import axios from 'axios';
import { toast } from 'sonner';

type Product = {
  category: string;
  created_at: string; // or Date if you'll parse it
  description: string;
  inventory: number;
  price: number;
  product_id: number;
  product_image: string;
  product_name: string;
  storeOwner_id: number;
};

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const [name, setName] = useState(editingProduct?.product_name || '');
  const [category, setCategory] = useState(editingProduct?.category || 'Main');
  const [description, setDescription] = useState(
    editingProduct?.description || '',
  );
  const [price, setPrice] = useState(editingProduct?.price || 0);
  const [inventory, setInventory] = useState(editingProduct?.inventory || 100);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productID, setProductID] = useState<number | null>(null);

  const storeOwnerID = localStorage.getItem('store_owner_id') || '';

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/products');
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts()]);
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.product_name);
      setCategory(editingProduct.category);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setInventory(editingProduct.inventory);
      setImage(null); // Reset image on edit
    }
  }, [editingProduct]);

  const handleSaveProduct = async () => {
    try {
      // Create formData for the product
      const productData = new FormData();
      productData.append('product_name', name);
      productData.append('category', category);
      productData.append('description', description);
      productData.append('price', price.toString());
      productData.append('inventory', inventory.toString());
      productData.append('storeOwner_id', storeOwnerID);

      if (imageFile) {
        productData.append('product_image', imageFile);
      }

      if (editingProduct) {
        // If editing, update the product
        await axios.put(
          `http://localhost:8800/api/products/${editingProduct.product_id}`,
          productData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('Product updated successfully');

        toast('Product updated successfully!');
      } else {
        // If adding, create a new product
        await axios.post(
          'http://localhost:8800/api/products/upload',
          productData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Product added successfully');
        toast('Product added successfully!');
      }

      fetchProducts();
      setName('');
      setCategory('Main');
      setDescription('');
      setPrice(0);
      setInventory(100);
      setImage(null);
      setImageFile(null);

      setShowProductDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error saving product:', error);
      // Optionally show an error message
    }
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setImageFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
        // setErrorImage(null);
      } else {
        // setErrorImage('Please select a valid image file.');
        setImageFile(null);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
    setProductID(product.product_id);
  };

  const handleDeleteProduct = async (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
    setProductID(product.product_id);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      setProducts(
        products.filter((product) => product.product_id !== productToDelete.id),
      );
      setShowDeleteDialog(false);
      setProductToDelete(null);

      try {
        await axios.delete(`http://localhost:8800/api/products/${productID}`);

        fetchProducts();

        toast('Deleted product successfully!');
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  // const handleSaveProduct = () => {
  //   // In a real app, this would save to a database
  //   setShowProductDialog(false)
  //   setEditingProduct(null)
  // }

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Products Management</h1>
              <p className="text-muted-foreground">
                Manage all products in your store
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowProductDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
          <div className="mt-8">
            {products.filter(
              (prod) => String(prod.storeOwner_id) === storeOwnerID,
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer transition-all duration-200">
                {products
                  .filter((prod) => String(prod.storeOwner_id) === storeOwnerID)
                  .map((product) => (
                    <div
                      key={product.product_id}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      {/* Product image with consistent aspect ratio */}
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <img
                          src={`http://localhost:8800/api/${product.product_image}`}
                          alt={product.product_name}
                          className="object-cover w-full h-full"
                        />

                        {/* Category badge with subtle styling */}
                        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">
                          {product.category}
                        </span>
                      </div>

                      {/* Product details with appropriate spacing */}
                      <div className="p-5">
                        <div className="mb-3">
                          <h3 className="text-base font-medium text-gray-900">
                            {product.product_name}
                          </h3>
                          <div className="flex items-baseline mt-1">
                            <span className="text-lg font-semibold text-gray-900">
                              ₱{product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">
                          {product.description}
                        </p>

                        {/* Action buttons with professional styling */}
                        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="text-sm font-medium text-gray-500 hover:text-red-600 inline-flex items-center"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <div className="mx-auto max-w-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No products
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Get started by creating your first product
                  </p>
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            )}
          </div>

          <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? 'Update product information'
                    : 'Add a new product to your store'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Delicious Burger"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value)}
                    >
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      value={price}
                      onChange={(e) =>
                        setPrice(parseFloat(e.target.value) || 0)
                      }
                      placeholder="9.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={inventory}
                      onChange={(e) =>
                        setInventory(parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Image</Label>

                  {/* Display the selected image if available */}
                  {image && (
                    <div className="mb-4">
                      <img
                        src={image! ? image! : ''}
                        alt="Selected"
                        className="w-[100px] h-[100px] object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}

                  {/* File upload area */}
                  <div className="border-2 border-dashed rounded-md p-2 text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop image here or click to browse
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                    >
                      Upload Image
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleChangeImage}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowProductDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct}>
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Delete Product
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{productToDelete?.name}"?
                  This action cannot be undone.
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
  );
}
