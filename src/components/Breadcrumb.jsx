const Breadcrumb = ({ language, translations }) => {
    return (
      <div className="container mx-auto px-4 py-2">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap space-x-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600">
                {translations[language].home}
              </a>
            </li>
            <li>{`>`}</li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Kenya
              </a>
            </li>
            <li>{`>`}</li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Nairobi
              </a>
            </li>
            <li>{`>`}</li>
            <li className="text-gray-800">Ocean Breeze Hotel</li>
          </ol>
        </nav>
      </div>
    );
  };
  
  export default Breadcrumb;