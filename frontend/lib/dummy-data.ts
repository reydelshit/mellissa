// Dummy data for the store locator app

// Stores
export const dummyStores = [
  {
    id: "store1",
    name: "Cafe Delight",
    category: "cafe",
    location: "123 Main St, New York, NY",
    description: "A cozy cafe offering specialty coffee and pastries.",
    openingHours: "Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM",
    rating: 4,
    reviewCount: 128,
    promotions: ["Happy Hour 4-6PM", "10% Off for Students"],
  },
  {
    id: "store2",
    name: "Burger Haven",
    category: "restaurant",
    location: "456 Oak Ave, Brooklyn, NY",
    description: "Gourmet burgers and craft beers in a casual setting.",
    openingHours: "Daily: 11AM-10PM",
    rating: 5,
    reviewCount: 256,
    promotions: ["Buy 1 Get 1 Tuesday", "Free Fries with Burger"],
  },
  {
    id: "store3",
    name: "Fresh Market",
    category: "grocery",
    location: "789 Pine Rd, Queens, NY",
    description: "Local grocery store with fresh produce and organic options.",
    openingHours: "Mon-Sun: 8AM-9PM",
    rating: 3,
    reviewCount: 87,
    promotions: ["20% Off Organic Produce", "Senior Discount Wednesdays"],
  },
]

// Menu Items
export const dummyMenuItems = [
  {
    id: "item1",
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    category: "Main",
  },
  {
    id: "item2",
    name: "French Fries",
    description: "Crispy golden fries with sea salt",
    price: 3.99,
    category: "Side",
  },
  {
    id: "item3",
    name: "Chocolate Milkshake",
    description: "Creamy milkshake with premium chocolate",
    price: 4.99,
    category: "Beverage",
  },
  {
    id: "item4",
    name: "Caesar Salad",
    description: "Fresh romaine with parmesan, croutons and Caesar dressing",
    price: 7.99,
    category: "Main",
  },
  {
    id: "item5",
    name: "Onion Rings",
    description: "Crispy battered onion rings",
    price: 4.99,
    category: "Side",
  },
  {
    id: "item6",
    name: "Iced Tea",
    description: "Freshly brewed and sweetened to perfection",
    price: 2.99,
    category: "Beverage",
  },
]

// Orders
export const dummyOrders = [
  {
    id: "order123456789",
    customer: "John Smith",
    items: [
      { id: "item1", name: "Classic Burger", quantity: 2, price: 9.99 },
      { id: "item2", name: "French Fries", quantity: 1, price: 3.99 },
    ],
    total: 23.97,
    status: "pending",
    date: "2023-04-01",
  },
  {
    id: "order987654321",
    customer: "Jane Doe",
    items: [
      { id: "item3", name: "Chocolate Milkshake", quantity: 1, price: 4.99 },
      { id: "item4", name: "Caesar Salad", quantity: 1, price: 7.99 },
    ],
    total: 12.98,
    status: "completed",
    date: "2023-04-02",
  },
  {
    id: "order456789123",
    customer: "Bob Johnson",
    items: [
      { id: "item1", name: "Classic Burger", quantity: 1, price: 9.99 },
      { id: "item5", name: "Onion Rings", quantity: 1, price: 4.99 },
      { id: "item6", name: "Iced Tea", quantity: 2, price: 2.99 },
    ],
    total: 20.96,
    status: "pending",
    date: "2023-04-03",
  },
]

// Reviews
export const dummyReviews = [
  {
    id: "review1",
    customer: "John Smith",
    rating: 5,
    comment: "Great food and excellent service! Will definitely come back.",
    date: "2023-03-28",
  },
  {
    id: "review2",
    customer: "Jane Doe",
    rating: 4,
    comment: "Food was delicious but the wait was a bit long.",
    date: "2023-03-25",
  },
  {
    id: "review3",
    customer: "Bob Johnson",
    rating: 3,
    comment: "Average experience. Nothing special but not bad either.",
    date: "2023-03-20",
  },
  {
    id: "review4",
    customer: "Alice Williams",
    rating: 5,
    comment: "Best burgers in town! Friendly staff and clean environment.",
    date: "2023-03-15",
  },
  {
    id: "review5",
    customer: "Charlie Brown",
    rating: 4,
    comment: "Good value for money. The milkshakes are amazing!",
    date: "2023-03-10",
  },
]

