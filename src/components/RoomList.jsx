import { useState, useEffect } from 'react';

const RoomList = ({ language, translations, currency, currencyRates, dates, guests, rooms, maxPrice, sortBy, amenities, onBook, roomsData }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200); // Simulate loading
    return () => clearTimeout(timer);
  }, [dates, guests, rooms, maxPrice, sortBy, amenities]);

  // Validate props
  if (!currency || !currencyRates || !currencyRates[currency] || !roomsData || !Array.isArray(roomsData)) {
    console.error('Invalid props:', { currency, currencyRates, roomsData });
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{translations[language]?.available_rooms || 'Available Rooms'}</h2>
        <p className="text-gray-600">Error: Invalid data provided.</p>
      </section>
    );
  }

  // Normalize maxPrice to USD, with a fallback to avoid over-filtering
  const maxPriceInUSD = (maxPrice && currencyRates[currency]) ? maxPrice / currencyRates[currency] : 1000;
  console.log('RoomList Debug:', { currency, maxPrice, maxPriceInUSD, roomsDataLength: roomsData.length });

  const filteredRooms = roomsData.filter(room => {
    const [checkIn, checkOut] = dates.length === 2 ? [dates[0], dates[1]] : ['', ''];
    const isAvailable = !room.unavailable_dates.some(date => {
      const d = new Date(date);
      return d >= new Date(checkIn) && d <= new Date(checkOut);
    });
    const hasGuests = room.max_guests >= guests;
    const hasRooms = room.available_units >= rooms;
    const withinPrice = room.price_usd <= maxPriceInUSD;
    const hasAmenities = amenities.length === 0 || amenities.every(amenity => room.amenities.some(a => a.name.toLowerCase() === amenity));

    // Debug each room's filtering
    console.log('Room Filter:', {
      roomId: room.id,
      roomName: room.name,
      priceUSD: room.price_usd,
      withinPrice,
      isAvailable,
      hasGuests,
      hasRooms,
      hasAmenities
    });

    return isAvailable && hasGuests && hasRooms && withinPrice && hasAmenities;
  });

  console.log('Filtered Rooms:', filteredRooms.length, filteredRooms.map(r => r.name));

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price_usd - b.price_usd;
    if (sortBy === 'price-desc') return b.price_usd - a.price_usd;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{translations[language].available_rooms}</h2>
      <div className="space-y-6">
        {isLoading ? (
          <div className="spinner"></div>
        ) : sortedRooms.length === 0 ? (
          <p className="text-gray-600">{translations[language].no_rooms}</p>
        ) : (
          sortedRooms.map(room => (
            <div key={room.id} className="room-card bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row fade-in">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-full md:w-1/3 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-2">{room.rating}</span>
                  {Array(Math.round(room.rating / 2))
                    .fill()
                    .map((_, i) => (
                      <i key={i} className="fas fa-star star-rating"></i>
                    ))}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-ruler-combined mr-2"></i>
                  {room.size}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-bed mr-2"></i>
                  {room.bed_type}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <i className="fas fa-eye mr-2"></i>
                  {room.view}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  {room.cancellation}
                </p>
                <ul className="text-sm text-gray-600 mb-2">
                  {room.amenities.map(a => (
                    <li key={a.name}>
                      <i className={`${a.icon} mr-2`}></i>
                      {a.name}
                    </li>
                  ))}
                </ul>
                {room.genius_discount && <span className="genius-badge inline-block mb-2">Genius Discount</span>}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-800">
                    {currency} {(room.price_usd * currencyRates[currency]).toFixed(2)}
                  </p>
                  <button
                    className="btn-show-prices bg-booking-blue text-white px-4 py-2 rounded-md"
                    onClick={() => onBook(room.id, dates[0]?.toISOString().split('T')[0], dates[1]?.toISOString().split('T')[0])}
                  >
                    {translations[language].book_stay}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RoomList;