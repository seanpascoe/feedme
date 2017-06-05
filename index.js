let fs = require('fs');
let csv = require('csvtojson');

// fs.readFile('singlefeed.txt', 'utf-8', (err, data) => {
//   let feed = data.split('\n')
//   console.log(feed[1]);
// })

let products = []

csv()
.fromFile('singlefeed.txt')
.on('json',(jsonObj)=>{
  products.push(jsonObj);

})
.on('done',(error)=>{
  console.log(products)
    console.log('end')
})
