"use client"

import { useState, useRef, useCallback } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Upload, Trash2, Edit3, Download, Crop, ZoomIn, FileUp } from "lucide-react"
import Cropper from "react-easy-crop"
import { Slider } from "./ui/slider"
import { PDFDocument } from "pdf-lib"
import { Separator } from "./ui/separator"

// Helper function to create cropped image
const createCroppedImage = async (imageSrc, pixelCrop, height, width) => {
  const image = new Image()
  image.src = imageSrc
  image.crossOrigin = "anonymous"

  // Create canvas for cropping
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  // Set canvas dimensions to desired output size
  canvas.width = width
  canvas.height = height

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
        canvas.height,
      )

      // Convert canvas to data URL
      resolve(canvas.toDataURL("image/png"))
    }
  })
}

export default function DocumentSigner() {
  const [signatureImage, setSignatureImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [activeTab, setActiveTab] = useState("draw")
  const [isProcessing, setIsProcessing] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const signatureRef = useRef(null)
  const [documentFile, setDocumentFile] = useState(null)
  const [documentUrl, setDocumentUrl] = useState(null)
  const [signaturePosition, setSignaturePosition] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    pageNo: 1,
  })

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
    }
  }

  // Handle file upload for signature image
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      alert("Please upload a PNG or JPG file")
    }
  }

  // Handle document file upload
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setDocumentFile(file)
      const url = URL.createObjectURL(file)
      setDocumentUrl(url)
    } else if (file) {
      alert("Please upload a PDF file")
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
        croppedAreaPixels,
        signaturePosition.height,
        signaturePosition.width,
      )
      setSignatureImage(croppedImage)
      setIsCropping(false)
    } catch (e) {
      console.error(e)
    }
  }

  // Cancel cropping
  const cancelCrop = () => {
    setIsCropping(false)
    setUploadedImage(null)
  }

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",")
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // Read file as ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // Apply signature to PDF and download
  const applySignatureAndDownload = async () => {
    if (!signatureImage || !documentFile) {
      alert("Please provide both a signature and a document")
      return
    }

    try {
      setIsProcessing(true)

      // Step 1: Read the PDF file
      const pdfBytes = await readFileAsArrayBuffer(documentFile)

      // Step 2: Load the PDF
      const pdfDoc = await PDFDocument.load(pdfBytes)

      // Step 3: Convert signature image to proper format and embed in PDF
      const signatureBlob = dataURLtoBlob(signatureImage)
      const signatureArrayBuffer = await readFileAsArrayBuffer(signatureBlob)
      const embeddedSignature = await pdfDoc.embedPng(signatureArrayBuffer)

      // Step 4: Add signature to PDF
      const pageIndex = signaturePosition.pageNo - 1
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        const page = pdfDoc.getPage(pageIndex)

        // Get page dimensions
        const { width: pageWidth, height: pageHeight } = page.getSize()

        // Add signature to PDF at specified coordinates
        // Note: PDF coordinates start from bottom-left, so we need to adjust the y-coordinate
        page.drawImage(embeddedSignature, {
          x: signaturePosition.x,
          y: pageHeight - signaturePosition.y - signaturePosition.height, // Adjust y-coordinate
          width: signaturePosition.width,
          height: signaturePosition.height,
        })
      } else {
        throw new Error(`Invalid page number: ${signaturePosition.pageNo}`)
      }

      // Step 5: Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save()

      // Step 6: Create a download link
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `signed_${documentFile.name || "document"}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      alert("Document signed and downloaded successfully!")
    } catch (error) {
      console.error("Error applying signature:", error)
      alert(`Error: ${error.message || "Failed to sign document"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle position change
  const handlePositionChange = (e) => {
    const { name, value } = e.target
    setSignaturePosition((prev) => ({
      ...prev,
      [name]: Number.parseInt(value, 10),
    }))
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 h-[calc(100vh-150px)]">
      {/* Left sidebar with signature panel */}
      <div className="w-full lg:w-2/5 h-full flex flex-col">
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b">
            <CardTitle className="text-center text-slate-800">Document Signer</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-4 space-y-6">
            {/* Document Upload Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-800">Upload Document</h3>
              <div className="border-2 border-dashed border-slate-300 rounded-md bg-white p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Input
                  id="document-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <Label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <FileUp className="h-8 w-8 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Click to upload PDF</span>
                  <span className="text-xs text-slate-500">{documentFile ? documentFile.name : "PDF files only"}</span>
                </Label>
              </div>
            </div>

            <Separator />

            {/* Signature Position Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-800">Signature Position</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="x" className="text-sm text-slate-700">
                    X Position
                  </Label>
                  <Input id="x" name="x" type="number" value={signaturePosition.x} onChange={handlePositionChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y" className="text-sm text-slate-700">
                    Y Position
                  </Label>
                  <Input id="y" name="y" type="number" value={signaturePosition.y} onChange={handlePositionChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-sm text-slate-700">
                    Width
                  </Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    value={signaturePosition.width}
                    onChange={handlePositionChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm text-slate-700">
                    Height
                  </Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={signaturePosition.height}
                    onChange={handlePositionChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="pageNo" className="text-sm text-slate-700">
                    Page Number
                  </Label>
                  <Input
                    id="pageNo"
                    name="pageNo"
                    type="number"
                    min="1"
                    value={signaturePosition.pageNo}
                    onChange={handlePositionChange}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {isCropping ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Crop Your Signature</h3>
                <div className="relative h-64 bg-slate-100 rounded-md">
                  <Cropper
                    image={uploadedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={signaturePosition.width / signaturePosition.height}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="zoom" className="text-sm text-slate-600">
                      Zoom
                    </Label>
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
                    <Label htmlFor="signature-upload" className="text-slate-700">
                      Upload Signature Image
                    </Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-md bg-white p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <Input
                        id="signature-upload"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleSignatureUpload}
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
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-800">Preview</h3>
                <div className="border rounded-md p-4 bg-white flex justify-center shadow-sm">
                  <img
                    src={signatureImage || "/placeholder.svg"}
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
              <Trash2 className="mr-2 h-4 w-4" /> Clear Signature
            </Button>
            <Button
              onClick={applySignatureAndDownload}
              disabled={!signatureImage || !documentFile || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Sign & Download
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right side PDF viewer */}
      <div className="w-full lg:w-3/5 h-full bg-white rounded-lg border shadow">
        {documentUrl ? (
          <iframe src={documentUrl} className="w-full h-full rounded-lg" title="Document Preview" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-50">
            <div className="text-center space-y-2">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">Upload a PDF document to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

