const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config()
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())



// mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.iagloem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.USER_NAME)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    const database = client.db("ECommerce").collection("alldata");

    // Home page popular card data
      app.get("/populardata", async (req,res) => {
        const filters = req?.query?.sort;
        console.log(filters)
        const query = {};
        const options = {
          sort : {
            Rating : filters === "asc" ? 1 : -1
          }
        }
        const result = await database.find(query,options).toArray()
        const resultData = result.slice(0,6)
        res.send(resultData)
      })

      // home page newCollection 
      app.get("/newcollection", async (req,res) => {
        const result = await database.find().toArray()
        const resultData = result.slice(0,6)
        res.send(resultData)
      })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req,res) => {
    res.send('Hello Ecommerce!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
