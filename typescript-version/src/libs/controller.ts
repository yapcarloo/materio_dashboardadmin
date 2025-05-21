/* eslint-disable import/named */
import { getFirestore, collection } from 'firebase/firestore' // Fixed import

import { app } from './firebase'

// Initialize Firestore
export const firestore = getFirestore(app) // Make sure to pass your app instance

// Create collection references
export const depositCollection = collection(firestore, 'depositData') // Fixed syntax
export const withdrawDataCollection = collection(firestore, 'withdrawData') // Fixed syntax
export const earningsCollection = collection(firestore, 'TotalEarning')
export const salesByCountriesCollection = collection(firestore, 'SalesByCountries')
export const usersCollection = collection(firestore, 'Table') // Fixed syntax