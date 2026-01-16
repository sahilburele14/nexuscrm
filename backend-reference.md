# Backend Implementation Reference

Since the main application runs in a browser-only environment for this demo, here is the exact code structure for the Node.js/Express backend required by the prompt.

## 1. Mongoose Schema (`models/Lead.js`)

```javascript
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Converted', 'Lost'],
    default: 'New'
  },
  source: { 
    type: String, 
    enum: ['Website', 'Ads', 'Referral', 'Social'],
    default: 'Website'
  },
  company: String,
  notes: String
}, { timestamps: true });

// Text index for search
leadSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
```

## 2. Express Controller (`controllers/leadController.js`)

```javascript
const Lead = require('../models/Lead');

// GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, source, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};

    // Filters
    if (status && status !== 'All') query.status = status;
    if (source && source !== 'All') query.source = source;
    
    // Search (Case insensitive regex)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    res.json({
      data: leads,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 3. Seed Script (`scripts/seed.js`)

```javascript
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
require('dotenv').config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Lead.deleteMany({}); // Clear existing

  const leads = [];
  const statuses = ['New', 'Contacted', 'Converted', 'Lost'];
  const sources = ['Website', 'Ads', 'Referral'];

  for (let i = 0; i < 500; i++) {
    leads.push({
      name: `Lead ${i}`,
      email: `lead${i}@example.com`,
      phone: '555-0123',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      company: `Company ${i}`
    });
  }

  await Lead.insertMany(leads);
  console.log('Seeded 500 leads');
  process.exit();
};

seedData();
```
