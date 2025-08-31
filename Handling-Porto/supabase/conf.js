const {createClient} = require('@supabase/supabase-js')
require('dotenv').config({path : './.env'})

const url = process.env.url
const anon_key = process.env.anon_key_porto

// Create a single supabase client for interacting with your database
const supabase = createClient(url, anon_key)

module.exports = { supabase }
