const MapModal = ({ isOpen, onClose, language, translations }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal map-modal">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations[language].hotel_location}</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.815093295356!2d36.82194631475529!3d-1.286389999054327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMTAuMCJTIDM2wrA0OSc0Mi4zIkU!5e0!3m2!1sen!2sus!4v1634567890123"
            allowFullScreen
            aria-label="Map of Ocean Breeze Hotel"
            className="w-full h-[400px] border-0"
          ></iframe>
          <div className="mt-4 flex justify-between">
            <img
              src="https://via.placeholder.com/200x100?text=Static+Map"
              alt="Static map of Ocean Breeze Hotel"
              className="h-24"
            />
            <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded-md" aria-label="Close map">
              {translations[language].close}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default MapModal;