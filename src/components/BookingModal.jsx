import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

// Initialize Stripe (replace with your Stripe publishable key)
const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");

// Paystack public key (replace with your Paystack public key)
const paystackPublicKey = "pk_test_8895cdf5c80fc65ac2fc2d4901b50773bbad12c5";

// PayPal client ID (replace with your PayPal client ID)
const paypalClientId = "your_paypal_client_id";

const BookingModal = ({ isOpen, onClose, roomId, checkIn, checkOut, guests, language, translations, currency, roomsData }) => {
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentError, setPaymentError] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  // const navigate = useNavigate();

  // Debug roomId and roomsData
  console.log('BookingModal Props:', {
    roomId,
    roomIdType: typeof roomId,
    parsedRoomId: parseInt(roomId),
    roomsDataLength: roomsData?.length,
    roomsDataIds: roomsData?.map(r => r.id),
  });

  // Find room with fallback
  const parsedRoomId = isNaN(parseInt(roomId)) ? null : parseInt(roomId);
  const room = roomsData?.find(r => r.id === parsedRoomId) || (roomsData?.length > 0 ? roomsData[0] : null);
  console.log('Room:', room);

  // Carousel auto-slide (optional, can be removed if not desired)
  useEffect(() => {
    if (!room || !room.images || room.images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [room?.images?.length]);

  // Confetti animation on success
  useEffect(() => {
    if (paymentStatus === 'success') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#2196F3', '#FF9800'],
      });
    }
  }, [paymentStatus]);
  
  // Generate PDF receipt
  const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = 'https://via.placeholder.com/150x50.png?text=Hotel+Logo'; // Replace with your logo URL
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Confirmation', pageWidth / 2, 20, { align: 'center' });
    
    // Logo
    try {
      doc.addImage(logoUrl, 'PNG', 20, 30, 50, 15);
    } catch (error) {
      console.error('Failed to add logo:', error);
    }
    
    // Booking Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let y = 60;
    const details = [
      `Guest Name: ${guestName}`,
      `Email: ${guestEmail}`,
      `Room: ${room.name}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Nights: ${nights}`,
      `Guests: ${guests}`,
      `Rooms: ${roomsCount}`,
      `Subtotal: ${currency} ${subtotal.toFixed(2)}`,
      `Discount: ${currency} ${discountAmount.toFixed(2)}`,
      `Total Paid: ${currency} ${total.toFixed(2)}`,
      `Downpayment: ${currency} ${downpayment.toFixed(2)}`,
      `Payment Method: ${paymentMethod}`,
      `Reference: ${paymentReference || 'N/A'}`,
    ];
    
    details.forEach((line) => {
      doc.text(line, 20, y);
      y += 10;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing our hotel!', pageWidth / 2, y + 10, { align: 'center' });
    doc.text('Contact: support@ndako.tech | +254 701 48 90 35', pageWidth / 2, y + 20, { align: 'center' });
    doc.text('Powered by Ndako', pageWidth / 2, y + 30, { align: 'center', color: 667382 });
    
    doc.save(`Booking_Confirmation_${paymentReference || 'N/A'}.pdf`);
  };

  if (!isOpen || !room) {
    console.log('Modal not rendered:', { isOpen, room });
    return null;
  }

  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;

  // Calculate pricing
  const currencyRates = { USD: 1, EUR: 0.95, KES: 129 }; // Fallback
  const pricePerNight = room.price_usd * (currencyRates[currency] || 1);
  const discount = room.genius_discount ? 0.1 : 0; // 10% Genius discount
  const subtotal = pricePerNight * nights * roomsCount;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const downpaymentPercentage = 20; // Configurable downpayment
  const downpayment = (total * downpaymentPercentage) / 100;

  // Carousel navigation
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  const goToImage = (index) => setCurrentImageIndex(index);

  // Stripe payment component
  const StripePayment = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleStripePayment = async () => {
      if (!stripe || !elements) {
        setPaymentError(translations[language].payment_failed || 'Payment setup failed.');
        return;
      }
      setPaymentStatus('processing');
      setPaymentError('');
      try {
        // Mock server-side checkout session creation
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total * 100, // Convert to cents
            currency: currency.toLowerCase(),
            roomId,
            roomsCount,
            checkIn,
            checkOut,
            guestName,
            guestEmail,
          }),
        });
        const { sessionId } = await response.json();

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          setPaymentStatus('error');
          setPaymentError(error.message);
        } else {
          setPaymentStatus('success');
          setPaymentReference(sessionId);
        }
      } catch (error) {
        setPaymentStatus('error');
        setPaymentError(translations[language].payment_failed || 'Payment failed. Please try again.');
      }
    };

    return (
      <div className="mt-4">
        <CardElement className="border border-gray-300 rounded-md p-3" />
        <button
          onClick={handleStripePayment}
          className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={paymentStatus === 'processing' || !guestName || !guestEmail}
        >
          {paymentStatus === 'processing' ? translations[language].processing || 'Processing...' : translations[language].pay_with_stripe || 'Pay with Stripe'}
        </button>
      </div>
    );
  };

  // Paystack payment component (using inline JS)
  const PaystackPayment = () => {
    const handlePaystackPayment = () => {
      if (!window.PaystackPop) {
        setPaymentError(translations[language].paystack_not_loaded || 'Paystack script not loaded. Please try again.');
        return;
      }
      setPaymentStatus('processing');
      setPaymentError('');
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: guestEmail,
        amount: total * 100, // Amount in kobo (for KES, cents equivalent)
        currency: currency,
        ref: new Date().getTime().toString(),
        callback: (response) => {
          setPaymentStatus('success');
          setPaymentReference(response.reference);
        },
        onClose: () => {
          setPaymentStatus('idle');
          setPaymentError('');
        },
      });
      handler.openIframe();
    };

    return (
      <button
        onClick={handlePaystackPayment}
        className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        disabled={paymentStatus === 'processing' || !guestName || !guestEmail}
      >
        {paymentStatus === 'processing' ? translations[language].processing || 'Processing...' : translations[language].pay_with_paystack || 'Pay with Paystack'}
      </button>
    );
  };

  // PayPal payment component
  const PayPalPayment = () => {
    return (
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                  currency_code: currency,
                },
                description: `Booking ${roomsCount} ${room.name} for ${checkIn} to ${checkOut}`,
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          setPaymentStatus('processing');
          setPaymentError('');
          try {
            const order = await actions.order.capture();
            setPaymentStatus('success');
            setPaymentReference(order.id);
          } catch (error) {
            setPaymentStatus('error');
            setPaymentError(translations[language].payment_failed || 'Payment failed. Please try again.');
          }
        }}
        onError={(err) => {
          setPaymentStatus('error');
          setPaymentError(translations[language].payment_failed || 'Payment failed. Please try again.');
        }}
      />
    );
  };

  const handleSubmit = () => {
    if (!guestName || !guestEmail) {
      setPaymentError(translations[language].fill_required_fields || 'Please fill out all required fields.');
      return;
    }
    if (!paymentMethod) {
      setPaymentError(translations[language].select_payment_method || 'Please select a payment method.');
      return;
    }
    // Payment is handled by respective components
  };

  // Success message
  if (paymentStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 opacity-100 z-50">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-2xl max-w-lg sm:max-w-xl md:max-w-3xl w-full mx-2 sm:mx-4 min-h-[60vh] max-h-[90vh] overflow-y-auto p-6 sm:p-8 md:p-10 animate-fade-in scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="text-center">
            <i className="fas fa-check-circle text-green-600 text-4xl sm:text-5xl md:text-6xl mb-4 animate-bounce"></i>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {translations[language].booking_confirmed || 'Booking Confirmed!'}
            </h1>
            <p className="text-base sm:text-base md:text-lg font-sans text-gray-700 mb-6">
              {translations[language].booking_confirmed_message || 'Your reservation has been successfully processed. We look forward to welcoming you!'}
            </p>
          </div>
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-semibold text-gray-800 mb-4">
              {translations[language].stay_details || 'Stay Details'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-sm md:text-base text-gray-700">
              <div>
                <span className="font-medium">{translations[language].guest_name || 'Guest Name'}:</span> {guestName}
              </div>
              <div>
                <span className="font-medium">{translations[language].email || 'Email'}:</span> {guestEmail}
              </div>
              <div>
                <span className="font-medium">{translations[language].room || 'Room'}:</span> {room.name}
              </div>
              <div>
                <span className="font-medium">{translations[language].check_in || 'Check-in'}:</span> {checkIn}
              </div>
              <div>
                <span className="font-medium">{translations[language].check_out || 'Check-out'}:</span> {checkOut}
              </div>
              <div>
                <span className="font-medium">{translations[language].nights || 'Nights'}:</span> {nights}
              </div>
              <div>
                <span className="font-medium">{translations[language].guests || 'Guests'}:</span> {guests}
              </div>
              <div>
                <span className="font-medium">{translations[language].number_of_rooms || 'Rooms'}:</span> {roomsCount}
              </div>
              <div>
                <span className="font-medium">{translations[language].subtotal || 'Subtotal'}:</span> {currency} {subtotal.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">{translations[language].discount || 'Discount'}:</span> {currency} {discountAmount.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">{translations[language].total || 'Total Paid'}:</span> {currency} {total.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">{translations[language].downpayment || 'Downpayment'}:</span> {currency} {downpayment.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">{translations[language].payment_method || 'Payment Method'}:</span> {paymentMethod}
              </div>
              <div>
                <span className="font-medium">{translations[language].reference || 'Reference'}:</span> {paymentReference || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={generatePDF}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 hover:transform hover:scale-105 transition-all flex items-center justify-center text-sm sm:text-sm md:text-base"
            >
              <i className="fas fa-download mr-2"></i>
              {translations[language].download_receipt || 'Download Receipt'}
            </button>
            <a
              href={`mailto:${guestEmail}?subject=Booking Confirmation&body=Dear ${guestName},%0A%0AYour booking for ${room.name} has been confirmed.%0AReference: ${paymentReference || 'N/A'}%0ATotal: ${currency} ${total.toFixed(2)}%0A%0AThank you!`}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 hover:transform hover:scale-105 transition-all flex items-center justify-center text-sm sm:text-sm md:text-base"
            >
              <i className="fas fa-envelope mr-2"></i>
              {translations[language].send_confirmation || 'Send Confirmation'}
            </a>
            <a
              href={`https://x.com/intent/post?text=I just booked a stay at ${room.name}! Excited for my trip! #Travel #HotelBooking`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-gray-800 hover:to-gray-900 hover:transform hover:scale-105 transition-all flex items-center justify-center text-sm sm:text-sm md:text-base"
            >
              <i className="fab fa-x-twitter mr-2"></i>
              {translations[language].share_on_x || 'Share on X'}
            </a>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 hover:transform hover:scale-105 transition-all flex items-center justify-center text-sm sm:text-sm md:text-base"
            >
              <i className="fas fa-times mr-2"></i>
              {translations[language].close || 'Close'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-sm md:text-base">
              {translations[language].upsell_message || 'Enhance your stay with our exclusive spa and dining experiences!'}
            </p>
            <button
              onClick={() => window.location.href = '/services'} // Replace with actual services page
              className="mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-sm md:text-base"
            >
              {translations[language].explore_more || 'Explore More'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50`}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 animate-fade-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 z-10"
          aria-label={translations[language].close || 'Close'}
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <div className="flex flex-col sm:flex-row">
          {/* Left Side: Room Details */}
          <div className="sm:w-1/2 p-4 sm:p-6 bg-gray-50">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{room.name}</h2>
            {/* Gallery */}
            <div className="relative mb-6">
              <img
                src={room.images[currentImageIndex]}
                alt={`${room.name} ${currentImageIndex + 1}`}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100"
                aria-label="Previous image"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full hover:bg-opacity-100"
                aria-label="Next image"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className="flex mt-2 space-x-2 overflow-x-auto">
                {room.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${room.name} thumbnail ${idx + 1}`}
                    className={`w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-md cursor-pointer ${idx === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </div>
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">{translations[language].features || 'Features'}</h3>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                <li><i className="fas fa-ruler-combined mr-2"></i>{room.size}</li>
                <li><i className="fas fa-bed mr-2"></i>{room.bed_type}</li>
                <li><i className="fas fa-eye mr-2"></i>{room.view}</li>
                <li><i className="fas fa-info-circle mr-2"></i>{room.cancellation}</li>
                {room.amenities.map(a => (
                  <li key={a.name}><i className={`${a.icon} mr-2`}></i>{a.name}</li>
                ))}
              </ul>
            </div>
            {/* Price per Night */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">{translations[language].price_per_night || 'Price per Night'}</h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {currency} {pricePerNight.toFixed(2)}
                {room.genius_discount && (
                  <span className="ml-2 text-xs sm:text-sm text-green-600">{translations[language].genius_discount || 'Genius Discount'}</span>
                )}
              </p>
            </div>
          </div>

          {/* Right Side: Booking Details */}
          <div className="sm:w-1/2 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{translations[language].book_your_stay || 'Book Your Stay'}</h2>
            <div className="space-y-4">
              {/* Check-in */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].check_in}</label>
                <input
                  type="text"
                  value={checkIn}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-gray-100 text-xs sm:text-sm"
                />
              </div>
              {/* Check-out */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].check_out}</label>
                <input
                  type="text"
                  value={checkOut}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-gray-100 text-xs sm:text-sm"
                />
              </div>
              {/* Number of Nights */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].nights || 'Nights'}</label>
                <input
                  type="text"
                  value={nights}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-gray-100 text-xs sm:text-sm"
                />
              </div>
              {/* Guests */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].guests}</label>
                <input
                  type="number"
                  value={guests}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-gray-100 text-xs sm:text-sm"
                />
              </div>
              {/* Number of Rooms */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].number_of_rooms}</label>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 text-xs sm:text-sm"
                >
                  {[...Array(room.available_units)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {translations[language].rooms}{i + 1 > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {/* Guest Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].full_name}</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                  aria-required="true"
                />
              </div>
              {/* Guest Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{translations[language].email}</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                  aria-required="true"
                />
              </div>
              {/* Pricing Summary */}
              <div className="border-t pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">{translations[language].summary || 'Summary'}</h3>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{translations[language].subtotal || 'Subtotal'}</span>
                    <span>{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{translations[language].discount || 'Discount'} (Genius)</span>
                      <span>-{currency} {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{translations[language].total || 'Total'}</span>
                    <span>{currency} {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>{translations[language].downpayment || 'Downpayment'} ({downpaymentPercentage}%)</span>
                    <span>{currency} {downpayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {/* Payment Options */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">{translations[language].payment_method || 'Payment Method'}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => setPaymentMethod('Stripe')}
                    className={`flex items-center justify-center p-2 border rounded-md text-xs sm:text-sm ${paymentMethod === 'Stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <i className="fas fa-credit-card mr-2"></i> Stripe
                  </button>
                  {currency === 'KES' && (
                    <button
                      onClick={() => setPaymentMethod('Paystack')}
                      className={`flex items-center justify-center p-2 border rounded-md text-xs sm:text-sm ${paymentMethod === 'Paystack' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <i className="fas fa-money-bill-wave mr-2"></i> Paystack
                    </button>
                  )}
                  <button
                    onClick={() => setPaymentMethod('PayPal')}
                    className={`flex items-center justify-center p-2 border rounded-md text-xs sm:text-sm ${paymentMethod === 'PayPal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <i className="fab fa-paypal mr-2"></i> PayPal
                  </button>
                </div>
                {paymentStatus === 'processing' && (
                  <div className="flex justify-center mb-4">
                    <i className="fas fa-spinner animate-spin text-blue-600 text-2xl"></i>
                  </div>
                )}
                {paymentError && (
                  <div className="text-red-600 text-xs sm:text-sm mb-4">{paymentError}</div>
                )}
                {paymentMethod === 'Stripe' && (
                  <Elements stripe={stripePromise}>
                    <StripePayment />
                  </Elements>
                )}
                {paymentMethod === 'Paystack' && currency === 'KES' && <PaystackPayment />}
                {paymentMethod === 'PayPal' && (
                  <PayPalScriptProvider options={{ "client-id": paypalClientId, currency }}>
                    <PayPalPayment />
                  </PayPalScriptProvider>
                )}
              </div>
              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 text-xs sm:text-sm"
                >
                  {translations[language].cancel}
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-booking-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors btn-show-prices text-xs sm:text-sm"
                  disabled={paymentStatus === 'processing' || !guestName || !guestEmail || !paymentMethod}
                >
                  {translations[language].reserve_room || 'Reserve Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;