"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import ProfileImageUpload from "@/components/profile-image-upload"
import { updateUserProfile } from "@/app/actions/auth"
import { getInitials } from "@/lib/utils"


export default function ProfileSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams() // 2. Initialize the hook
  
  // 3. Get username from URL (fallback to empty string if missing)
  const username = searchParams.get("username") || ""

  // 4. Generate Initials logic (e.g. "Sophian Abdul" -> "SA")
  // Default fallback if no username in URL
  const initials = getInitials(username)
  
  const [file, setFile] = useState<File | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleContinue = async () => {
    setIsPending(true)

    try {
      const formData = new FormData()
      
      if (file) {
        formData.append("file", file)
      } else if (color) {
        formData.append("color", color)
      } else {
        toast.info("Please select an image or color first")
        setIsPending(false)
        return
      }

      const result = await updateUserProfile(formData)

      if (result.success) {
        toast.success("Profile updated successfully!")
        router.refresh()
        router.push("/dashboard")
      } else {
        toast.error(result.error || "Something went wrong")
        setIsPending(false) // Only stop loading if error. If success, keep loading while redirecting.
      }
    } catch (err) {
      console.error(err)
      toast.error("Network error. Please try again.")
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <ProfileImageUpload
          value={file}
          onChange={setFile}
          defaultColor={color}
          onColorChange={setColor}
          onContinue={handleContinue}
          initials={initials}
          isLoading={isPending}
        />
      </div>
    </div>
  )
}