"use client"

import { useState, useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Trash2, Edit3, Check, Loader2 } from "lucide-react"
import { toast } from "sonner" // Assuming you have toast setup

const DocumentViewer = ({ documentData }) => {
  const [signatureImage, setSignatureImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [activeTab, setActiveTab] = useState("draw")
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        setSignatureImage(reader.result)
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
          documentId: documentData.id,
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
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-center">Sign Document</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="draw">
                  <Edit3 className="mr-2 h-4 w-4" /> Draw Signature
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" /> Upload Signature
                </TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-md bg-white">
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
                  <Button variant="outline" onClick={clearSignature}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                  </Button>
                  <Button onClick={saveSignature}>Save Signature</Button>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature-upload">Upload Signature Image</Label>
                  <Input 
                    id="signature-upload" 
                    type="file" 
                    accept="image/png,image/jpeg" 
                    onChange={handleFileUpload} 
                  />
                  {uploadedImage && (
                    <div className="mt-4 border rounded-md p-4 bg-white flex justify-center">
                      <img
                        src={uploadedImage}
                        alt="Uploaded Signature"
                        className="max-h-[200px] object-contain"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {signatureImage && (
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-medium">Preview</h3>
                <div className="border rounded-md p-4 bg-white flex justify-center">
                  <img
                    src={signatureImage}
                    alt="Signature"
                    className="max-h-[200px] object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
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
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
            <Button 
              onClick={submitSignature} 
              disabled={!signatureImage || isSubmitting}
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
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p>No document found or document path is invalid</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentViewer