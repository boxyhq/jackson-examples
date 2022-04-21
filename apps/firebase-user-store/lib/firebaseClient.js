import { initializeApp, applicationDefault } from 'firebase-admin/app';

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT,
});
