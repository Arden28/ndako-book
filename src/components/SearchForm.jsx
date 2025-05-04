import { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { roomsData } from '../data/roomsData';

const SearchForm = ({ language, translations, dates, setDates, guests, setGuests, rooms, setRooms, onSearch }) => {
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleGuestsRoomsChange = () => {
    setIsGuestsOpen(false);
    onSearch();
  };

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="search-form flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translations[language].check_in_out}
          </label>
          <Flatpickr
            value={dates}
            onChange={setDates}
            options={{
              mode: 'range',
              dateFormat: 'Y-m-d',
              minDate: 'today',
              disable: roomsData.flatMap(room => room.unavailable_dates.map(date => new Date(date))),
            }}
            className="w-full border border-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select dates"
            aria-label="Select check-in and check-out dates"
          />
        </div>
        <div className="flex-1 mb-4 md:mb-0 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translations[language].guests_rooms}
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-3 cursor-pointer rounded-full"
            readOnly
            value={`${guests} ${translations[language].guests}${guests > 1 ? 's' : ''}, ${rooms} ${translations[language].rooms}${rooms > 1 ? 's' : ''}`}
            aria-label="Select guests and rooms"
            onClick={() => setIsGuestsOpen(!isGuestsOpen)}
          />
          <div className={`absolute bg-white border rounded-lg shadow-lg p-4 mt-2 w-64 z-10 ${isGuestsOpen ? '' : 'hidden'}`}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].guests}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800"
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>
                    {n} {translations[language].guests}{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].rooms}
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800"
              >
                {[1, 2, 3].map(n => (
                  <option key={n} value={n}>
                    {n} {translations[language].rooms}{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              if (dates.length === 2) onSearch();
              else alert('Please select both check-in and check-out dates.');
            }}
            className="w-full md:w-auto bg-booking-yellow text-gray-800 font-semibold px-6 py-3 rounded-full btn-show-prices"
          >
            {translations[language].search}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;