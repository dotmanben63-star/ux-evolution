import React, { useState, useEffect } from 'react';
import { Item, Category } from '@/types';
import { initialItems } from '@/lib/initialData';
import { ItemCard } from './ItemCard';
import { StatsDashboard } from './StatsDashboard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Filter, SortAsc, LayoutGrid, List, RefreshCw, Archive } from 'lucide-react';
import { Dialog, DialogTrigger } from './ui/dialog';
import { ItemForm } from './ItemForm';
import * as Sonner from 'sonner';

export const ItemsGallery: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'rating' | 'date'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('curator_items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(initialItems);
      }
    } else {
      setItems(initialItems);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('curator_items', JSON.stringify(items));
    }
  }, [items]);

  const handleSaveItem = (itemData: Omit<Item, 'id' | 'createdAt'> & { id?: string }) => {
    if (itemData.id) {
      // Update
      setItems(prev => prev.map(item => 
        item.id === itemData.id 
          ? { ...item, ...itemData } 
          : item
      ));
      Sonner.toast.success('Item updated successfully');
    } else {
      // Create
      const newItem: Item = {
        ...itemData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      setItems(prev => [newItem, ...prev]);
      Sonner.toast.success('New item added to collection');
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    Sonner.toast.info('Item removed from collection');
  };

  const resetToDefaults = () => {
    setItems(initialItems);
    localStorage.setItem('curator_items', JSON.stringify(initialItems));
    Sonner.toast.success('Collection reset to defaults');
  };

  const exportCollection = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curator-collection-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    Sonner.toast.success('Collection exported');
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase()) ||
                           item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Curator
          </h1>
          <p className="text-muted-foreground">Manage and showcase your personal collection with style.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={resetToDefaults} title="Reset to Defaults">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportCollection} title="Export Collection">
            <Archive className="w-4 h-4" />
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </DialogTrigger>
            <ItemForm 
              onSave={handleSaveItem} 
              onClose={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }} 
              editingItem={editingItem}
            />
          </Dialog>
        </div>
      </div>

      <StatsDashboard items={items} />

      <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-md border border-border rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search items, tags, descriptions..." 
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={categoryFilter} onValueChange={(val: any) => setCategoryFilter(val)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Reading">Reading</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="value">Highest Value</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md p-1 bg-muted/50">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }>
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onEdit={(item) => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-1">No items found</h3>
          <p className="text-muted-foreground max-w-xs">
            Try adjusting your search or filters, or add a new item to your collection.
          </p>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
