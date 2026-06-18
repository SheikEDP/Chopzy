// config/seeder.js
// Run with: node config/seeder.js
require('dotenv').config();
const { sequelize, Category, Product } = require('../models');

const categories = [
  { name: 'Vegetables', emoji: '🥦', color: '#2E7D32', image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', description: 'Farm-fresh vegetables, raw & cut', sort_order: 1 },
  { name: 'Fruits',     emoji: '🍎', color: '#E53935', image_url: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80', description: 'Seasonal fruits, raw & sliced',    sort_order: 2 },
  { name: 'Health Food',emoji: '🥗', color: '#00897B', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', description: 'Salad packs & healthy combos',    sort_order: 3 },
  { name: 'Fresh Juice', emoji: '🍹', color: '#FB8C00', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80', description: 'Cold-pressed & natural juices',   sort_order: 4 },
];

// Products mapped by category name
const productsByCat = {
  Vegetables: [
    { name: 'Fresh Tomatoes',    product_type: 'raw',  price: 35,  original_price: null, unit: '500g',       emoji: '🍅', image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', rating: 4.6, review_count: 89,  badge: null,           sort_order: 1 },
    { name: 'Broccoli',          product_type: 'raw',  price: 55,  original_price: null, unit: '1 piece',    emoji: '🥦', image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80', rating: 4.7, review_count: 67,  badge: 'Fresh',        sort_order: 2 },
    { name: 'Carrots',           product_type: 'raw',  price: 25,  original_price: null, unit: '500g',       emoji: '🥕', image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80', rating: 4.4, review_count: 91,  badge: null,           sort_order: 3 },
    { name: 'Potatoes',          product_type: 'raw',  price: 30,  original_price: null, unit: '1 kg',       emoji: '🥔', image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', rating: 4.3, review_count: 67,  badge: null,           sort_order: 4 },
    { name: 'Onions',            product_type: 'raw',  price: 40,  original_price: null, unit: '1 kg',       emoji: '🧅', image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80', rating: 4.2, review_count: 52,  badge: null,           sort_order: 5 },
    { name: 'Organic Spinach',   product_type: 'raw',  price: 29,  original_price: null, unit: '250g',       emoji: '🥬', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', rating: 4.8, review_count: 124, badge: 'Organic',      sort_order: 6 },
    { name: 'Cauliflower',       product_type: 'raw',  price: 45,  original_price: null, unit: '1 piece',    emoji: '🥦', image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80', rating: 4.5, review_count: 78,  badge: null,           sort_order: 7 },
    { name: 'Beetroot',          product_type: 'raw',  price: 35,  original_price: null, unit: '500g',       emoji: '🫚', image_url: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80', rating: 4.3, review_count: 43,  badge: null,           sort_order: 8 },
    { name: 'Cut Mixed Veggies', product_type: 'cut',  price: 65,  original_price: null, unit: '500g pack',  emoji: '🥗', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', rating: 4.7, review_count: 135, badge: 'Ready to Cook',sort_order: 9 },
    { name: 'Sliced Onions',     product_type: 'cut',  price: 50,  original_price: null, unit: '250g pack',  emoji: '🧅', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', rating: 4.4, review_count: 62,  badge: null,           sort_order: 10 },
    { name: 'Chopped Spinach',   product_type: 'cut',  price: 45,  original_price: null, unit: '200g pack',  emoji: '🥬', image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', rating: 4.6, review_count: 88,  badge: 'Fresh Cut',    sort_order: 11 },
    { name: 'Diced Carrots',     product_type: 'cut',  price: 40,  original_price: null, unit: '250g pack',  emoji: '🥕', image_url: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80', rating: 4.5, review_count: 55,  badge: null,           sort_order: 12 },
    { name: 'Stir Fry Medley',   product_type: 'cut',  price: 75,  original_price: null, unit: '400g pack',  emoji: '🫛', image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', rating: 4.8, review_count: 102, badge: 'Chef Special', sort_order: 13 },
    { name: 'Cut Cauliflower',   product_type: 'cut',  price: 55,  original_price: null, unit: '300g pack',  emoji: '🥦', image_url: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400&q=80', rating: 4.4, review_count: 47,  badge: null,           sort_order: 14 },
  ],
  Fruits: [
    { name: 'Red Apples',        product_type: 'raw',  price: 120, original_price: 140, unit: '1 kg',       emoji: '🍎', image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80', rating: 4.9, review_count: 203, badge: 'Premium',      sort_order: 1 },
    { name: 'Bananas',           product_type: 'raw',  price: 45,  original_price: null, unit: '1 dozen',   emoji: '🍌', image_url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80', rating: 4.5, review_count: 156, badge: null,           sort_order: 2 },
    { name: 'Alphonso Mangoes',  product_type: 'raw',  price: 150, original_price: 180, unit: '1 kg',       emoji: '🥭', image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', rating: 4.9, review_count: 445, badge: 'Seasonal',     sort_order: 3 },
    { name: 'Green Grapes',      product_type: 'raw',  price: 85,  original_price: null, unit: '500g',      emoji: '🍇', image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80', rating: 4.6, review_count: 134, badge: null,           sort_order: 4 },
    { name: 'Watermelon',        product_type: 'raw',  price: 60,  original_price: null, unit: '1 piece',   emoji: '🍉', image_url: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80', rating: 4.7, review_count: 189, badge: null,           sort_order: 5 },
    { name: 'Oranges',           product_type: 'raw',  price: 80,  original_price: null, unit: '1 kg',      emoji: '🍊', image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80', rating: 4.5, review_count: 97,  badge: 'Fresh',        sort_order: 6 },
    { name: 'Papaya',            product_type: 'raw',  price: 55,  original_price: null, unit: '1 piece',   emoji: '🧡', image_url: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&q=80', rating: 4.4, review_count: 74,  badge: null,           sort_order: 7 },
    { name: 'Pomegranate',       product_type: 'raw',  price: 110, original_price: 130, unit: '2 pieces',   emoji: '🍎', image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', rating: 4.8, review_count: 118, badge: 'Premium',      sort_order: 8 },
    { name: 'Mixed Fruit Bowl',  product_type: 'cut',  price: 99,  original_price: null, unit: '400g bowl', emoji: '🥗', image_url: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80', rating: 4.8, review_count: 231, badge: 'Best Seller',  sort_order: 9 },
    { name: 'Sliced Mango',      product_type: 'cut',  price: 85,  original_price: null, unit: '250g pack', emoji: '🥭', image_url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80', rating: 4.9, review_count: 178, badge: null,           sort_order: 10 },
    { name: 'Watermelon Cubes',  product_type: 'cut',  price: 60,  original_price: null, unit: '300g pack', emoji: '🍉', image_url: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=400&q=80', rating: 4.7, review_count: 145, badge: 'Ready to Eat', sort_order: 11 },
    { name: 'Pineapple Chunks',  product_type: 'cut',  price: 70,  original_price: null, unit: '250g pack', emoji: '🍍', image_url: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400&q=80', rating: 4.6, review_count: 92,  badge: null,           sort_order: 12 },
  ],
  'Health Food': [
    { name: 'Garden Salad Pack', product_type: 'cut', price: 89,  original_price: null, unit: '300g pack',  emoji: '🥗', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', rating: 4.7, review_count: 112, badge: 'Healthy',       sort_order: 1 },
    { name: 'Sprout Mix',        product_type: 'raw', price: 45,  original_price: null, unit: '200g',       emoji: '🌱', image_url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80', rating: 4.5, review_count: 67,  badge: null,            sort_order: 2 },
    { name: 'Protein Veggie Bowl',product_type:'cut', price: 120, original_price: null, unit: '400g bowl',  emoji: '🥙', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', rating: 4.8, review_count: 98,  badge: 'High Protein',  sort_order: 3 },
    { name: 'Detox Green Pack',  product_type: 'cut', price: 99,  original_price: null, unit: '250g pack',  emoji: '🥬', image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', rating: 4.6, review_count: 83,  badge: null,            sort_order: 4 },
    { name: 'Beetroot Salad',    product_type: 'cut', price: 75,  original_price: null, unit: '200g pack',  emoji: '🫚', image_url: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400&q=80', rating: 4.4, review_count: 55,  badge: null,            sort_order: 5 },
    { name: 'Mixed Nut Salad',   product_type: 'cut', price: 135, original_price: 150,  unit: '300g pack',  emoji: '🥜', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', rating: 4.7, review_count: 79,  badge: 'Premium',       sort_order: 6 },
  ],
  'Fresh Juice': [
    { name: 'Watermelon Juice',  product_type: 'cut', price: 60, original_price: null, unit: '300ml', emoji: '🍉', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', rating: 4.8, review_count: 167, badge: 'Cold Pressed', sort_order: 1 },
    { name: 'Mixed Fruit Juice', product_type: 'cut', price: 70, original_price: null, unit: '300ml', emoji: '🍹', image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80', rating: 4.7, review_count: 134, badge: null,           sort_order: 2 },
    { name: 'Green Detox Juice', product_type: 'cut', price: 80, original_price: null, unit: '300ml', emoji: '🥤', image_url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80', rating: 4.6, review_count: 89,  badge: 'Detox',        sort_order: 3 },
    { name: 'Mango Delight',     product_type: 'cut', price: 75, original_price: null, unit: '300ml', emoji: '🥭', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', rating: 4.9, review_count: 211, badge: 'Seasonal',     sort_order: 4 },
    { name: 'Orange Juice',      product_type: 'cut', price: 65, original_price: null, unit: '300ml', emoji: '🍊', image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80', rating: 4.5, review_count: 145, badge: null,           sort_order: 5 },
    { name: 'Pomegranate Juice', product_type: 'cut', price: 90, original_price: null, unit: '300ml', emoji: '🍎', image_url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80', rating: 4.7, review_count: 98,  badge: 'Premium',      sort_order: 6 },
  ],
};

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Sync tables (force: false = don't drop existing data)
    await sequelize.sync({ force: false });
    console.log('✅ Tables synced');

    // Seed categories
    for (const cat of categories) {
      await Category.upsert(cat, { conflictFields: ['name'] });
    }
    console.log('✅ Categories seeded');

    // Seed products
    for (const [catName, products] of Object.entries(productsByCat)) {
      const category = await Category.findOne({ where: { name: catName } });
      if (!category) { console.warn(`⚠️  Category not found: ${catName}`); continue; }

      for (const p of products) {
        await Product.upsert({ ...p, category_id: category.id }, { conflictFields: ['name', 'category_id'] });
      }
    }
    console.log('✅ Products seeded');

    console.log('\n🎉 Seeding complete! Your Chopzy DB is ready.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
