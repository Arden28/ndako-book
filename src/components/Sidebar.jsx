const Sidebar = ({ language, translations, currency, currencyRates, maxPrice, setMaxPrice, sortBy, setSortBy, amenities, setAmenities }) => {
    const handlePriceChange = (e) => {
      setMaxPrice(parseFloat(e.target.value) / currencyRates[currency]);
    };
  
    return (
      <aside className="md:w-1/4 mb-8 md:mb-0">
        <div className="sticky top-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{translations[language].filter_by}</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{translations[language].price_per_night}</label>
            <input
              type="range"
              min={50 * currencyRates[currency]}
              max={500 * currencyRates[currency]}
              value={maxPrice * currencyRates[currency]}
              className="w-full"
              onChange={handlePriceChange}
              aria-label="Filter by price per night"
            />
            <span className="text-sm text-gray-600">
              {currency} {(50 * currencyRates[currency]).toFixed(0)} - {(maxPrice * currencyRates[currency]).toFixed(0)}
            </span>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{translations[language].sort_by}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800"
              aria-label="Sort rooms"
            >
              <option value="price-asc">{translations[language].price_low_high}</option>
              <option value="price-desc">{translations[language].price_high_low}</option>
              <option value="rating-desc">{translations[language].rating_high_low}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{translations[language].amenities}</label>
            <div className="space-y-2">
              {['wifi', 'breakfast', 'pool'].map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmenities(prev => (e.target.checked ? [...prev, value] : prev.filter(a => a !== value)));
                    }}
                  />
                  <span>{translations[language][amenity]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;