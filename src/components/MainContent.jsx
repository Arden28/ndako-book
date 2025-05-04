
import RoomList from './RoomList';
import HotelDetails from './HotelDetails';
import GuestReviews from './GuestReviews';
import AboutHotel from './AboutHotel';

const MainContent = ({
  language,
  translations,
  currency,
  currencyRates,
  dates,
  guests,
  rooms,
  maxPrice,
  sortBy,
  amenities,
  onBook,
  onOpenMap,
  roomsData,
}) => {
  return (
    <main className="md:w-3/4">
      <HotelDetails language={language} translations={translations} onOpenMap={onOpenMap} />
      <RoomList
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
        onBook={onBook}
        roomsData={roomsData}
      />
      <GuestReviews language={language} translations={translations} />
      <AboutHotel language={language} translations={translations} onOpenMap={onOpenMap} />
    </main>
  );
};

export default MainContent;