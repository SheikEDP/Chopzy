// routes/addresses.js
const express            = require('express');
const router             = express.Router();
const { body }           = require('express-validator');
const addressController  = require('../controllers/addressController');
const { protect }        = require('../middleware/auth');
const { validate }       = require('../middleware/errorHandler');

router.use(protect);

const addressRules = [
  body('label')
    .notEmpty().withMessage('Label is required (Home, Office, etc.)'),
  body('full_address')
    .notEmpty().withMessage('Full address is required.'),
];

router.get('/',                  addressController.getAll);
router.post('/',    addressRules, validate, addressController.create);
router.put('/:id',  addressRules, validate, addressController.update);
router.delete('/:id',            addressController.remove);
router.patch('/:id/default',     addressController.setDefault);

module.exports = router;
