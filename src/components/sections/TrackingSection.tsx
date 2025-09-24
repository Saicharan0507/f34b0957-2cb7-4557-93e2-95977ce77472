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
  coordinates: { lat: number; lng: number };
  nextStop: string;
  eta: string;
  capacity: number;
  collected: number;
  speed: number;
  direction: number;
}

const TrackingSection = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock vehicle data with live coordinates
  const [mockVehicles, setMockVehicles] = useState<Vehicle[]>([
    {
      id: "WM001",
      route: "Sector 15-20",
      status: "active",
      location: "Sector 17, Block A",
      coordinates: { lat: 28.5355, lng: 77.3910 },
      nextStop: "Sector 18, Main Road",
      eta: "15 mins",
      capacity: 100,
      collected: 65,
      speed: 25,
      direction: 45
    },
    {
      id: "WM002", 
      route: "Sector 21-25",
      status: "active",
      location: "Sector 23, Park Street",
      coordinates: { lat: 28.5421, lng: 77.3850 },
      nextStop: "Sector 24, Mall Road",
      eta: "8 mins",
      capacity: 100,
      collected: 40,
      speed: 30,
      direction: 90
    },
    {
      id: "WM003",
      route: "Sector 26-30",
      status: "idle",
      location: "Collection Center",
      coordinates: { lat: 28.5489, lng: 77.3950 },
      nextStop: "Sector 26, Phase 1",
      eta: "30 mins",
      capacity: 100,
      collected: 0,
      speed: 0,
      direction: 0
    },
    {
      id: "WM004",
      route: "Industrial Area",
      status: "maintenance",
      location: "Maintenance Depot",
      coordinates: { lat: 28.5300, lng: 77.4000 },
      nextStop: "N/A",
      eta: "N/A",
      capacity: 150,
      collected: 0,
      speed: 0,
      direction: 0
    }
  ]);

  useEffect(() => {
    // Simulate fetching vehicle data
    setIsLoading(true);
    setTimeout(() => {
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);

    // Live location updates every 5 seconds
    const interval = setInterval(() => {
      setMockVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'active') {
          // Simulate movement based on speed and direction
          const latChange = (vehicle.speed * Math.cos(vehicle.direction * Math.PI / 180)) * 0.00001;
          const lngChange = (vehicle.speed * Math.sin(vehicle.direction * Math.PI / 180)) * 0.00001;
          
          return {
            ...vehicle,
            coordinates: {
              lat: vehicle.coordinates.lat + latChange,
              lng: vehicle.coordinates.lng + lngChange
            },
            collected: Math.min(vehicle.capacity, vehicle.collected + Math.floor(Math.random() * 2))
          };
        }
        return vehicle;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setVehicles(mockVehicles);
  }, [mockVehicles]);

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
            <CardTitle className="text-primary">Live Location - {selectedVehicle}</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const vehicle = vehicles.find(v => v.id === selectedVehicle);
              if (!vehicle) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Coordinates:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {vehicle.coordinates.lat.toFixed(4)}, {vehicle.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Speed:</span>
                      <br />
                      <span className="text-muted-foreground">{vehicle.speed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-muted/30 rounded-lg relative overflow-hidden">
                    {/* Simple visual map */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                      {/* Grid lines */}
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="absolute bg-gray-400" style={{
                            left: `${i * 10}%`,
                            top: 0,
                            width: '1px',
                            height: '100%'
                          }} />
                        ))}
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="absolute bg-gray-400" style={{
                            top: `${i * 16.66}%`,
                            left: 0,
                            height: '1px',
                            width: '100%'
                          }} />
                        ))}
                      </div>
                      
                      {/* Vehicle position */}
                      <div 
                        className="absolute w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse"
                        style={{
                          left: `${((vehicle.coordinates.lng - 77.38) * 5000)}%`,
                          top: `${(100 - (vehicle.coordinates.lat - 28.53) * 5000)}%`,
                          transform: `translate(-50%, -50%) rotate(${vehicle.direction}deg)`
                        }}
                      >
                        <Truck className="w-3 h-3 text-white" />
                      </div>
                      
                      {/* Route indicators */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur rounded-lg p-3 text-xs">
                          <div className="font-medium text-primary mb-1">Live Tracking Active</div>
                          <div className="text-muted-foreground">
                            Last updated: {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackingSection;