import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Publicación no encontrada!'))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'Solo puedes eliminar tus publicaciones'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Publicación eliminada correctamente.');
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Publicación no encontrada!'));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'Solo puedes modificar tus publicaciones.'));
    }

    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }

        );
        res.status(200).json(updateListing);
    } catch (error) {
        next(error)
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Publicación no encontrada'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let garage = req.query.garage;

        if (garage === undefined || garage === 'false') {
            garage = { $in: ['si', 'no'] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent', 'anticretic'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' },
            offer,
            garage,
            type
        })
            .sort({ [sort]: order })
            .limit(limit).skip(startIndex)
            .skip(startIndex);

return res.status(200).json(listings);
    } catch (error) {
    next(error);
}
};