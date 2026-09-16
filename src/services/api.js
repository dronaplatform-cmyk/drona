"use client"

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    
     withCredentials: true,
    
    // Optional: Set default headers
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;