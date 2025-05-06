import CurrencyDropdown from './CurrencyDropdown';
import LanguageDropdown from './LanguageDropdown';
import SearchForm from './SearchForm';

const Header = ({ currency, setCurrency, language, setLanguage, translations, dates, setDates, guests, setGuests, rooms, setRooms, onSearch }) => {
  return (
    <header className="header-bg text-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <a href="#" className="text-3xl font-bold flex items-center mb-4 sm:mb-0">
            <img src="/assets/images/ndako.png" style={{ height: '65px' }} alt="" />
          </a>
          <div className="flex flex-wrap items-center gap-4">
            <CurrencyDropdown currency={currency} setCurrency={setCurrency} />
            <LanguageDropdown language={language} setLanguage={setLanguage} />
            <a href="#" className="text-white hover:text-gray-200 flex items-center">
              <i className="fas fa-user nav-icon"></i> Sign in
            </a>
            <a href="#" className="bg-booking-blue text-white px-4 py-2 rounded-md flex items-center">
              <i className="fas fa-user-plus nav-icon"></i> Register
            </a>
          </div>
        </div>
        <div className="mt-4 items-center">
            <h3 className="text-lg fs-3">
              <i className="fas fa-hotel nav-icon" aria-hidden="true"></i>
              Ocean Breeze Hotel
            </h3>
            <div className="flex">
              <div className="star-rating text-2xl" aria-label="4-star hotel">
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
              </div>
              <span className="ml-2 text-lg">{translations[language].star_hotel}</span>
            </div>
        </div>
        <SearchForm
          language={language}
          translations={translations}
          dates={dates}
          setDates={setDates}
          guests={guests}
          setGuests={setGuests}
          rooms={rooms}
          setRooms={setRooms}
          onSearch={onSearch}
        />
      </div>
    </header>
  );
};



export default Header;