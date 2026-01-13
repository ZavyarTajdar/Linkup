import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (filepath: string) => {
  if (!filepath) return null;

  try {
    const upload = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filepath); // remove the locally saved temporary file
    return upload;
  } catch (error: any) {
    fs.unlinkSync(filepath); // remove file if upload failed
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

export { UploadOnCloudinary };
