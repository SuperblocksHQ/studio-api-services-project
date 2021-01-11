import { MongoClient, Db } from 'mongodb';
import { IPersistedProjectModel } from 'app-domain';
import { ApiError } from 'app';

export let db: Db | null = null;

export async function connectToDB(): Promise<void> {
    if (db) { return Promise.resolve(); }

    return MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        .then((client: MongoClient) => {
            db = client.db(process.env.DB_NAME);
        });
}

export const repository = {
    get projects() {
        if (!db) {
            throw new ApiError('DB is not connected', 500);
        }
        return db.collection<IPersistedProjectModel>('projects');
    }
};
