import { useState, useEffect } from 'react';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import BookingModal from './components/BookingModal';
import MapModal from './components/MapModal';
import { translations } from './data/translations';
import { currencyRates } from './data/currencyRates';
import { roomsData } from './data/roomsData';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [dates, setDates] = useState([new Date('2025-05-07'), new Date('2025-05-10')]);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  // const [maxPrice, setMaxPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(500 * currencyRates[currency]); // Scale maxPrice
  const [sortBy, setSortBy] = useState('price-asc');
  const [amenities, setAmenities] = useState([]);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, roomId: null, checkIn: '', checkOut: '' });
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Update maxPrice when currency changes
  useEffect(() => {
    setMaxPrice(500 * currencyRates[currency]);
  }, [currency]);

  const handleSearch = () => {
    // Trigger room list update (handled by RoomList useEffect)
  };

  const handleBook = (roomId, checkIn, checkOut) => {
    setBookingModal({ isOpen: true, roomId, checkIn, checkOut });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        translations={translations}
        dates={dates}
        setDates={setDates}
        guests={guests}
        setGuests={setGuests}
        rooms={rooms}
        setRooms={setRooms}
        onSearch={handleSearch}
      />
      <Breadcrumb language={language} translations={translations} />
      <div className="container mx-auto px-4 py-8 md:flex md:space-x-8">
        <Sidebar
          language={language}
          translations={translations}
          currency={currency}
          currencyRates={currencyRates}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          amenities={amenities}
          setAmenities={setAmenities}
        />
        <MainContent
          language={language}
          translations={translations}
          currency={currency}
          currencyRates={currencyRates}
          dates={dates}
          guests={guests}
          rooms={rooms}
          maxPrice={maxPrice}
          sortBy={sortBy}
          amenities={amenities}
          onBook={handleBook}
          onOpenMap={() => setIsMapOpen(true)}
          roomsData={roomsData}
        />
      </div>
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, roomId: null, checkIn: '', checkOut: '' })}
        roomId={bookingModal.roomId}
        checkIn={bookingModal.checkIn}
        checkOut={bookingModal.checkOut}
        guests={guests}
        language={language}
        translations={translations}
        currency={currency}
        roomsData={roomsData}
      />
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        language={language}
        translations={translations}
      />
    </div>
  );
};

export default App;