export const roomsData = [
    {
      id: 1,
      name: "Standard Room",
      description: "A cozy room with modern amenities.",
      max_guests: 2,
      price_usd: 120,
      rating: 8.5,
      available_units: 5,
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      ],
      amenities: [
        { name: "Wi-Fi", icon: "fas fa-wifi" },
        { name: "Breakfast", icon: "fas fa-utensils" },
      ],
      size: "25 m²",
      bed_type: "1 Queen Bed",
      view: "City View",
      cancellation: "Free cancellation until 48 hours before arrival",
      unavailable_dates: ["2025-05-10", "2025-05-11"],
      genius_discount: false,
    },
    {
      id: 2,
      name: "Deluxe Room",
      description: "A spacious room with a balcony and premium amenities.",
      max_guests: 3,
      price_usd: 180,
      rating: 9.0,
      available_units: 3,
      images: [
        "https://images.unsplash.com/photo-1578683014728-903d55d23783?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      ],
      amenities: [
        { name: "Wi-Fi", icon: "fas fa-wifi" },
        { name: "Breakfast", icon: "fas fa-utensils" },
        { name: "Pool", icon: "fas fa-swimming-pool" },
      ],
      size: "35 m²",
      bed_type: "1 King Bed",
      view: "Ocean View",
      cancellation: "Free cancellation until 24 hours before arrival",
      unavailable_dates: ["2025-05-12"],
      genius_discount: true,
    },
    // Add more rooms as needed
  ];