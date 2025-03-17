import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';	
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (localFilePath) {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            })
            fs.unlinkSync(localFilePath)
            return response;
        }
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("Error while uploading on cloudinary", error)
        return null;
    }
}
const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };
  
  // Upload files in batches
  const uploadFilesInBatches = async (localFilePaths) => {
    const fileChunks = chunkArray(localFilePaths, 10); // Split into batches of 10
    const responses = [];
  
    for (const chunk of fileChunks) {
      const limit = pLimit(10); // Limit concurrent uploads within each chunk
      const uploadPromises = chunk.map((filePath) =>
        limit(() => uploadOnCloudinary(filePath))
      );
      const chunkResponses = await Promise.all(uploadPromises);
      responses.push(...chunkResponses);
    }
  
    return responses; // Flattened array of all responses
  };
  
  const deleteFromCloudinary = async (publicId) => {
    try {
      if (!publicId) {
        console.error("No public ID provided for deletion");
        return null;
      }
  
      // Delete the file from Cloudinary
      const response = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete response:", response);
  
      if (response.result === "not found") {
        console.error("Public ID not found in Cloudinary.");
        return null;
      }
  
      return response;
    } catch (error) {
      console.error("Error while deleting from Cloudinary:", error);
      return null;
    }
  };
  
  export { uploadOnCloudinary, deleteFromCloudinary, uploadFilesInBatches };