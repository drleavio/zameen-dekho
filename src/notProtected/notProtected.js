const router = require('express').Router();
const { dbConnect } = require('../connection/dbConnect');
const Land = require('../models/plot-model/plotModel');

// ✅ GET /api/lands/all-plots
router.get('/all-plots/lat/:lat/lng/:lng/radius/:radius', async (req, res) => {
    const {lat, lng, radius} = req.params;
    await dbConnect()
  try {
    const {
      city,
      state,
      landType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      verified,
      available,
      search,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (landType) filter.landType = landType;
    if (verified) filter['ownership.verified'] = verified === 'true';
    if (available) filter.isAvailable = available === 'true';

    // Price filter
    if (minPrice || maxPrice) {
      filter['price.value'] = {};
      if (minPrice) filter['price.value'].$gte = Number(minPrice);
      if (maxPrice) filter['price.value'].$lte = Number(maxPrice);
    }

    // Area filter
    if (minArea || maxArea) {
      filter['area.value'] = {};
      if (minArea) filter['area.value'].$gte = Number(minArea);
      if (maxArea) filter['area.value'].$lte = Number(maxArea);
    }

    // Text search
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
      ];
    }

    // 🌍 Location-based filtering (radius search)
    if (lat && lng) {
      const radiusInMeters = (radius ? Number(radius) : 10) * 1000; // default 10km
      filter['location.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: radiusInMeters,
        },
      };
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    // Fetch results
    const lands = await Land.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Land.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      results: lands,
    });
  } catch (err) {
    console.error('Error fetching plots:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




module.exports = router;
