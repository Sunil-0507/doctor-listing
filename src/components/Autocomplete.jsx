import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, UserIcon, BuildingHospitalIcon, HeartIcon } from '@heroicons/react/24/outline';

const SYMPTOMS_API = 'https://clinicaltables.nlm.nih.gov/api/symptoms/v3/search';

const Autocomplete = ({ doctors, onSelect, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState({
    symptoms: [],
    doctors: [],
    specialists: [],
    clinics: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Extract unique specialties and clinics from doctors data
  const specialties = [...new Set(doctors.flatMap(d => d.specialities.map(s => s.name)))];
  const clinics = [...new Set(doctors.map(d => d.clinic))];

  const fetchSymptoms = async (query) => {
    try {
      const response = await fetch(`${SYMPTOMS_API}?terms=${encodeURIComponent(query)}&maxList=5`);
      const [success, , , results] = await response.json();
      return success ? results : [];
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [];
    }
  };

  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions({ symptoms: [], doctors: [], specialists: [], clinics: [] });
      setShowSuggestions(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const searchData = async () => {
      setLoading(true);
      const query = inputValue.toLowerCase();

      // Search doctors
      const matchedDoctors = doctors
        .filter(doctor => doctor.name.toLowerCase().includes(query))
        .slice(0, 3);

      // Search specialists
      const matchedSpecialists = specialties
        .filter(specialty => specialty.toLowerCase().includes(query))
        .slice(0, 3);

      // Search clinics
      const matchedClinics = clinics
        .filter(clinic => clinic.toLowerCase().includes(query))
        .slice(0, 3);

      // Fetch symptoms from API
      const symptoms = await fetchSymptoms(query);

      setSuggestions({
        symptoms: symptoms.slice(0, 3),
        doctors: matchedDoctors,
        specialists: matchedSpecialists,
        clinics: matchedClinics
      });

      setShowSuggestions(true);
      setLoading(false);
    };

    timeoutRef.current = setTimeout(searchData, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, doctors, specialties, clinics]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (item, type) => {
    setInputValue(type === 'symptoms' ? item : item.name || item);
    setShowSuggestions(false);
    onSelect(type === 'symptoms' ? item : item.name || item, type);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSelect(inputValue, 'search');
    }
  };

  const renderSuggestionGroup = (items, type, icon) => {
    if (items.length === 0) return null;

    return (
      <div className="py-2">
        <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
          {type}
        </div>
        {items.map((item, index) => (
          <div
            key={`${type}-${index}`}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => handleSuggestionClick(item, type)}
            data-testid={`suggestion-${type}`}
          >
            {icon}
            <span>{type === 'symptoms' ? item : item.name || item}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          {...props}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      
      {showSuggestions && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 divide-y divide-gray-100 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {renderSuggestionGroup(suggestions.symptoms, 'symptoms', 
                <HeartIcon className="h-5 w-5 text-red-500" />
              )}
              {renderSuggestionGroup(suggestions.doctors, 'doctors',
                <UserIcon className="h-5 w-5 text-blue-500" />
              )}
              {renderSuggestionGroup(suggestions.specialists, 'specialists',
                <UserIcon className="h-5 w-5 text-green-500" />
              )}
              {renderSuggestionGroup(suggestions.clinics, 'clinics',
                <BuildingHospitalIcon className="h-5 w-5 text-purple-500" />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete; 