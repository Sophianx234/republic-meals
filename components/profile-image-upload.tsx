"use client"

import * as React from "react"
import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Camera, X, AlertCircle, RefreshCcw, Info, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const PRESET_COLORS = [
  "bg-gradient-to-br from-slate-500 to-slate-700",
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-violet-500 to-purple-700",
  "bg-gradient-to-br from-amber-500 to-orange-700",
]

interface ProfileImageUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  defaultColor?: string | null
  onColorChange?: (color: string | null) => void
  onContinue?: () => void
  isLoading?: boolean 
  initials?: string 
  maxSize?: number 
  className?: string
}

export default function ProfileImageUpload({
  value,
  onChange,
  defaultColor = null,
  onColorChange,
  onContinue,
  isLoading = false,
  initials = "QM", 
  maxSize = 1024 * 1024 * 2, 
  className,
}: ProfileImageUploadProps) {
  
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(defaultColor)
  const [error, setError] = useState<string | null>(null)

  const hasSelection = !!preview || !!selectedColor

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setSelectedColor(null); onColorChange?.(null); setError(null)
    setPreview(URL.createObjectURL(file)); onChange?.(file)
  }, [onChange, onColorChange])

  const handleColorSelect = (colorClass: string) => {
    setPreview(null); onChange?.(null); setError(null)
    setSelectedColor(colorClass); onColorChange?.(colorClass)
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, multiple: false, maxFiles: 1, maxSize, accept: { "image/*": [] },
  })

  useEffect(() => {
    if (fileRejections.length > 0) setError(fileRejections[0].errors[0].message)
  }, [fileRejections])

  return (
    <div className={cn("w-full flex flex-col items-center gap-6", className)}>
      
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
        <p className="text-sm text-gray-500 max-w-[250px] mx-auto">Upload a picture or choose a color.</p>
      </div>

      {/* Avatar Interaction Area */}
      <div className="relative group">
        <div {...getRootProps()} className={cn(
            "relative flex items-center justify-center overflow-hidden h-40 w-40 rounded-full transition-all duration-300 ease-in-out",
            hasSelection ? "border-0 shadow-xl" : "border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100",
            isDragActive && "border-blue-500 bg-blue-50/50 scale-105",
            "cursor-pointer focus:outline-none"
          )}>
          <input {...getInputProps()} disabled={isLoading} />
          
          {preview ? (
            <Image src={preview} alt="Profile" fill className="object-cover" priority />
          ) : selectedColor ? (
            <div className={cn("w-full h-full flex items-center justify-center text-white", selectedColor)}>
               <span className="text-4xl font-bold tracking-wider drop-shadow-md">{initials.substring(0, 2).toUpperCase()}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400"><Camera className="w-8 h-8" /><span className="text-xs uppercase">Upload</span></div>
          )}
        </div>
        
        {hasSelection && !isLoading && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); setSelectedColor(null); onChange?.(null); onColorChange?.(null); }} className="absolute top-0 right-0 p-2 rounded-full bg-white shadow-md hover:text-red-500 hover:bg-red-50 transition-all z-10"><X className="w-4 h-4" /></button>
        )}
      </div>

      {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}

      {/* Recommendation Tip */}
      {selectedColor && !preview && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-300 max-w-xs">
          <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold">Recommendation</p>
              <p className="text-xs leading-relaxed opacity-90">A real photo helps your team identify you easily. Consider uploading one if possible!</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="w-full flex flex-col items-center gap-6">
          <div className={`flex items-center gap-3 p-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
             {PRESET_COLORS.map((color, index) => (
                 <button key={index} type="button" onClick={() => handleColorSelect(color)} className={cn("w-8 h-8 rounded-full transition-all", color, selectedColor === color ? "ring-2 ring-offset-2 ring-blue-600 scale-110 shadow-lg" : "")} />
             ))}
          </div>

          <div className="w-full flex flex-col items-center gap-3 h-[60px] justify-center"> 
            {hasSelection ? (
                <button
                    onClick={onContinue}
                    disabled={isLoading}
                    className={cn(
                        "w-full max-w-[240px] group flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2.5 px-6 rounded-xl font-medium shadow-lg transition-all duration-300",
                        isLoading ? "opacity-80 cursor-wait" : "hover:shadow-xl hover:-translate-y-0.5"
                    )}
                >
                    {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
                    ) : (
                        <>Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            ) : (
                <div className={`flex flex-col items-center gap-3 w-full animate-in fade-in duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2 w-full justify-center opacity-60">
                        <span className="h-px w-12 bg-gray-300" /><span className="text-[10px] text-gray-400 font-bold uppercase">OR</span><span className="h-px w-12 bg-gray-300" />
                    </div>
                    <button type="button" onClick={handleSkip} className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline underline-offset-4">Skip for now</button>
                </div>
            )}
          </div>
      </div>
    </div>
  )
}