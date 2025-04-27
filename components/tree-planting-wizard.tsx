"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Check, ChevronRight, Leaf, MapPin, TreePine, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { useFirebase } from "@/lib/firebase-context"
import { addTreePlanting, uploadImage } from "@/lib/firebase-service"
import { useAuth } from "@/lib/auth-context"
import { addTree } from "@/lib/firebase-service"

interface TreePlantingWizardProps {
  onComplete: (data: any) => void
  onCancel: () => void
}

export function TreePlantingWizard({ onComplete, onCancel }: TreePlantingWizardProps) {
  const { user } = useFirebase()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [treeData, setTreeData] = useState({
    species: "",
    location: "",
    description: "",
    treePhoto: null as string | null,
    selfieWithTree: null as string | null,
    coordinates: { lat: "", lng: "" },
  })
  const { toast } = useToast()
  const [isCapturing, setIsCapturing] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Handle camera access
  const startCamera = async (field: "treePhoto" | "selfieWithTree") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      })
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageUrl = canvas.toDataURL("image/jpeg")
    setTreeData({ ...treeData, [cameraActive ? 'treePhoto' : 'selfieWithTree']: imageUrl })
    stopCamera()
  }

  // Handle geolocation
  const getLocation = () => {
    setLocationLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Reverse geocoding to get location name
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              setTreeData({
                ...treeData,
                location: data.display_name,
                coordinates: { lat: latitude.toString(), lng: longitude.toString() }
              })
              setLocationLoading(false)
              toast({
                title: "Location Detected",
                description: "Your current location has been detected and saved.",
              })
            })
            .catch(error => {
              console.error("Error getting location name:", error)
              setLocationLoading(false)
              toast({
                title: "Location Error",
                description: "Could not get location name. Please enter manually.",
                variant: "destructive",
              })
            })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationLoading(false)
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive",
          })
        }
      )
    } else {
      setLocationLoading(false)
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (field: "treePhoto" | "selfieWithTree", file: File | null) => {
    if (!file) return
    setLoading(true)
    try {
      const path = `trees/${field}/${Date.now()}_${file.name}`
      const imageUrl = await uploadImage(file, path)
      setTreeData({ ...treeData, [field]: imageUrl })
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCameraCapture = async (field: "treePhoto" | "selfieWithTree") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        title: "Error",
        description: "Camera access is not supported on your device.",
        variant: "destructive",
      })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const verifyLiveness = async () => {
    if (!treeData.selfieWithTree) return

    setVerifying(true)
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000))
      setVerificationStatus("success")
      toast({
        title: "Success",
        description: "Tree planting verified successfully!",
      })
    } catch (error) {
      setVerificationStatus("error")
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleNext = () => {
    if (step === totalSteps) {
      onComplete({
        ...treeData,
        coins: 100,
        date: new Date().toISOString(),
      })
    } else {
      setStep(step + 1)
    }
  }

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return treeData.species && treeData.location
      case 2:
        return !!treeData.treePhoto
      case 3:
        return !!treeData.selfieWithTree
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-primary">Plant a Tree</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Record your tree planting to earn Green Coins</CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="species">Tree Species</Label>
              <RadioGroup
                value={treeData.species}
                onValueChange={(value) => setTreeData({ ...treeData, species: value })}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="oak" id="oak" className="peer sr-only" />
                  <Label
                    htmlFor="oak"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <TreePine className="mb-3 h-6 w-6" />
                    Oak
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pine" id="pine" className="peer sr-only" />
                  <Label
                    htmlFor="pine"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <TreePine className="mb-3 h-6 w-6" />
                    Pine
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="maple" id="maple" className="peer sr-only" />
                  <Label
                    htmlFor="maple"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <TreePine className="mb-3 h-6 w-6" />
                    Maple
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="other" id="other" className="peer sr-only" />
                  <Label
                    htmlFor="other"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <TreePine className="mb-3 h-6 w-6" />
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Planting Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter location"
                  value={treeData.location}
                  onChange={(e) => setTreeData({ ...treeData, location: e.target.value })}
                />
                <Button
                  variant="outline"
                  type="button"
                  className="shrink-0"
                  onClick={getLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <span className="animate-pulse">Detecting...</span>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Use GPS
                    </>
                  )}
                </Button>
              </div>
              {treeData.coordinates.lat && treeData.coordinates.lng && (
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {treeData.coordinates.lat}, {treeData.coordinates.lng}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any details about your tree planting"
                value={treeData.description}
                onChange={(e) => setTreeData({ ...treeData, description: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">Take a Photo of Your Tree</h3>
              <p className="text-sm text-muted-foreground">Please take a clear photo of the tree you just planted</p>
            </div>

            {cameraActive && (
              <div className="relative mx-auto w-full max-w-xs">
                <div className="aspect-[3/4] bg-black rounded-md overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-full h-12 w-12 p-0 bg-white text-black hover:bg-gray-200"
                    onClick={capturePhoto}
                  >
                    <span className="sr-only">Capture</span>
                    <div className="h-8 w-8 rounded-full border-2 border-current"></div>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={stopCamera}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {treeData.treePhoto && !cameraActive ? (
              <div className="relative mx-auto w-64 h-80 bg-muted rounded-md overflow-hidden">
                <img
                  src={treeData.treePhoto}
                  alt="Planted tree"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => setTreeData({ ...treeData, treePhoto: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : !cameraActive ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="w-64 h-80 border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center p-4">
                  <TreePine className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Take a photo or upload an image of your planted tree
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleCameraCapture("treePhoto")} disabled={loading}>
                      {loading ? (
                        "Capturing..."
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Camera
                        </>
                      )}
                    </Button>
                    <Label
                      htmlFor="tree-upload"
                      className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Label>
                    <Input
                      id="tree-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileUpload("treePhoto", e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h4 className="font-medium flex items-center text-amber-800">
                <Leaf className="h-4 w-4 mr-2" />
                Tree Planting Tips
              </h4>
              <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc pl-5">
                <li>Ensure the tree is properly planted with the root ball at the right depth</li>
                <li>Water thoroughly after planting</li>
                <li>Add mulch around the base (but not touching the trunk)</li>
                <li>Stake the tree if needed for support</li>
              </ul>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">Verification Photo</h3>
              <p className="text-sm text-muted-foreground">
                Please take a selfie with the tree you planted to verify your planting
              </p>
            </div>

            {cameraActive && (
              <div className="relative mx-auto w-full max-w-xs">
                <div className="aspect-[3/4] bg-black rounded-md overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-full h-12 w-12 p-0 bg-white text-black hover:bg-gray-200"
                    onClick={capturePhoto}
                  >
                    <span className="sr-only">Capture</span>
                    <div className="h-8 w-8 rounded-full border-2 border-current"></div>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={stopCamera}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {treeData.selfieWithTree && !cameraActive ? (
              <div className="relative mx-auto w-64 h-80 bg-muted rounded-md overflow-hidden">
                <img
                  src={treeData.selfieWithTree}
                  alt="Selfie with tree"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => setTreeData({ ...treeData, selfieWithTree: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : !cameraActive ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="w-64 h-80 border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center p-4">
                  <div className="relative mb-4">
                    <TreePine className="h-10 w-10 text-muted-foreground" />
                    <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-muted-foreground flex items-center justify-center">
                      <span className="text-xs text-white">👤</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Take a selfie with your planted tree to verify your planting
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleCameraCapture("selfieWithTree")} disabled={loading}>
                      {loading ? (
                        "Capturing..."
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Camera
                        </>
                      )}
                    </Button>
                    <Label
                      htmlFor="selfie-upload"
                      className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Label>
                    <Input
                      id="selfie-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFileUpload("selfieWithTree", e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium flex items-center text-blue-800">
                <Leaf className="h-4 w-4 mr-2" />
                Verification Requirements
              </h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc pl-5">
                <li>You must be clearly visible in the photo</li>
                <li>The tree you planted should be visible</li>
                <li>The photo should be taken in daylight for clear verification</li>
                <li>Your face should be unobstructed (no sunglasses, masks, etc.)</li>
              </ul>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Verification Complete!</h3>
              <p className="text-muted-foreground mt-1">Your tree planting has been verified and recorded</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-green-800">Rewards Earned</h4>
                <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                  <Leaf className="h-4 w-4 text-green-700" />
                  <span className="font-bold text-green-800">+100 Green Coins</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tree Species</span>
                  <span className="font-medium">{treeData.species || "Oak"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{treeData.location || "Community Park"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date Planted</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification Status</span>
                  <span className="font-medium text-green-700 flex items-center">
                    {verificationStatus === "verifying" ? (
                      "Verifying..."
                    ) : verificationStatus === "success" ? (
                       "Verified"
                    ) : (
                      "Not Verified"
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Your tree has been added to your virtual forest!</p>
                <div className="flex justify-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                    <img
                      src={treeData.treePhoto || "/placeholder.svg?height=64&width=64"}
                      alt="Tree"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                    <img
                      src={treeData.selfieWithTree || "/placeholder.svg?height=64&width=64"}
                      alt="Verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && step < 4 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {step === 3 && treeData.selfieWithTree ? (
          <Button onClick={verifyLiveness} disabled={verifying} className="bg-primary hover:bg-primary/90">
            {verifying ? "Verifying..." : "Verify Planting"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!isStepComplete()} className="bg-primary hover:bg-primary/90">
            {step === totalSteps ? "Complete" : "Next"}
            {step !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
