const express = require("express");
const router = express.Router();
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/authMiddleware");


// 1️⃣ User submits request
router.post("/", verifyToken, async (req, res) => {
  try {
    const { petId } = req.body;
    const existing = await AdoptionRequest.findOne({ petId, userId: req.userId });

    if (existing) return res.status(400).json({ msg: "Already requested for this pet" });

    const newRequest = new AdoptionRequest({
      userId: req.userId,
      userName: req.user.name,
      userEmail: req.user.email,
      petId,
      status: "Pending",
    });

    await newRequest.save();
    res.json({ msg: "Request submitted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 2️⃣ Admin gets all requests
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

    const requests = await AdoptionRequest.find().populate('petId');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ Route for current user's adoption requests
router.get("/user",verifyToken , async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ userId: req.user._id }).populate('petId');

    const formatted = requests.map(request => ({
      petName: request.petId.name,
      status: request.status,
      requestedAt: request.requestDate
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ message: 'Failed to fetch user adoption requests.' });
  }
});


// 3️⃣ User gets their own history
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const userRequests = await AdoptionRequest.find({ userId: req.params.id });
    res.json(userRequests);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 4️⃣ Admin approves/rejects a request
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

    const { status, adminResponse } = req.body;
    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );

    if (status === "Approved") {
      await Pet.findByIdAndUpdate(request.petId, { adopted: true });

      await AdoptionRequest.updateMany(
        { petId: request.petId, _id: { $ne: req.params.id } },
        {
          status: "Rejected",
          adminResponse: "Pet already adopted by another user"
        }
      );
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
