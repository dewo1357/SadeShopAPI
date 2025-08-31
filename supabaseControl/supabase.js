/* eslint-disable no-undef */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path : './.env'})

const URL = process.env.URL_KEY;
const API_KEY = process.env.API_KEY;
console.log(API_KEY)

// Create a single supabase client for interacting with your database
const supabase = createClient(URL,API_KEY);

module.exports = { supabase };