'use client';

import { useEffect, useState } from 'react';
import {
  Percent,
  Calendar,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
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

type Promotion = {
  promotion_id: number;
  title: string;
  startDate: string;
  endDate: string;
  discountType: string;
  discount: string;
  description?: string; // optional
  storeOwner_id: number;
  status: string;
};
export default function PromotionsManagement() {
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [promoToDelete, setPromoToDelete] = useState<any>(null);

  const [promotions, setPromotions] = useState<Promotion[]>([]); // Promotions state
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  const [promotionName, setPromotionName] = useState('');
  const [desc, setPromoDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('percent'); // default type
  const [status, setStatus] = useState('active'); // default status

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
      } else {
        // Create new promotion
        await axios.post('http://localhost:8800/api/promotions', promotionData);
        console.log('Promotion added successfully');
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

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo);
    setShowPromoDialog(true);
  };

  const handleDeletePromo = (promo: any) => {
    setPromoToDelete(promo);
    setShowDeleteDialog(true);
  };

  const confirmDeletePromo = () => {
    if (promoToDelete) {
      setPromotions(
        promotions.filter((promo) => promo.promotion_id !== promoToDelete.id),
      );
      setShowDeleteDialog(false);
      setPromoToDelete(null);
    }
  };

  const handleSavePromo = () => {
    // In a real app, this would save to a database
    setShowPromoDialog(false);
    setEditingPromo(null);
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
                setEditingPromo(null);
                setShowPromoDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Promotion
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <Card key={promo.promotion_id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{promo.title}</CardTitle>
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
                    <span>{promo.discount} Discount</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditPromo(promo)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeletePromo(promo)}
                    >
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
                <DialogTitle>
                  {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
                </DialogTitle>
                <DialogDescription>
                  {editingPromo
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
                  {editingPromo ? 'Save Changes' : 'Add Promotion'}
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
