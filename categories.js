const csv = require('csvtojson');
const json2csv = require('json2csv');
const fs = require('fs');



let processCats = () => {
  let categories = {}
  csv({
    delimiter: "\t",
    noheader: false,
    includeColumns: ['product_type', 'google_product_category']
  })
  .fromFile('gshopping.txt')
  .on('json',(row)=>{
    let bwCat = row['product_type']
    let googleCat = row['google_product_category'].replace(/\s?([>])\s?/g, " > ")
    // let category = {bwCat, googleCat}
    categories[bwCat] = googleCat;
  })
  .on('error', error => console.log(err))
  .on('done', error => {
    if (error) console.log(error);
    // let catsReduced = reduceUniqCats(categories);
    // saveCatsFile(JSON.stringify(catsReduced));
    saveCatsFile(JSON.stringify(categories));
  })
}

const reduceUniqCats = (arr) => {
  let uniqCats = []
  return arr.filter(cat => {
    if (uniqCats.indexOf(cat.bwCat) === -1) {
      uniqCats.push(cat.bwCat)
      return true
    } else {
      return false
    }
  })
}

const convertToTabbedFeed = (products, fields) => {
  let feed = json2csv({data: products, fields, del: '\t'})
  saveFeedFile(feed);
}


const saveCatsFile = (cats) => {
  fs.writeFile('categoriesList.json', cats, function(err) {
    if (err) throw err;
    console.log('cat file saved');
  });
}


processCats();
