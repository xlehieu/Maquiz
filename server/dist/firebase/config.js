"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageDB = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: 'AIzaSyDkrD2M49xMwQbY_68nqSP3XuwhfnVoipo',
    authDomain: 'mah-auth.firebaseapp.com',
    projectId: 'mah-auth',
    storageBucket: 'mah-auth.appspot.com',
    messagingSenderId: '888851926754',
    appId: '1:888851926754:web:960d40cd4d0cac900e58bb',
    measurementId: 'G-X2FYH40860',
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.imageDB = (0, storage_1.getStorage)(app);
//# sourceMappingURL=config.js.map