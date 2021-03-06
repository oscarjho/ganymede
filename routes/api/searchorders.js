const express = require('express');
const router = express.Router();
const axios = require('axios');
const users = require('../../validation/users');

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

  let u = req.body.options.user;
  let p = req.body.options.password;

  if (!users.some( el => el.user === u && el.password === p)) {
    errors.options="Wrong user or password.";
    res.json(errors);
  } else {
    // If the user and password exists and match
    const searchdata = {
      query: req.body.query,
      provider: req.body.provider,
      options: req.body.options,
      callbackurl: req.body.callbackurl
    }
  
    const newOrder = new SearchOrder ({
      searchdata: searchdata,
      orderstatus: "received"
    })
  
    if (process.env.NODE_ENV === 'production') {
      //production
      var url = 'https://themisto2.herokuapp.com/search';
    } else {
      //dev
      var url = 'http://localhost:3000/search';
    }

    newOrder.save().
      then(
        newOrder => 
          axios
            .post(url, newOrder)
            .then(response => 
              SearchOrder.findOneAndUpdate(
                 { _id: response.data._id},
                 { $set: response.data},
                 { new: true}, 
                 (err, resp ) => {
                  if (err) {
                    console.log('error en findoneandupdate', err)
                  }
                  res.json(resp)
                }
               )
            )
            .catch(err => console.log(err))
        )
      .catch(err => console.log(err))
      

  } //Close if user and password exists

}); // Close search

// @route   GET api/product/search-order/:id
// @desc    Get search orders by id
// @access  Public
router.get('/search-order/:id', (req, res) => {

  SearchOrder.find({_id: req.params.id}, (err, resp ) => {
    if (err) {
      res.status(404).json({ err: 'No search order found with that ID, NOT FOUND' })
    }
    res.json(resp)
  })

});


// @route   POST api/product/save-search
// @desc    It receive the searchorder and sends it to themisto
// @access  Public
// TODO: RESPOND
router.post('/save-search', function(req, res) { 

    let u = req.body.searchdata.options.user;
    let p = req.body.searchdata.options.password;

    if (!users.some( el => el.user === u && el.password === p)) {
      errors.options="Wrong user or password.";
      res.json(errors);
    } else {
      // If the user and password exists and match

      if (req.body.productresult) {
        var orderstatus = "fullfilled";
      } else {
        var orderstatus = "failed"
      }

      console.log(orderstatus);

      // Set the object
      let obj = {
        id: req.body._id,
        orderstatus: orderstatus,
        productresult: req.body.productresult
      }

      console.log('We save the result')
        SearchOrder.findOneAndUpdate(
          { _id: obj.id}, 
          {$set: {orderstatus: obj.orderstatus, productresult: obj.productresult
          }},
          (err, resp ) => {
            if (err) {
              //Not found
              res.json(err)
            }
            res.json(resp)
          }
        )
  } //Close Else of if the user and password exists

});

// @route   DELETE api/product/search-order/delete/:id
// @desc    Delete search order
// @access  Public
router.delete(
  '/search-order/delete/:id',
  (req, res) => {
    SearchOrder
      .findOne({_id: req.params.id})
      .then(
        order => {
          order.remove().then(()=> res.json({ success: true}));
        }
      )
      .catch(err => res.status(404).json({searchorder: 'No search-order found'}));
  }
);


module.exports = router;
