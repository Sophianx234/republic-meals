"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { Plus, Search, Image as ImageIcon, Loader2, UtensilsCrossed, X, UploadCloud, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast, Toaster } from "sonner"
import { addFoodItem, deleteFoodItem, updateFoodItem } from "@/app/actions/restaurant"

type FoodItem = { _id: string; name: string; category: string; images?: string[]; description?: string }

const MAX_IMAGES = 5

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["Main", "Side", "Drink", "Snack"]),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function FoodCatalog({ initialFoods }: { initialFoods: FoodItem[] }) {
  const [foods, setFoods] = useState(initialFoods)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // --- EDIT STATE ---
  const [editingId, setEditingId] = useState<string | null>(null)

  // --- IMAGE STATE ---
  // files = NEW images selected from computer
  const [files, setFiles] = useState<File[]>([])
  // existingImages = URLs of images already in DB (for edit mode)
  const [existingImages, setExistingImages] = useState<string[]>([])
  // previewUrls = For previewing 'files'
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", category: "Main", description: "" },
  })

  // 1. Helper to Open Dialog for EDITING
  const startEdit = (food: FoodItem) => {
    setEditingId(food._id)
    form.reset({
      name: food.name,
      category: food.category as any,
      description: food.description || "",
    })
    setExistingImages(food.images || [])
    setFiles([])
    setNewImagePreviews([])
    setIsDialogOpen(true)
  }

  // 2. Helper to Open Dialog for ADDING
  const startAdd = () => {
    setEditingId(null)
    form.reset({ name: "", category: "Main", description: "" })
    setExistingImages([])
    setFiles([])
    setNewImagePreviews([])
    setIsDialogOpen(true)
  }

  // 3. Handle Dialog Close
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
       // slight delay to clear state after animation
       setTimeout(() => {
         setEditingId(null)
         form.reset()
         setFiles([])
         setExistingImages([])
         setNewImagePreviews([])
       }, 300)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check Limit: Existing Images + Current New Files + Added Files
    const totalImages = existingImages.length + files.length + acceptedFiles.length
    
    if (totalImages > MAX_IMAGES) {
      toast.error(`Total limit is ${MAX_IMAGES} images. You have ${existingImages.length + files.length} already.`)
      return
    }
    setFiles(prev => [...prev, ...acceptedFiles])
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
    setNewImagePreviews(prev => [...prev, ...newPreviews])
  }, [files, existingImages])

  // Remove NEWLY added file
  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Remove EXISTING URL (from DB)
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: true,
    disabled: (existingImages.length + files.length) >= MAX_IMAGES
  })

  // 4. SUBMIT HANDLER (Handles Add OR Update)
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    
    formData.append("name", data.name)
    formData.append("category", data.category)
    if (data.description) formData.append("description", data.description)
    
    // Append NEW files
    files.forEach(file => formData.append("new_images", file)) // Note key change

    let result;

    if (editingId) {
      // --- UPDATE MODE ---
      formData.append("id", editingId)
      // Append EXISTING URLs that weren't deleted
      existingImages.forEach(url => formData.append("existing_images", url)) 
      // Reuse "new_images" key for files inside updateFoodItem too
      
      result = await updateFoodItem(formData)
    } else {
      // --- ADD MODE ---
      // For add mode, we map "new_images" back to "images" or handle in server action
      // To keep it simple, let's just make sure addFoodItem looks for "new_images" or "images"
      // Or we just append as "images" for consistency if we update the server action
      // Let's stick to the server action update I wrote above which expects 'new_images' for update
      // But 'addFoodItem' expects 'images'. Let's conform:
      
      // Re-append for addFoodItem compatibility if needed, or update addFoodItem
      files.forEach(file => formData.append("images", file)) 
      result = await addFoodItem(formData)
    }

    if (result.success) {
      toast.success(editingId ? "Item updated!" : "Item added!")
      handleOpenChange(false)
    } else {
      toast.error(result.error || "Operation failed")
    }
  }

  // 5. DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    // Optimistic UI update (optional)
    setFoods(prev => prev.filter(f => f._id !== id))
    toast.info("Deleting...")

    const result = await deleteFoodItem(id)
    if (result.success) {
      toast.success("Item deleted")
    } else {
      toast.error("Failed to delete")
      // Revert optimistic update if needed or just reload
    }
  }

  const isSubmitting = form.formState.isSubmitting
  const totalCount = existingImages.length + files.length
  
  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Search menu..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9" 
            />
        </div>

        <Button onClick={startAdd} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Add New Dish
        </Button>
        
        {/* --- DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Dish" : "Add New Dish"}</DialogTitle>
                    <DialogDescription>
                        {editingId ? "Modify details or manage images." : "Add a dish to the library."}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-5 py-4">
                    <div className="space-y-2">
                        <Label>Dish Name <span className="text-red-500">*</span></Label>
                        <Input placeholder="e.g. Jollof Rice" {...form.register("name")} />
                        {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Controller
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Main">Main Dish</SelectItem>
                                        <SelectItem value="Side">Side</SelectItem>
                                        <SelectItem value="Drink">Drink</SelectItem>
                                        <SelectItem value="Snack">Snack</SelectItem>
                                    </SelectContent>
                                </Select>
                              )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            placeholder="Ingredients, spice level..." 
                            className="resize-none h-24"
                            {...form.register("description")}
                        />
                    </div>

                    {/* --- IMAGE UPLOAD & PREVIEW AREA --- */}
                    <div className="space-y-2">
                        <Label>Images ({totalCount}/{MAX_IMAGES})</Label>
                        
                        {/* Dropzone */}
                        <div 
                            {...getRootProps()} 
                            className={`
                                p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center
                                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
                                ${totalCount >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            <input {...getInputProps()} />
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <UploadCloud className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {totalCount >= MAX_IMAGES ? "Limit reached" : "Click or drag images"}
                                </p>
                            </div>
                        </div>

                        {/* Combined Grid: Existing Images + New Previews */}
                        {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                
                                {/* 1. Existing Images (from DB) */}
                                {existingImages.map((src, index) => (
                                    <div key={`exist-${index}`} className="relative aspect-square rounded-md overflow-hidden border group">
                                        <Image src={src} alt="Existing" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* 2. New File Previews */}
                                {newImagePreviews.map((src, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden border group border-blue-400">
                                        <Image src={src} alt="New" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {/* Badge to show it's new */}
                                        <div className="absolute bottom-0 w-full bg-blue-600 text-white text-[10px] text-center py-0.5">NEW</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                        {editingId ? "Save Changes" : "Create Item"}
                    </Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- FOOD LIST GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
  {filteredFoods.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
      <UtensilsCrossed className="w-10 h-10 mb-2 opacity-20" />
      <p>No items found.</p>
    </div>
  ) : (
    filteredFoods.map((food) => (
      <div
        key={food._id}
        className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md "
      >
        <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800">
          {/* Image Rendering */}
          {food.images && food.images.length > 0 ? (
            <Image
              src={food.images[0]}
              alt={food.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed className="h-10 w-10 text-gray-300" />
            </div>
          )}

          {/* --- ACTION MENU (Top Right) --- */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm hover:bg-white text-gray-700 dark:text-gray-200 shadow-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => startEdit(food)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50" 
                  onClick={() => handleDelete(food._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* --- CATEGORY BADGE (Moved to Top Left) --- */}
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              {food.category}
            </span>
          </div>

          {/* --- MULTIPLE IMAGE INDICATOR (Bottom Right) --- */}
          {food.images && food.images.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> +
                {food.images.length - 1}
              </span>
            </div>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="p-4">
          <h3
            className="font-bold text-gray-900  dark:text-gray-100 text-wrap"
            title={food.name}
          >
            {food.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-8">
            {food.description || "No description provided."}
          </p>
        </div>
      </div>
    ))
  )}
  <Toaster position="top-right" />
</div>
    </>
  )
}