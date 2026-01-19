"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Utensils, 
  Clock, 
  Check,
  Search,
  X, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; 
import { toast, Toaster } from "sonner";
import { submitComboOrder } from "@/app/actions/staff"; 
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- TYPES ---
type MenuItem = { 
  id: string; 
  name: string; 
  category: string; 
  price: number; 
  isSoldOut: boolean; 
  images: string[];
  description?: string;
};

type OrderData = { 
  id: string; 
  status: string; 
  items: { name: string; price: number; quantity: number }[];
  note?: string;
} | null;

interface TodaysMenuProps {
  menuData: { items: MenuItem[]; cutoffTime: string } | null;
  existingOrder: OrderData;
  userId: string; 
}

// --- SUB-COMPONENTS ---

const StatusBadge = ({ closed, time }: { closed: boolean, time: string }) => (
  <div className={cn(
    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide border",
    closed 
      ? "bg-red-50 text-red-700 border-red-200" 
      : "bg-emerald-50 text-emerald-700 border-emerald-200"
  )}>
    <Clock className="w-3.5 h-3.5" />
    <span>{closed ? "CLOSED" : `ORDER BY ${time}`}</span>
  </div>
);

// --- MAIN COMPONENT ---

export function TodaysMenu({ menuData, existingOrder, userId }: TodaysMenuProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); 
  
  // State
  const [isComboMode, setIsComboMode] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [specialNote, setSpecialNote] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filters & Search
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic
  const isAfterCutoff = () => {
    if (!menuData) return false;
    const now = new Date();
    const [hours, minutes] = menuData.cutoffTime.split(":").map(Number);
    const cutoff = new Date();
    cutoff.setHours(hours, minutes, 0);
    return now > cutoff;
  };

  const kitchenClosed = isAfterCutoff();

  // Derive Data
  const categories = useMemo(() => {
    if (!menuData?.items) return ["All"];
    const uniqueCats = new Set(menuData.items.map(item => item.category));
    return ["All", ...Array.from(uniqueCats)];
  }, [menuData]);

  const filteredItems = useMemo(() => {
    if (!menuData?.items) return [];
    
    return menuData.items.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuData, activeCategory, searchQuery]);

  // Handlers
  const toggleCartItem = (item: MenuItem) => {
    if (cart.find(i => i.id === item.id)) {
      setCart(prev => prev.filter(i => i.id !== item.id));
    } else {
      setCart(prev => [...prev, item]);
    }
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  const handleSubmit = async (itemsToSubmit: MenuItem[], note: string = "") => {
    setIsSubmitting(true);
    try {
      const payload = itemsToSubmit.map(i => ({ foodId: i.id, quantity: 1 }));
      const result = await submitComboOrder(userId, payload, note);
      
      if (result.success) {
        toast.success("Order Placed", { description: "Kitchen has received your ticket." });
        setSelectedItem(null);
        setIsCartOpen(false);
        setCart([]);
        setSpecialNote("");
      } else {
        toast.error("Order Failed", { description: "Please try again." });
      }
    } catch (e) {
      toast.error("Connection Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fixed Navigation Handlers
  const nextImage = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    if (selectedItem && selectedItem.images.length > 0) {
      setCurrentImageIndex((p) => (p + 1) % selectedItem.images.length); 
    }
  };
  
  const prevImage = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    if (selectedItem && selectedItem.images.length > 0) {
      setCurrentImageIndex((p) => (p - 1 + selectedItem.images.length) % selectedItem.images.length); 
    }
  };

  // --- RENDERING ---

  // 1. Offline State
  if (!menuData || menuData.items.length === 0) {
    return (
      <div className=" flex-col items-center justify-center min-h-[50vh] text-center px-4 border rounded-lg border-dashed border-gray-200 bg-gray-50/50">
        <div className="w-16 h-16 bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center mb-4">
          <Utensils className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Menu Offline</h3>
        <p className="text-gray-500 mt-1 text-sm">The daily selection hasn't been published yet.</p>
      </div>
    );
  }

  // 2. Existing Order View
  if (existingOrder) {
    return (
      <div className="flex justify-center items-start pt-12 min-h-[60vh] p-4">
        <Card className="w-full max-w-md border border-gray-200 shadow-sm bg-white overflow-hidden rounded-lg">
          <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-md flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
               <h2 className="text-lg font-bold text-gray-900">Confirmed</h2>
               <p className="text-xs text-gray-500 font-mono">ID: {existingOrder.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              {existingOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <Badge variant="outline" className="rounded-md font-mono bg-white text-gray-600">x{item.quantity}</Badge>
                </div>
              ))}
            </div>
            {existingOrder.note && (
              <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                <p className="text-xs text-blue-700 font-semibold mb-1">Kitchen Note:</p>
                <p className="text-sm text-gray-700">{existingOrder.note}</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-500">Current Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                {existingOrder.status}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Main Menu
  return (
    <div className="pb-32 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md pb-4 pt-2 border-b border-gray-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Corporate Dining</h1>
              <p className="text-sm text-gray-500">Select your meal for today.</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge closed={kitchenClosed} time={menuData.cutoffTime} />
              {/* Segmented Control for Mode */}
              <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                 <button 
                  onClick={() => { setIsComboMode(false); setCart([]); }}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                    !isComboMode ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"
                  )}
                 >
                   Standard
                 </button>
                 <button 
                  onClick={() => setIsComboMode(true)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                    isComboMode ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"
                  )}
                 >
                   Special Order
                 </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
              />
              {searchQuery && (
                 <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                   <X className="h-3 w-3" />
                 </button>
              )}
            </div>

            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide items-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all border",
                      activeCategory === category
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {kitchenClosed && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-900">Kitchen is closed. New orders cannot be placed.</span>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const isSelected = cart.some(i => i.id === item.id);
          const isDisabled = item.isSoldOut || kitchenClosed;

          return (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full",
                isSelected && "ring-1 ring-black border-black",
                isDisabled && "opacity-60 bg-gray-50 cursor-not-allowed"
              )}
            >
              {/* Image Section */}
              <div 
                className="aspect-[16/10] relative overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (isDisabled) return;
                  if (isComboMode) toggleCartItem(item);
                  else { setSelectedItem(item); setCurrentImageIndex(0); setSpecialNote(""); }
                }}
              >
                {item.images?.length > 0 ? (
                  <Image 
                    src={item.images[0]} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Utensils className="w-8 h-8" />
                  </div>
                )}
                
                {item.isSoldOut && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-red-600 font-bold border-2 border-red-600 px-3 py-1 text-xs tracking-widest uppercase rounded-sm -rotate-12">Sold Out</span>
                  </div>
                )}

                {/* Selection Checkmark */}
                <div className={cn(
                  "absolute top-2 right-2 transition-all duration-200",
                  isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}>
                  <div className="bg-black text-white p-1 rounded-full shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 leading-snug pr-2 text-sm md:text-base">{item.name}</h3>
                  <span className="font-mono text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-sm">₵{item.price}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{item.description}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDisabled) return;
                    if (isComboMode) toggleCartItem(item);
                    else { setSelectedItem(item); setCurrentImageIndex(0); setSpecialNote(""); }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "w-full py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors border",
                    isSelected 
                      ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" 
                      : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  {isSelected ? "Remove" : "Place Order"}
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center">
             <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-900 font-medium">No items found</p>
             <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* --- COMBO BAR (Sticky Bottom) --- */}
      <AnimatePresence>
        {isComboMode && cart.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-72 rounded-sm right-20 z-50 bg-white border border-gray-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-900 text-white w-10 h-10 rounded-md flex items-center justify-center">
                  <span className="font-mono font-bold text-sm">{cart.length}</span>
                </div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Total Estimate</p>
                   <p className="text-xl font-bold text-gray-900">₵{cartTotal.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                 <Button variant="ghost" onClick={() => setCart([])} className="text-red-600 hover:text-red-700 hover:bg-red-50">Clear</Button>
                 <Button 
                   onClick={() => setIsCartOpen(true)} 
                   className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-8"
                 >
                   Review Order
                 </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL 1: SINGLE ITEM DETAILS --- */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
              {/* Left: Image */}
              <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto group">
                 {selectedItem.images?.length > 0 ? (
                   <Image src={selectedItem.images[currentImageIndex]} alt={selectedItem.name} fill className="object-cover" />
                 ) : (
                   <div className="flex items-center justify-center h-full"><Utensils className="w-12 h-12 text-gray-300" /></div>
                 )}
                 
                 {/* NAVIGATION ARROWS AND DOTS */}
                 {selectedItem.images.length > 1 && (
                   <>
                     {/* Left Arrow */}
                     <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all z-10"
                     >
                       <ChevronLeft className="w-5 h-5" />
                     </button>

                     {/* Right Arrow */}
                     <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all z-10"
                     >
                       <ChevronRight className="w-5 h-5" />
                     </button>

                     {/* Dots Overlay */}
                     <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                       {selectedItem.images.map((_, i) => (
                         <div key={i} className={cn("w-2 h-2 rounded-full transition-all shadow-sm", i === currentImageIndex ? "bg-white" : "bg-white/40")} />
                       ))}
                     </div>
                   </>
                 )}
                 
                 <DialogClose className="md:hidden absolute top-4 right-4 bg-black/50 text-white rounded-md p-1 z-20"><X className="w-4 h-4"/></DialogClose>
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col p-6 md:p-8">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge variant="secondary" className="mb-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-100 font-normal">{selectedItem.category}</Badge>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                      </div>
                      <span className="text-xl font-mono text-gray-900">₵{selectedItem.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedItem.description || "No description provided."}</p>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Special Instructions
                      </label>
                      <Textarea 
                        placeholder="Add a note for the kitchen..." 
                        className="resize-none bg-gray-50 border-gray-200 focus:border-gray-400 rounded-md min-h-[100px] text-sm"
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <Button 
                      onClick={() => handleSubmit([selectedItem], specialNote)} 
                      disabled={isSubmitting} 
                      className="w-full h-11 rounded-md bg-gray-900 hover:bg-gray-800 text-white font-medium"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Confirm Order"}
                    </Button>
                  </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: COMBO SUMMARY --- */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <DialogTitle className="text-lg font-bold text-gray-900">Confirm Selection</DialogTitle>
               <DialogClose className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></DialogClose>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-1 bg-gray-50 p-4 rounded-md border border-gray-100">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-200/50 last:border-0">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-mono text-gray-900">₵{item.price}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">₵{cartTotal}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">Plating Instructions</label>
                    <Textarea 
                        placeholder="e.g. Sauce on the side..." 
                        className="bg-white border-gray-200 rounded-md text-sm"
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                    />
                </div>

                <Button 
                    onClick={() => handleSubmit(cart, specialNote)} 
                    disabled={isSubmitting} 
                    className="w-full h-11 rounded-md bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-sm"
                >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Submit Order"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-right" theme="light"/>
    </div>
  );
}