'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Phone, 
  Building2,
  ArrowRight,
  Loader2,
  Users,
  ChevronRight
} from 'lucide-react';
import type { HospitalWithDepartments } from '@/types';

export function HospitalsView() {
  const { setCurrentView, setSelectedHospital, user } = useAppStore();
  const [hospitals, setHospitals] = useState<HospitalWithDepartments[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedRegion) params.append('region', selectedRegion);

      const response = await fetch(`/api/hospitals?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHospitals(data.hospitals);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHospitals();
  };

  const handleSelectHospital = (hospital: HospitalWithDepartments) => {
    setSelectedHospital(hospital);
    setCurrentView('departments');
  };

  // Get unique regions
  const regions = [...new Set(hospitals.map(h => h.region))];

  // Filter hospitals
  const filteredHospitals = hospitals.filter(h => {
    if (selectedRegion && h.region !== selectedRegion) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return h.name.toLowerCase().includes(searchLower) ||
             h.address.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Select Hospital</h1>
          <p className="text-muted-foreground">Choose a hospital to view departments and book tokens</p>
        </div>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          {/* Region Filter */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant={selectedRegion === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedRegion(''); fetchHospitals(); }}
              className={selectedRegion === '' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              All Regions
            </Button>
            {regions.map(region => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setSelectedRegion(region); }}
                className={selectedRegion === region ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                {region}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hospitals List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : filteredHospitals.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hospitals found</p>
            <Button variant="link" onClick={() => { setSearch(''); setSelectedRegion(''); fetchHospitals(); }}>
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredHospitals.map((hospital) => (
            <Card 
              key={hospital.id} 
              className="cursor-pointer hover:shadow-lg transition-all border-border hover:border-teal-200"
              onClick={() => handleSelectHospital(hospital)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{hospital.name}</h3>
                      {hospital.isActive && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Open
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{hospital.region}</span>
                      </div>
                      {hospital.emergencyContactNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Emergency: {hospital.emergencyContactNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                        <Users className="h-3 w-3 mr-1" />
                        {hospital.departments?.length || 0} Departments
                      </Badge>
                    </div>
                  </div>

                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
