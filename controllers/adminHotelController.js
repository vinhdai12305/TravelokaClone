const Hotel = require('../models/Hotel');

exports.index = async (req, res) => {

    const hotels = await Hotel.find();

    res.render('admin/hotels', {
        hotels
    });

};

exports.create = (req, res) => {

    res.render('admin/createHotel');

};

exports.store = async (req, res) => {

    try {

        const newHotel = new Hotel({

            name: req.body.name,

            location: req.body.location,

            // 👇 lấy ảnh upload từ multer
            image: req.file ? req.file.filename : '',

            stars: req.body.stars,

            rating: req.body.rating,

            reviewCount: req.body.reviewCount,

            discountPrice: req.body.discountPrice,

            tag: req.body.tag,

            type: req.body.type,

            // 👇 checkbox amenities
            amenities: req.body.amenities

        });

        await newHotel.save();

        res.redirect('/admin/hotels');

    } catch (error) {

        console.log(error);
        res.status(500).send('Create Hotel Error');

    }

};

exports.delete = async (req, res) => {

   try {

      await Hotel.findByIdAndDelete(req.params.id);

      res.redirect('/admin/hotels');

   } catch (error) {

      console.log(error);
      res.status(500).send('Delete Error');

   }

};