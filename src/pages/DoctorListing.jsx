import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Autocomplete from '../components/Autocomplete';
import FilterPanel from '../components/FilterPanel';
import DoctorCard from '../components/DoctorCard';

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;

    let filtered = [...doctors];

    // Apply search filter for doctor names
    const search = searchParams.get('search');
    if (search) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply specialty filter
    const specialty = searchParams.get('specialty');
    if (specialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialities.some(s => s.name === specialty)
      );
    }

    // Apply symptom filter (match doctors with relevant specialties for the symptom)
    const symptom = searchParams.get('symptom');
    if (symptom) {
      // This is a simple example. In a real app, you'd want to use a proper symptom-to-specialty mapping
      const relevantSpecialties = getRelevantSpecialties(symptom);
      filtered = filtered.filter(doctor =>
        doctor.specialities.some(s => relevantSpecialties.includes(s.name))
      );
    }

    // Apply clinic filter
    const clinic = searchParams.get('clinic');
    if (clinic) {
      filtered = filtered.filter(doctor => doctor.clinic === clinic);
    }

    // Apply consultation type filter
    const mode = searchParams.get('mode');
    if (mode) {
      filtered = filtered.filter(doctor => 
        mode === 'video' ? doctor.video_consult : doctor.in_clinic
      );
    }

    // Apply sorting
    const sort = searchParams.get('sort');
    if (sort === 'fees') {
      filtered.sort((a, b) => parseInt(a.fees.replace(/[^\d]/g, '')) - parseInt(b.fees.replace(/[^\d]/g, '')));
    } else if (sort === 'experience') {
      filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchParams]);

  const handleSearch = (searchTerm, type) => {
    const params = new URLSearchParams(searchParams);
    
    // Clear previous search params
    params.delete('search');
    params.delete('specialty');
    params.delete('symptom');
    params.delete('clinic');

    // Set new search params based on type
    switch (type) {
      case 'symptoms':
        params.set('symptom', searchTerm);
        break;
      case 'specialists':
        params.set('specialty', searchTerm);
        break;
      case 'clinics':
        params.set('clinic', searchTerm);
        break;
      default:
        if (searchTerm) {
          params.set('search', searchTerm);
        }
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'clear') {
      setSearchParams(new URLSearchParams());
    } else if (value) {
      params.set(type, value);
      setSearchParams(params);
    } else {
      params.delete(type);
      setSearchParams(params);
    }
  };

  // Helper function to map symptoms to relevant specialties
  const getRelevantSpecialties = (symptom) => {
    // This is a simplified example. In a real application, you would want to:
    // 1. Use a medical database or API to map symptoms to specialties
    // 2. Have a more comprehensive mapping
    const symptomToSpecialty = {
      'headache': ['Neurologist', 'General Physician'],
      'back pain': ['Orthopedic', 'Physiotherapist'],
      'tooth': ['Dentist'],
      'skin': ['Dermatologist'],
      'eye': ['Ophthalmologist'],
      'heart': ['Cardiologist'],
      // Add more mappings as needed
    };

    const lowercaseSymptom = symptom.toLowerCase();
    for (const [key, specialties] of Object.entries(symptomToSpecialty)) {
      if (lowercaseSymptom.includes(key)) {
        return specialties;
      }
    }
    return ['General Physician']; // Default to General Physician if no specific match
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <Autocomplete 
            doctors={doctors} 
            onSelect={handleSearch}
            data-testid="autocomplete-input"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="w-full md:w-1/4">
            <FilterPanel
              onFilterChange={handleFilterChange}
              currentFilters={Object.fromEntries(searchParams)}
              doctors={doctors}
            />
          </div>
          
          {/* Doctor List */}
          <div className="flex-1">
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
              {filteredDoctors.length === 0 && (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No doctors found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorListing; 