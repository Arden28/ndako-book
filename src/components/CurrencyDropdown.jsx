import { useState } from 'react';

const CurrencyDropdown = ({ currency, setCurrency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currencies = [
    { code: 'USD', name: 'USD - US Dollar' },
    { code: 'EUR', name: 'EUR - Euro' },
    { code: 'KES', name: 'KES - Kenyan Shilling' },
  ];

  return (
    <div className="relative dropdown">
      <button
        className="text-white hover:text-gray-200 flex items-center"
        aria-label="Select currency"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-dollar-sign nav-icon"></i>
        <span>{currency}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-10 ${isOpen ? '' : 'hidden'}`}>
        {currencies.map(c => (
          <button
            key={c.code}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setCurrency(c.code);
              localStorage.setItem('currency', c.code);
              setIsOpen(false);
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyDropdown;