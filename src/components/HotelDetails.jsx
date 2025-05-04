
const HotelDetails = ({ language, translations, onOpenMap }) => {
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Ocean Breeze Hotel</h1>
        <div className="flex items-center mb-4">
          <div className="star-rating text-lg" aria-label="4-star hotel">
            {Array(4)
              .fill()
              .map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
          </div>
          <span className="ml-2 text-gray-600">{translations[language].star_hotel}</span>
        </div>
        <p className="text-gray-600 mb-4">123 Ocean Drive, Nairobi, Kenya</p>
        <button
          onClick={onOpenMap}
          className="text-blue-600 hover:underline flex items-center"
          aria-label="See hotel on map"
        >
          <i className="fas fa-map-marker-alt mr-1"></i>
          {translations[language].see_on_map}
        </button>
      </section>
    );
  };
  
  export default HotelDetails;