const GuestReviews = ({ language, translations }) => {
    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations[language].guest_reviews}</h2>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-white bg-blue-800 rounded px-3 py-1 mr-2">8.7</span>
          <span className="text-gray-700">{translations[language].excellent_reviews}</span>
          <span className="ml-2 text-blue-600 text-sm genius-badge">{translations[language].verified_reviews}</span>
        </div>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 italic">{translations[language].review_1}</p>
            <p className="text-gray-800 font-semibold mt-2">Jane D. • May 2025</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600 italic">{translations[language].review_2}</p>
            <p className="text-gray-800 font-semibold mt-2">Mark S. • April 2025</p>
          </div>
        </div>
        <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">
          {translations[language].show_all_reviews}
        </a>
        <p className="text-gray-600 text-sm mt-4">{translations[language].trusted_reviews}</p>
      </section>
    );
  };
  
  export default GuestReviews;