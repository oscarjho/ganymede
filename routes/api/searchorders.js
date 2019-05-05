const express = require('express');
const router = express.Router();
const axios = require('axios');

// Load SearchOrder Model
const SearchOrder = require('../../models/SearchOrder');

// Load Validation
const validateregister = require('../../validation/validateregister');

// @route   GET api/product/test
// @desc    Tests this route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Api works' }));


// @route   GET api/products/
// @desc    This is the homepage
// @access  Public
// respond respond with all the search orders 
router.get('/search-orders', function(req, res) {

  SearchOrder.find((err, resp) => {
    if (err) {
      res.json(err)
    } else {
      res.json(resp)
    }
  })

})

// @route   POST api/product/search
// @desc    It receive the searchorder and sends it to themisto
// @access  Public
// respond 
router.post('/search', function(req, res) {

    const { errors, isValid } = validateregister(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const searchdata = {
      query: req.body.query,
      provider: req.body.provider,
      options: req.body.options,
      callbackurl: req.body.callbackurl
    }

    const newOrder = new SearchOrder ({
      searchdata: searchdata,
      orderstatus: "received",
      productresult: {}
    })

    newOrder.save().
      then(
        newOrder => 
          axios
            .post('https://themisto2.herokuapp.com/search', newOrder)
            .then(response => 
              SearchOrder.findOneAndUpdate(
                { _id: response.data._id},
                { $set: response.data},
                { new: true}, 
                (err, resp ) => {
                  if (err) {
                    console.log('error en findoneandupdate', err)
                  }
                  console.log(resp)
                  res.json(resp)
                }

              )
            )
            .catch(err => console.log(err))
        )
      .catch(err => console.log(err))
                
});

// @route   GET api/product/:id
// @desc    Get search orders by id
// @access  Public
router.get('/search-order/:id', (req, res) => {

  SearchOrder.find({_id: req.params.id}, (err, resp ) => {
    if (err) {
      res.status(404).json({ err: 'No search order found with that ID, NOT FOUND' })
    }
    res.json(resp)
  })

})

// @route   POST api/product/save-search
// @desc    It receive the searchorder and sends it to themisto
// @access  Public
// TODO: RESPOND
router.post('/save-search', function(req, res) { 

  let productos = req.body.productresult;
  
  let productosrev = []
  productos.forEach( element => {
    if(element.length > 0){
      productosrev.push(element)
    }
  })

  let id = req.body._id;

    SearchOrder.findOneAndUpdate(
      { _id: id}, 
      {$set: {orderstatus: req.body.orderstatus, productresult: productosrev
      }},
      (err, resp ) => {
        if (err) {
          //Not found
          res.json(err)
        }
        res.json(resp)
      }
    )

});


module.exports = router;
