import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, MapPin, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadData {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  wasteType: string;
  description: string;
  image: File | null;
  reporterName: string;
  status: 'draft' | 'uploading' | 'success' | 'error';
}

const GeoUploadSection = () => {
  const { t } = useTranslation();
  const [uploadData, setUploadData] = useState<UploadData>({
    location: '',
    coordinates: null,
    wasteType: '',
    description: '',
    image: null,
    reporterName: '',
    status: 'draft'
  });

  const wasteTypes = [
    { value: 'mixed', label: 'Mixed Waste' },
    { value: 'organic', label: 'Organic Waste' },
    { value: 'plastic', label: 'Plastic Waste' },
    { value: 'electronic', label: 'Electronic Waste' },
    { value: 'hazardous', label: 'Hazardous Waste' },
    { value: 'construction', label: 'Construction Debris' },
    { value: 'medical', label: 'Medical Waste' }
  ];

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUploadData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setUploadData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.location || !uploadData.wasteType || !uploadData.reporterName) {
      setUploadData(prev => ({ ...prev, status: 'error' }));
      return;
    }

    setUploadData(prev => ({ ...prev, status: 'uploading' }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload to Supabase or another backend
      console.log('Uploading data:', uploadData);
      
      setUploadData(prev => ({ ...prev, status: 'success' }));
      
      // Reset form after success
      setTimeout(() => {
        setUploadData({
          location: '',
          coordinates: null,
          wasteType: '',
          description: '',
          image: null,
          reporterName: '',
          status: 'draft'
        });
      }, 3000);
      
    } catch (error) {
      setUploadData(prev => ({ ...prev, status: 'error' }));
    }
  };

  const resetForm = () => {
    setUploadData({
      location: '',
      coordinates: null,
      wasteType: '',
      description: '',
      image: null,
      reporterName: '',
      status: 'draft'
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {t('geo_upload')}
        </h2>
        <p className="text-muted-foreground">
          Report waste issues with precise location data
        </p>
      </div>

      <Card className="bg-gradient-card shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Upload className="w-6 h-6" />
            Submit Waste Report
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {uploadData.status === 'success' && (
            <Alert className="mb-6 border-success text-success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Report submitted successfully! Thank you for helping keep our community clean.
              </AlertDescription>
            </Alert>
          )}

          {uploadData.status === 'error' && (
            <Alert className="mb-6 border-destructive text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill in all required fields and try again.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reporterName" className="font-medium">
                  Reporter Name *
                </Label>
                <Input
                  id="reporterName"
                  value={uploadData.reporterName}
                  onChange={(e) => setUploadData(prev => ({ ...prev, reporterName: e.target.value }))}
                  placeholder="Enter your name"
                  required
                  disabled={uploadData.status === 'uploading'}
                />
              </div>

              <div>
                <Label htmlFor="location" className="font-medium">
                  Location *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={uploadData.location}
                    onChange={(e) => setUploadData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location or address"
                    required
                    disabled={uploadData.status === 'uploading'}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={uploadData.status === 'uploading'}
                    className="px-3"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
                {uploadData.coordinates && (
                  <p className="text-xs text-muted-foreground mt-1">
                    GPS: {uploadData.coordinates.lat.toFixed(6)}, {uploadData.coordinates.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="wasteType" className="font-medium">
                  Waste Type *
                </Label>
                <Select 
                  value={uploadData.wasteType} 
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, wasteType: value }))}
                  disabled={uploadData.status === 'uploading'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the waste issue (optional)"
                  rows={3}
                  disabled={uploadData.status === 'uploading'}
                />
              </div>

              <div>
                <Label htmlFor="image" className="font-medium">
                  Photo Evidence
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadData.status === 'uploading'}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted/50"
                  >
                    <Camera className="w-4 h-4" />
                    {uploadData.image ? uploadData.image.name : 'Choose photo'}
                  </Label>
                  {uploadData.image && (
                    <span className="text-sm text-success">✓ Photo selected</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: 5MB. Supported formats: JPG, PNG, WebP
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary"
                disabled={uploadData.status === 'uploading'}
              >
                {uploadData.status === 'uploading' ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={uploadData.status === 'uploading'}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoUploadSection;