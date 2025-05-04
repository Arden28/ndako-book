const AboutHotel = ({ language, translations, onOpenMap }) => {
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations[language].about_hotel}</h2>
        <p className="text-gray-600 mb-4">{translations[language].hotel_description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              src: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              alt: 'Hotel Lobby',
            },
            {
              src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              alt: 'Hotel Pool',
            },
            {
              src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              alt: 'Hotel Room',
            },
            {
              src: 'https://images.unsplash.com/photo-1578683014728-903d55d23783?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              alt: 'Hotel Suite',
            },
          ].map(img => (
            <img key={img.src} src={img.src} alt={img.alt} className="w-full h-32 object-cover rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{translations[language].amenities}</h3>
            <ul className="text-gray-600 text-sm">
              {[
                { icon: 'fas fa-wifi', text: 'wifi' },
                { icon: 'fas fa-swimming-pool', text: 'pool' },
                { icon: 'fas fa-spa', text: 'spa' },
                { icon: 'fas fa-concierge-bell', text: 'room_service' },
                { icon: 'fas fa-dumbbell', text: 'fitness' },
              ].map(item => (
                <li key={item.text}>
                  <i className={`${item.icon} mr-2`}></i>
                  {translations[language][item.text]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{translations[language].contact}</h3>
            <p className="text-gray-600">
              <i className="fas fa-map-marker-alt mr-2"></i>123 Ocean Drive, Nairobi, Kenya
            </p>
            <p className="text-gray-600">
              <i className="fas fa-phone mr-2"></i>+254 123 456 789
            </p>
            <p className="text-gray-600">
              <i className="fas fa-envelope mr-2"></i>info@oceanbreezehotel.com
            </p>
            <button
              onClick={onOpenMap}
              className="text-blue-600 hover:underline mt-2 flex items-center"
              aria-label="See hotel on map"
            >
              <i className="fas fa-map-marker-alt mr-1"></i>
              {translations[language].see_on_map}
            </button>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutHotel;