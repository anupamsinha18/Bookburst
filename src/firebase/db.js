// src/firebase/db.js

import { getFirestore } from "firebase/firestore";
import app from "./auth"; // import your firebase app instance

// Initialize Firestore
export const db = getFirestore(app);
