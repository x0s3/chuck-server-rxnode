import { MongoClient } from 'mongodb';
import { from } from 'rxjs';

const url = 'YOUR_MONGODB_CONNECTION_HERE';

export default () => from(MongoClient.connect(url, { useNewUrlParser: true }));
