const csv = require('csvtojson');
const json2csv = require('json2csv');
const fs = require('fs');



let processCats = () => {
  let categories = []
  csv({
    delimiter: "\t",
    noheader: false,
    includeColumns: ['product_type', 'google_product_category']
  })
  .fromFile('gshopping.txt')
  .on('json',(row)=>{
    categories.push(row);
  })
  .on('error', error => console.log(err))
  .on('done', error => {
    if (error) console.log(error);
    console.log(categories);
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


processCats();
