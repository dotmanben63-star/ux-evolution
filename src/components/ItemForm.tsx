import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Category, Item } from '@/types';
import { fileToBase64, compressImage } from '@/lib/image-utils';
import { ImagePlus, Loader2, X } from 'lucide-react';
import * as Sonner from 'sonner';

interface ItemFormProps {
  onSave: (item: Omit<Item, 'id' | 'createdAt'> & { id?: string }) => void;
  editingItem?: Item | null;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Electronics', 'Lifestyle', 'Home', 'Reading', 'Other'];

export const ItemForm: React.FC<ItemFormProps> = ({ onSave, editingItem, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    category: editingItem?.category || 'Other' as Category,
    description: editingItem?.description || '',
    tags: editingItem?.tags.join(', ') || '',
    value: editingItem?.value || 0,
    rating: editingItem?.rating || 5,
    image: editingItem?.image || '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      Sonner.toast.error("File is too large. Max 10MB allowed.");
      return;
    }

    try {
      setLoading(true);
      const base64 = await fileToBase64(file);
      const compressed = await compressImage(base64);
      setFormData(prev => ({ ...prev, image: compressed }));
      Sonner.toast.success("Image processed successfully");
    } catch (error) {
      Sonner.toast.error("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      Sonner.toast.error("Name and Image are required");
      return;
    }

    onSave({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      id: editingItem?.id,
    });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Item Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Vintage Camera" 
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val: Category) => setFormData(prev => ({ ...prev, category: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="value">Est. Value ($)</Label>
            <Input 
              id="value" 
              type="number"
              step="0.01"
              value={formData.value}
              onChange={e => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Tell us more about this item..."
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input 
            id="tags" 
            placeholder="tech, vintage, gift" 
            value={formData.tags}
            onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label>Item Picture</Label>
          <div className="flex flex-col gap-4">
            {formData.image ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload picture</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Or paste image URL</Label>
              <Input 
                id="imageUrl" 
                placeholder="https://images.unsplash.com/..." 
                value={formData.image}
                onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {editingItem ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
