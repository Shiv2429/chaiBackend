import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // to check file is or not
        if(!localFilePath) return null;
        // this will upload the file on cloudinary
       const response =  await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
            console.log("File has been uploaded successfully", response.url)
            return response
    } catch (error) {
        fs.unlink(localFilePath)
        // remove the locally saved temporary fileas as the upload  operation is failed
        return null;
    }
}


export {uploadOnCloudinary};