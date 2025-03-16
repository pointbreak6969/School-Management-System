"use client"

import { useState, useRef, useCallback } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, Edit3, Check, Loader2, Crop, ZoomIn } from "lucide-react"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner" // Assuming you have toast setup
// Helper function to create cropped image
const createCroppedImage = async (imageSrc, pixelCrop) => {
  const image = new Image()
  image.src = imageSrc
  
  // Create canvas for cropping
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Set canvas dimensions to desired output size (100x100 pixels by default)
  canvas.width = 100
  canvas.height = 100
  
  return new Promise((resolve) => {
    image.onload = () => {
      // Draw cropped image on canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      )
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png'))
    }
  })
}


const DocumentViewer = ({ documentData }) => {
  const [signatureImage, setSignatureImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [activeTab, setActiveTab] = useState("draw")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const signatureRef = useRef(null)
  
  // PDF document path construction
  const pdfPath = documentData?.path ? `/uploads/${documentData.path}` : null
  
  // Clear the drawn signature
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setSignatureImage(null)
    }
  }

  // Save the drawn signature as an image
  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL("image/png")
      setSignatureImage(dataURL)
      toast({
        title: "Signature Saved",
        description: "Your signature has been saved successfully",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please draw a signature first",
      })
    }
  }

  // Handle file upload for signature image
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PNG or JPEG image",
      })
    }
  }

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // Apply crop to image
  const applyCrop = async () => {
    try {
      const croppedImage = await createCroppedImage(
        uploadedImage,
        croppedAreaPixels
      )
      setSignatureImage(croppedImage)
      setIsCropping(false)
      toast({
        title: "Image Cropped",
        description: "Your signature image has been cropped successfully",
      })
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "Cropping Failed",
        description: "Failed to crop the image. Please try again.",
      })
    }
  }

  // Cancel cropping
  const cancelCrop = () => {
    setIsCropping(false)
    setUploadedImage(null)
  }

  // Submit the signature to server
  const submitSignature = async () => {
    if (!signatureImage) {
      toast({
        variant: "destructive",
        title: "Missing signature",
        description: "Please create or upload a signature first",
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const response = await fetch("/api/saveSignature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentData?.id,
          signatureImage: signatureImage,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to save signature")
      }
      
      const result = await response.json()
      
      toast({
        title: "Success",
        description: "Signature submitted successfully",
      })
      
      // Optional: Redirect or do something after successful submission
    } catch (error) {
      console.error("Error submitting signature:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit signature",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 h-[calc(100vh-150px)]">
      {/* Left sidebar with signature panel */}
      <div className="w-full lg:w-2/5 h-full flex flex-col">
        <Card className="h-full flex flex-col bg-card">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b">
            <CardTitle className="text-center text-slate-800">Sign Document</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-4">
            {isCropping ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Crop Your Signature</h3>
                <div className="relative h-64 bg-slate-100 rounded-md">
                  <Cropper
                    image={uploadedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="zoom" className="text-sm text-slate-600">Zoom</Label>
                  </div>
                  <Slider
                    id="zoom"
                    min={1}
                    max={3}
                    step={0.1}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    className="py-4"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={cancelCrop}>
                    Cancel
                  </Button>
                  <Button onClick={applyCrop}>
                    <Crop className="mr-2 h-4 w-4" /> Apply Crop
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="draw" className="data-[state=active]:bg-blue-50">
                    <Edit3 className="mr-2 h-4 w-4" /> Draw Signature
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="data-[state=active]:bg-blue-50">
                    <Upload className="mr-2 h-4 w-4" /> Upload Signature
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="draw" className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-md bg-white p-1 shadow-sm">
                    <SignatureCanvas
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{
                        width: 400,
                        height: 200,
                        className: "w-full h-[200px] signature-canvas",
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={clearSignature} className="border-slate-300 hover:bg-slate-100">
                      <Trash2 className="mr-2 h-4 w-4" /> Clear
                    </Button>
                    <Button onClick={saveSignature} className="bg-blue-600 hover:bg-blue-700">
                      Save Signature
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="signature-upload" className="text-slate-700">Upload Signature Image</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-md bg-white p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <Input 
                        id="signature-upload" 
                        type="file" 
                        accept="image/png,image/jpeg" 
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                      <Label htmlFor="signature-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Click to upload</span>
                        <span className="text-xs text-slate-500">PNG or JPG (Max 5MB)</span>
                      </Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {signatureImage && !isCropping && (
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-medium text-slate-800">Preview</h3>
                <div className="border rounded-md p-4 bg-white flex justify-center shadow-sm">
                  <img
                    src={signatureImage}
                    alt="Signature"
                    className="max-h-[200px] object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 bg-slate-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => {
                if (activeTab === "draw") {
                  clearSignature()
                } else {
                  setUploadedImage(null)
                  setSignatureImage(null)
                }
              }}
              className="border-slate-300 hover:bg-slate-100"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
            <Button 
              onClick={submitSignature} 
              disabled={!signatureImage || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Submit Signature
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right side PDF viewer */}
      <div className="w-full lg:w-3/5 h-full bg-white rounded-lg border shadow">
        {pdfPath ? (
          <iframe
            src={pdfPath}
            className="w-full h-full rounded-lg"
            title={documentData?.name || "Document"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-50">
            <div className="text-center space-y-2">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No document found or document path is invalid</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentViewer