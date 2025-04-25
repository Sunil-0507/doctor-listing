const DoctorCard = ({ doctor }) => {
  return (
    <div data-testid="doctor-card" className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        {/* Doctor's Photo */}
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          {doctor?.photo ? (
            <img 
              src={doctor.photo} 
              alt={doctor?.name || 'Doctor'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xl">{doctor?.name?.charAt(0) || 'D'}</span>
            </div>
          )}
        </div>

        {/* Doctor's Info */}
        <div className="flex-1">
          <h3 data-testid="doctor-name" className="text-lg font-semibold text-gray-900">
            {doctor?.name || 'Doctor Name Not Available'}
          </h3>
          
          <p data-testid="doctor-specialty" className="text-sm text-gray-600 mt-1">
            {doctor?.specialities?.[0]?.name || 'Specialty Not Listed'}
          </p>
          
          {doctor?.clinic?.name && (
            <div className="flex items-center mt-2">
              <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm text-gray-600">{doctor.clinic.name}</span>
            </div>
          )}
          
          {doctor?.clinic?.address?.locality && (
            <div className="flex items-center mt-1">
              <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-600">{doctor.clinic.address.locality}</span>
            </div>
          )}

          <div className="flex items-center mt-2">
            <p data-testid="doctor-experience" className="text-sm text-gray-600">
              {doctor?.experience?.split(' ')[0] || '0'} yrs exp.
            </p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="text-right">
          <p data-testid="doctor-fee" className="text-lg font-semibold text-gray-900">
            {doctor?.fees || '₹0'}
          </p>
          
          <button className="mt-4 px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard; 