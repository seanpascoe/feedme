const csv = require('csvtojson');
const json2csv = require('json2csv');
const request = require('request')
const fs = require('fs');



let processFeed = () => {
  let products = []
  csv({
    delimiter: "\t",
    noheader: false,
    headers: [
    	'id', 'gtin',	'title', 'description',	'sale_price',	'link', 'image_link', 'product_type', 'brand', 'availability', 'condition',	'mpn', 'PAYMENT_TYPE',	'KEYWORDS',	'price', 'sale_price2', 'gender',	'DEPARTMENT',	'shipping(price)', 'size', 'shipping_weight', 'color', 'PROMOTIONAL_MESSAGE', 'ZIP_CODE', 'CURRENCY', 'item_group_id', 'age_group', 'custom label 0'
    ]
  })
  .fromStream(request.get('http://www.bobwards.com/feeds/singlefeed.txt'))
  .on('json',(product)=>{
    delete product.PAYMENT_TYPE
    delete product.KEYWORDS
    delete product.sale_price2
    delete product.DEPARTMENT
    delete product.PROMOTIONAL_MESSAGE
    delete product.ZIP_CODE
    delete product.CURRENCY

    //format gender
    if (product.gender === 'm') {
      product.gender = 'Male';
    } else if (product.gender === 'f') {
      product.gender = 'Female';
    } else if (product.gender === 'u') {
      product.gender = 'Unisex';
    }

    //format availability
    if (product.availability === 'Y') {
      product.availability = 'in stock';
    }

    //format conditon
    if (product.condition === 'New') {
      product.condition = 'new';
    }
    products.push(product);

  })
  .on('error', error => console.log(err))
  .on('done', error => {
    if (error) console.log(error);
    console.log('feed processed')
    let fields = Object.keys(products[0])
    convertToTabbedFeed(products, fields);
  })
}

const convertToTabbedFeed = (products, fields) => {
  let feed = json2csv({data: products, fields, del: '\t'})
  saveFeedFile(feed);
}


const saveFeedFile = (feed) => {
  fs.writeFile('google-shopping.txt', feed, function(err) {
    if (err) throw err;
    console.log('feed file saved');
  });
}


processFeed();
