import { connect } from 'mongoose';

const checkConnection = async () => {
    await connect('mongodb://127.0.0.1:27017/AS8', {
        serverSelectionTimeoutMS: 3000
    })
        .then(() => {
            console.log("DB connected ...");
        })
        .catch((err) => {
            console.log("*** Failed connect to DB ***", err);
        })
}

export default checkConnection