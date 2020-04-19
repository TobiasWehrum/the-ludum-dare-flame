import { IData, generateDefaultData } from "../../shared/definitions/databaseInterfaces";
import * as mongodb from "mongodb";
import * as deepmerge from "deepmerge";
import { arrayCombineMerge } from "../../shared/utils/utils";

const mongoClient = mongodb.MongoClient;
const connectionURL = process.env.DB_URL;
const databaseName = "the-ludum-dare-flame";
const saveIntervalInMinutes = 0.5;

let db: mongodb.Db;
let dbData: mongodb.Collection;

export let data: IData;

export async function connectToDatabase() {
    try {
        const client = await mongoClient.connect(connectionURL, { useNewUrlParser: true });
        console.log("Connected to database");
        db = client.db(databaseName);
        dbData = db.collection("data");

        data = await dbData.findOne({});
        if (data) {
            console.log("Loaded data!");
            migrateData();
        } else {
            console.log("Created new data!");
            data = generateDefaultData();
            dbData.insertOne(data);
            await saveData();
        }

        regularelySaveData();
    } catch (error) {
        console.log("Unable to connect to database!");
        throw error;
    }
}

function regularelySaveData() {
    setInterval(() => {
        saveData();
    }, saveIntervalInMinutes * 60 * 1000);
}

function saveData() {
    return dbData.replaceOne({}, data);
}

function migrateData() {
    const originalId = (data as any)._id;
    data = deepmerge(generateDefaultData(), data, { arrayMerge: arrayCombineMerge });
    (data as any)._id = originalId;
}
