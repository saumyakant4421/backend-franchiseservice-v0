// config/firebase.js
const admin = require('firebase-admin');

// Firebase will be initialized in index.js
// This module provides access to the Firestore database after initialization
let db = null;

function initDb() {
  if (!db) {
    try {
      db = admin.firestore();
    } catch (error) {
      console.warn('Firebase not initialized yet, db will be null');
      db = null;
    }
  }
  return db;
}

module.exports = { 
  get db() {
    return initDb();
  }
};