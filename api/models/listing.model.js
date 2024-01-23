import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        imageUrls: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        rooms: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        garage: {
            type: String,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        }
    }, {
        timestamps:
        {
            currentTime: () => new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
}
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;