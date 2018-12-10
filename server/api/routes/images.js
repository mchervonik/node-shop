const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageController = require('../controllers/images');


const storage = multer.diskStorage({
	destination: function(req, res, cb) {
		cb(null, './server/uploads');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	}else{
		cb(null, false);
	}
};

const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

router.post('/', upload.single('productImage'), ImageController.images_create_image);
router.get('/', ImageController.images_get_images);
router.delete('/:imageId', ImageController.images_delete_image);
router.delete('/', ImageController.images_delete_ALL);


module.exports = router;