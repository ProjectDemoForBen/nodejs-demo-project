import { MongoClient, Database } from "https://deno.land/x/mongo@v0.11.1/mod.ts";

let db: Database;
export function connect() {
    const client = new MongoClient();
    client.connectWithUri('mongodb://root:example@localhost:27017/shop?authSource=admin&w=1');

    db = client.database("test");
}

export function getDb(){
    return db;
}
