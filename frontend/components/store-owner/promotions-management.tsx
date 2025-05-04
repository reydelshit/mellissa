'use client';

import { useEffect, useState } from 'react';
import {
  Percent,
  Calendar,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Tag,
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
import { dummyStores } from '@/lib/dummy-data';
import StoreOwnerSidebar from '@/components/store-owner/store-owner-sidebar';
import axios from 'axios';
import { toast } from 'sonner';

type Promotion = {
  promotion_id: number;
  title: string;
  startDate: string;
  endDate: string;
  discountType: string;
  discount: string;
  description: string; // optional
  storeOwner_id: number;
  status: string;
};
export default function PromotionsManagement() {
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<any>(null);

  const [promotions, setPromotions] = useState<Promotion[]>([]); // Promotions state
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  const [promotionName, setPromotionName] = useState(
    editingPromotion?.title || '',
  );
  const [desc, setPromoDesc] = useState(editingPromotion?.description || '');
  const [startDate, setStartDate] = useState(editingPromotion?.startDate || '');
  const [endDate, setEndDate] = useState(editingPromotion?.endDate || '');
  const [discountValue, setDiscountValue] = useState(
    editingPromotion?.discount || '',
  );
  const [discountType, setDiscountType] = useState(
    editingPromotion?.discountType || 'percent',
  );
  const [status, setStatus] = useState(editingPromotion?.status || 'active');

  const [promoID, setPromoID] = useState<number | undefined>(undefined);

  const storeOwnerID = localStorage.getItem('store_owner_id') || '';

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchPromotions()]);
  }, []);

  useEffect(() => {
    if (editingPromotion) {
      setPromotionName(editingPromotion.title);
      setPromoDesc(editingPromotion.description || '');
      setStartDate(editingPromotion.startDate);
      setEndDate(editingPromotion.endDate);
      setDiscountValue(editingPromotion.discount);
      setDiscountType(editingPromotion.discountType);
      setStatus(editingPromotion.status);
    }
  }, [editingPromotion]);

  const handleSavePromotion = async () => {
    try {
      const promotionData = {
        title: promotionName,
        discount: discountValue,
        discountType,
        description: desc,
        storeOwner_id: storeOwnerID,
        status,
        startDate: startDate,
        endDate: endDate,
      };

      if (editingPromotion) {
        // Update existing promotion
        await axios.put(
          `http://localhost:8800/api/promotions/${editingPromotion.promotion_id}`,
          promotionData,
        );
        console.log('Promotion updated successfully');

        toast('Promotion updated successfully!');
      } else {
        // Create new promotion
        await axios.post(
          'http://localhost:8800/api/promotions/create',
          promotionData,
        );
        console.log('Promotion added successfully');

        toast('Promotion added successfully!');
      }

      fetchPromotions(); // Refresh promotions list
      setPromotionName('');
      setDiscountValue('');
      setStartDate('');
      setEndDate('');
      setEditingPromotion(null);

      setShowPromoDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleEditPromo = (promo: Promotion) => {
    setEditingPromotion(promo);
    setShowPromoDialog(true);
  };

  const handleDeletePromo = (promo: Promotion) => {
    setPromoToDelete(promo);
    setShowDeleteDialog(true);
    setPromoID(promo.promotion_id);
  };

  const confirmDeletePromo = async () => {
    if (promoToDelete) {
      setShowDeleteDialog(false);
      setPromoToDelete(null);

      try {
        await axios.delete(`http://localhost:8800/api/promotions/${promoID}`);

        fetchPromotions();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen">
      <StoreOwnerSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Promotions Management</h1>
              <p className="text-muted-foreground">
                Create and manage special offers for your store
              </p>
            </div>

            <Button
              onClick={() => {
                if (editingPromotion) {
                  setEditingPromotion(null);

                  setPromotionName('');
                  setPromoDesc('');
                  setStartDate('');
                  setEndDate('');
                  setDiscountValue('');
                  setDiscountType('percent');
                  setStatus('active');
                }

                setShowPromoDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Promotion
            </Button>
          </div>

          <div className="mt-8">
            {promotions.filter(
              (promo) => String(promo.storeOwner_id) === storeOwnerID,
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions
                  .filter(
                    (promo) => String(promo.storeOwner_id) === storeOwnerID,
                  )
                  .map((promo) => (
                    <div
                      key={promo.promotion_id}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      {/* Colored header based on status */}
                      <div
                        className={`px-5 py-4 border-b ${
                          promo.status === 'active'
                            ? 'bg-green-50 border-green-100'
                            : promo.status === 'scheduled'
                            ? 'bg-blue-50 border-blue-100'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-medium text-gray-900">
                            {promo.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              promo.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : promo.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {promo.status.charAt(0).toUpperCase() +
                              promo.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center mt-1.5 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1.5" />
                          {formatDate(promo.startDate)} -{' '}
                          {formatDate(promo.endDate)}
                        </div>
                      </div>

                      {/* Promotion details */}
                      <div className="p-5">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                          {promo.description}
                        </p>

                        <div className="flex items-center text-indigo-600 font-medium">
                          <Percent className="h-4 w-4 mr-2" />
                          <span>{promo.discount} discount</span>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => handleEditPromo(promo)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeletePromo(promo)}
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
                  <Tag className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No promotions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 mb-6">
                    Get started by creating your first promotional campaign
                  </p>
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Promotion
                  </button>
                </div>
              </div>
            )}
          </div>
          <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
                </DialogTitle>
                <DialogDescription>
                  {editingPromotion
                    ? 'Update promotion details'
                    : 'Create a new special offer for your customers'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="promo-name">Promotion Name</Label>
                  <Input
                    id="promo-name"
                    value={promotionName}
                    onChange={(e) => setPromotionName(e.target.value)}
                    placeholder="Summer Sale"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-desc">Description</Label>
                  <Textarea
                    id="promo-desc"
                    value={desc}
                    onChange={(e) => setPromoDesc(e.target.value)}
                    placeholder="Get 20% off on all items"
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
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="20"
                    />
                    <Select
                      value={discountType}
                      onValueChange={setDiscountType}
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
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
                <Button
                  variant="outline"
                  onClick={() => setShowPromoDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePromotion}>
                  {editingPromotion ? 'Save Changes' : 'Add Promotion'}
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
                  Delete Promotion
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{promoToDelete?.name}"? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeletePromo}
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
