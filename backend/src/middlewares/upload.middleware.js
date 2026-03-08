import multer from 'multer';
import path from 'path';

const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|webp/;

    const isValidExt = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        cb(null, true);
    }

    else {
        cb(new Error("Only image files are allowed!"), false);
    }

};

// Profile image upload
const profileStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "src/uploads/profile-images");
    },

    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, "profile-" + uniqueSuffix + extension);
    }

});

const uploadProfileImage = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

// Event image upload
const eventStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "src/uploads/event-images");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, "event-" + uniqueSuffix + extension);
    }

});

export const uploadEventImage = multer({
    storage: eventStorage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter
});

export default uploadProfileImage; 