import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as firebaseConfig from 'config/firebase-sdk.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
