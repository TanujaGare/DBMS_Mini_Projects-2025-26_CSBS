require('dotenv').config();
const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const MenuItem = require('./models/MenuItem');
const InventoryItem = require('./models/InventoryItem');
const Staff = require('./models/Staff');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── RESERVATIONS ──
  const resCount = await Reservation.countDocuments();
  if (resCount === 0) {
    await Reservation.insertMany([
      { name:'Vikram Mehta', phone:'98765 43210', date:'Today', time:'7:00 PM', guests:4, pref:'Window', notes:'Anniversary', status:'confirmed' },
      { name:'Aisha Kapoor', phone:'87654 32109', date:'Today', time:'7:30 PM', guests:2, pref:'Private', notes:'', status:'confirmed' },
      { name:'Rohan Desai', phone:'76543 21098', date:'Today', time:'8:00 PM', guests:6, pref:'Terrace', notes:'Birthday cake', status:'pending' },
      { name:'Sneha Joshi', phone:'65432 10987', date:'Today', time:'8:30 PM', guests:3, pref:'Any', notes:'Vegetarian only', status:'confirmed' },
      { name:'Kabir Singh', phone:'54321 09876', date:'Today', time:'9:00 PM', guests:8, pref:'Private', notes:'Corporate dinner', status:'pending' },
    ]);
    console.log('Seeded 5 reservations');
  } else {
    console.log(`Reservations already exist (${resCount}), skipping`);
  }

  // ── MENU ITEMS ──
  const menuCount = await MenuItem.countDocuments();
  if (menuCount === 0) {
    await MenuItem.insertMany([
      { name:'Paneer Tikka', category:'Starters', price:380, emoji:'🧀', desc:'Cottage cheese marinated in spiced yogurt, grilled in tandoor.' },
      { name:'Seekh Kebab', category:'Starters', price:420, emoji:'🍢', desc:'Minced lamb skewers with aromatic herbs & spices.' },
      { name:'Veg Samosa', category:'Starters', price:180, emoji:'🥟', desc:'Crisp pastry filled with spiced potato & peas.' },
      { name:'Butter Chicken', category:'Mains', price:480, emoji:'🍗', desc:'Tender chicken in rich tomato-butter gravy.' },
      { name:'Dal Makhani', category:'Mains', price:320, emoji:'🍲', desc:'Slow-cooked black lentils with cream & butter.' },
      { name:'Fish Curry', category:'Mains', price:580, emoji:'🐟', desc:'Coastal style fish in coconut milk & fresh spices.' },
      { name:'Veg Biryani', category:'Mains', price:380, emoji:'🍚', desc:'Fragrant basmati rice with seasonal vegetables.' },
      { name:'Garlic Naan', category:'Breads', price:80, emoji:'🫓', desc:'Soft leavened bread with garlic & butter.' },
      { name:'Tandoori Roti', category:'Breads', price:50, emoji:'🫓', desc:'Whole wheat bread baked in tandoor.' },
      { name:'Gulab Jamun', category:'Desserts', price:160, emoji:'🍮', desc:'Soft milk-solid dumplings in rose-scented syrup.' },
      { name:'Kheer', category:'Desserts', price:140, emoji:'🍚', desc:'Creamy rice pudding with cardamom & saffron.' },
      { name:'Mango Lassi', category:'Beverages', price:120, emoji:'🥭', desc:'Blended yogurt drink with fresh Alphonso mangoes.' },
      { name:'Masala Chai', category:'Beverages', price:60, emoji:'☕', desc:'Spiced Indian tea with ginger & cardamom.' },
    ]);
    console.log('Seeded 13 menu items');
  } else {
    console.log(`Menu items already exist (${menuCount}), skipping`);
  }

  // ── INVENTORY ──
  const invCount = await InventoryItem.countDocuments();
  if (invCount === 0) {
    await InventoryItem.insertMany([
      { name:'Basmati Rice', cat:'Grains', qty:25, unit:'kg', min:10 },
      { name:'Chicken', cat:'Proteins', qty:8, unit:'kg', min:15 },
      { name:'Paneer', cat:'Dairy', qty:5, unit:'kg', min:8 },
      { name:'Tomatoes', cat:'Vegetables', qty:12, unit:'kg', min:5 },
      { name:'Onions', cat:'Vegetables', qty:18, unit:'kg', min:10 },
      { name:'Ghee', cat:'Dairy', qty:3, unit:'L', min:5 },
      { name:'Garam Masala', cat:'Spices', qty:0.8, unit:'kg', min:0.5 },
      { name:'Mango Pulp', cat:'Beverages', qty:4, unit:'L', min:6 },
      { name:'Black Lentils', cat:'Grains', qty:9, unit:'kg', min:4 },
      { name:'Fresh Cream', cat:'Dairy', qty:2, unit:'L', min:3 },
    ]);
    console.log('Seeded 10 inventory items');
  } else {
    console.log(`Inventory already exists (${invCount}), skipping`);
  }

  // ── STAFF ──
  const staffCount = await Staff.countDocuments();
  if (staffCount === 0) {
    await Staff.insertMany([
      { name:'Chef Anand', role:'Head Chef', shift:'Evening', emoji:'👨‍🍳', status:'on-shift' },
      { name:'Meera Nair', role:'Sous Chef', shift:'Evening', emoji:'👩‍🍳', status:'on-shift' },
      { name:'Arjun Patel', role:'Waiter', shift:'Evening', emoji:'🧑', status:'on-shift' },
      { name:'Priya Sharma', role:'Waiter', shift:'Evening', emoji:'👩', status:'on-shift' },
      { name:'Rahul Gupta', role:'Waiter', shift:'Evening', emoji:'🧑', status:'on-shift' },
      { name:'Sneha Reddy', role:'Waiter', shift:'Evening', emoji:'👩', status:'on-shift' },
      { name:'Vijay Kumar', role:'Bartender', shift:'Evening', emoji:'🧑', status:'on-shift' },
      { name:'Anita Singh', role:'Host', shift:'Evening', emoji:'👩', status:'break' },
    ]);
    console.log('Seeded 8 staff members');
  } else {
    console.log(`Staff already exists (${staffCount}), skipping`);
  }

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
