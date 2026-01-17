import { v2 as cloudinary } from "cloudinary"

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper: Upload to Cloudinary
export async function uploadToCloudinary(file: File,imagePath:string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `Republic-lunch/${imagePath}` }, // Folder in Cloudinary
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result!.secure_url)
      }
    ).end(buffer)
  })
}