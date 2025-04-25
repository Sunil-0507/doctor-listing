import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const FilterPanel = ({ onFilterChange, currentFilters, doctors }) => {
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    specialties: true,
    mode: true
  });

  useEffect(() => {
    // Extract unique specialties from doctors data
    const uniqueSpecialties = new Set();
    doctors?.forEach(doctor => {
      doctor.specialities?.forEach(specialty => {
        uniqueSpecialties.add(specialty.name);
      });
    });
    setSpecialties(Array.from(uniqueSpecialties).sort());
  }, [doctors]);

  const handleConsultationTypeChange = (e) => {
    onFilterChange('mode', e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    const specialty = e.target.value;
    const currentSpecialties = currentFilters.specialties ? currentFilters.specialties.split(',') : [];
    
    let newSpecialties;
    if (e.target.checked) {
      newSpecialties = [...currentSpecialties, specialty];
    } else {
      newSpecialties = currentSpecialties.filter(s => s !== specialty);
    }

    onFilterChange('specialties', newSpecialties.join(','));
  };

  const handleSortChange = (e) => {
    onFilterChange('sort', e.target.value);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Sort Section */}
      <div>
        <button 
          onClick={() => toggleSection('sort')}
          className="w-full flex justify-between items-center text-gray-700 mb-4"
        >
          <span className="text-base font-medium">Sort by</span>
          {expandedSections.sort ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
        {expandedSections.sort && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="sort"
                value="fees"
                checked={currentFilters.sort === 'fees'}
                onChange={handleSortChange}
                data-testid="sort-fees"
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2 text-gray-600">Price: Low-High</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sort"
                value="experience"
                checked={currentFilters.sort === 'experience'}
                onChange={handleSortChange}
                data-testid="sort-experience"
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2 text-gray-600">Experience- Most Experience first</span>
            </label>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-700">Filters</h3>
          <button 
            onClick={() => onFilterChange('clear', '')}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Specialities Section */}
        <div className="mb-6">
          <button 
            onClick={() => toggleSection('specialties')}
            className="w-full flex justify-between items-center text-gray-700 mb-4"
          >
            <span className="text-base font-medium">Specialities</span>
            {expandedSections.specialties ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {expandedSections.specialties && (
            <>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search specialities"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredSpecialties.map((specialty) => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      value={specialty}
                      checked={currentFilters.specialties?.includes(specialty)}
                      onChange={handleSpecialtyChange}
                      data-testid={`filter-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-600">{specialty}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mode of Consultation */}
        <div>
          <button 
            onClick={() => toggleSection('mode')}
            className="w-full flex justify-between items-center text-gray-700 mb-4"
          >
            <span className="text-base font-medium">Mode of consultation</span>
            {expandedSections.mode ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {expandedSections.mode && (
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultation"
                  value="video"
                  checked={currentFilters.mode === 'video'}
                  onChange={handleConsultationTypeChange}
                  data-testid="filter-video-consult"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-gray-600">Video Consultation</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultation"
                  value="clinic"
                  checked={currentFilters.mode === 'clinic'}
                  onChange={handleConsultationTypeChange}
                  data-testid="filter-in-clinic"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-gray-600">In-clinic Consultation</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultation"
                  value=""
                  checked={!currentFilters.mode}
                  onChange={handleConsultationTypeChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-gray-600">All</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 