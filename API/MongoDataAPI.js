const { kStringMaxLength } = require('buffer');
const { MongoClient } = require('mongodb');
const { resourceLimits } = require('worker_threads');
async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = ""; // insert URI string here-- will be run using a Bash script to prevent a URI leak

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        const document = await getRandomDocument(client);
        const header = await getHeader(document);
        const content = await getContent(document);
        console.log(`Hey! This is your document: ${document}. \n This is your header: ${header}. \n This is your content: ${content}`);
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}


/**
 * Gets a random document from a specified collection
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function getRandomDocument(client) {

    const db = client.db('veganStats'); // connect to db
    const items = await db.collection('foodSwaps').find({}).toArray(); // specify collection, find all docs, put it in an array
    const rand = Math.floor((Math.random() * items.length)); // number bw 0 and length

    return items[rand];
    // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
/**
 * Gets value of header field in document
 * @param {Object} document 
 * @returns 
 */
async function getHeader(document) {
    return document.header;
}
/**
 * Gets value associated with content field in document
 * @param {Object} document 
 * @returns 
 */
async function getContent(document) {
    return document.content;
}
/**
 * Gets the image associated with the document
 * @param {Object} document random document to pull from
 * @returns image associated with the document
 */
async function getImage(document) {
    return document.image;
}
main();