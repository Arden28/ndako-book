import { useState } from "react";

const BookingModal = ({ isOpen, onClose, roomId, checkIn, checkOut, guests, language, translations, currency, roomsData }) => {
    const room = roomsData.find(r => r.id === parseInt(roomId));
    const [roomsCount, setRoomsCount] = useState(1);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
  
    if (!isOpen || !room) return null;
  
    const handleSubmit = () => {
      if (guestName && guestEmail) {
        alert(`Booking ${roomsCount} ${room.name} for ${guestName} (${guestEmail}), ${guests} guest(s) from ${checkIn} to ${checkOut}`);
        onClose();
      } else {
        alert('Please fill out all required fields.');
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations[language].book_stay}</h2>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].room}</label>
              <input
                type="text"
                value={room.name}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].check_in}</label>
              <input
                type="text"
                value={checkIn}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].check_out}</label>
              <input
                type="text"
                value={checkOut}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].guests}</label>
              <input
                type="number"
                value={guests}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].number_of_rooms}</label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
              >
                {[...Array(room.available_units)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {translations[language].rooms}{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].full_name}</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].email}</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded-md">
                {translations[language].cancel}
              </button>
              <button
                onClick={handleSubmit}
                className="bg-booking-blue text-white px-4 py-2 rounded-md btn-show-prices"
              >
                {translations[language].proceed_checkout}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookingModal;