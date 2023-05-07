import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import ejs from 'ejs'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import mongoose from 'mongoose';

const app = express();
const port = 8000;

// Define routes and middleware here
import axios from 'axios'
const data=[]

const url="mongodb+srv://balinenisreedharnaidu:<YOUR PASSWORD>@cluster0.xktjh8r.mongodb.net/<YOUR DATABASE NAME>?retryWrites=true&w=majority"
const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

//define schema
const crpt = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  last: {
    type: Number,
    required: true
  },
  buy: {
    type: Number,
    required: true
  },
  sell: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  base_unit: {
    type: String,
    required: true
  }
})

// Create a model based on the schema
const DataModel = mongoose.model('Data', crpt);
//const newData = new DataModel(jsonData);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.get('/top10results', async (req, res) => {
  try {
    // Make an HTTP GET request to the API to fetch the top 10 results
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const array=Object.entries(response.data)
    for (let index = 0; index <10; index++) {
        //console.log(array[index][1]);
        data.push(array[index][1])
        const newData = new DataModel(array[index][1]);
        newData.save()
            .then(savedData => {
              console.log("saved!");
            })
            .catch(error => {
              console.error('Error occurred while saving data:', error);
            });
         }
    
    
    //console.log(typeof response);
    // Extract the top 10 results from the API response
    //console.log(response);
    //const top10Results = response.slice(0, 10);
    // const array=Object.entries(response)
    // // console.log(array);
    // array.forEach(element => {
    //     console.log(element)
    // });
    // Send the top 10 results as a JSON response
    // const currentDir = path.dirname(__filename);
    // const filePath = path.join(currentDir, 'example.html');

    //console.log(data)


    DataModel.find()
      .then(data => {
        //console.log('Retrieved data:', data);
        res.render('index',{data:data})
        // Further code logic goes here...
      })
      .catch(error => {
        console.error('Error occurred while retrieving data:', error);
      })

  } catch (error) {
    console.error('Error fetching top 10 results:', error);
    res.status(500).json({ error: 'Failed to fetch top 10 results' });
  }
  
});

// app.get('/dbdata', async(req, res)=>{
//   DataModel.find()
//       .then(data => {
//         console.log('Retrieved data:', data);
//         // Further code logic goes here...
//       })
//       .catch(error => {
//         console.error('Error occurred while retrieving data:', error);
//       })
      
//       res.render("table", {data2:data})
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
