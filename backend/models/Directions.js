const mongoose = require("mongoose");

const directionsSchema = new mongoose.Schema(
    {
        // foreign key to User
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        startLocationName: {
            type: String,
            required: true,
            trim: true
        },

        endLocationName: {
            type: String,
            required: true,
            trim: true
        },

        startLat: {
            type: String,
            required: true
        },
        startLng: {
            type: String,
            required: true
        },

        endLat: {
            type: String,
            required: true
        },
        endLng: {
            type: String,
            required: true
        },

        distance: {
            type: Number,
            required: true,
            min: 0
        },

        duration: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// index for fast "my routes" listing
directionsSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Directions", directionsSchema);
