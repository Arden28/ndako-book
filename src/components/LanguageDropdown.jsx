import { useState } from 'react';

const LanguageDropdown = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'sw', name: 'Swahili' },
  ];

  return (
    <div className="relative dropdown">
      <button
        className="text-white hover:text-gray-200 flex items-center"
        aria-label="Select language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-globe nav-icon"></i>
        <span>{languages.find(l => l.code === language)?.name}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10 ${isOpen ? '' : 'hidden'}`}>
        {languages.map(l => (
          <button
            key={l.code}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setLanguage(l.code);
              localStorage.setItem('language', l.code);
              setIsOpen(false);
            }}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageDropdown;