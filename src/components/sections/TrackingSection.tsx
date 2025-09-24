import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Clock, Navigation, Zap } from 'lucide-react';

interface Vehicle {
  id: string;
  route: string;
  status: 'active' | 'idle' | 'maintenance';
  location: string;
  nextStop: string;
  eta: string;
  capacity: number;
  collected: number;
}

const TrackingSection = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock vehicle data
  const mockVehicles: Vehicle[] = [
    {
      id: "WM001",
      route: "Sector 15-20",
      status: "active",
      location: "Sector 17, Block A",
      nextStop: "Sector 18, Main Road",
      eta: "15 mins",
      capacity: 100,
      collected: 65
    },
    {
      id: "WM002", 
      route: "Sector 21-25",
      status: "active",
      location: "Sector 23, Park Street",
      nextStop: "Sector 24, Mall Road",
      eta: "8 mins",
      capacity: 100,
      collected: 40
    },
    {
      id: "WM003",
      route: "Sector 26-30",
      status: "idle",
      location: "Collection Center",
      nextStop: "Sector 26, Phase 1",
      eta: "30 mins",
      capacity: 100,
      collected: 0
    },
    {
      id: "WM004",
      route: "Industrial Area",
      status: "maintenance",
      location: "Maintenance Depot",
      nextStop: "N/A",
      eta: "N/A",
      capacity: 150,
      collected: 0
    }
  ];

  useEffect(() => {
    // Simulate fetching vehicle data
    setIsLoading(true);
    setTimeout(() => {
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'idle': return 'bg-warning';
      case 'maintenance': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'idle': return 'Idle';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call with slight data changes
    setTimeout(() => {
      const updated = vehicles.map(vehicle => ({
        ...vehicle,
        collected: Math.min(vehicle.capacity, vehicle.collected + Math.floor(Math.random() * 10))
      }));
      setVehicles(updated);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            {t('live_tracking')}
          </h2>
          <p className="text-muted-foreground">
            Real-time tracking of waste collection vehicles
          </p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {isLoading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card 
            key={vehicle.id}
            className={`bg-gradient-card shadow-md hover:shadow-lg transition-all cursor-pointer ${
              selectedVehicle === vehicle.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedVehicle(vehicle.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="w-5 h-5 text-primary" />
                  {vehicle.id}
                </CardTitle>
                <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                  {getStatusText(vehicle.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{vehicle.route}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="font-medium">Current:</span>
                  <span>{vehicle.location}</span>
                </div>
                
                {vehicle.status === 'active' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="font-medium">Next:</span>
                      <span>{vehicle.nextStop}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="font-medium">ETA:</span>
                      <span>{vehicle.eta}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span>{vehicle.collected}/{vehicle.capacity}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(vehicle.collected / vehicle.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVehicle && (
        <Card className="bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">Vehicle Details - {selectedVehicle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-primary mx-auto" />
                <p className="text-muted-foreground">
                  Interactive map would be displayed here
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing real-time location and route of {selectedVehicle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackingSection;