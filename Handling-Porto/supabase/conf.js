const {createClient} = require('@supabase/supabase-js')
require('dotenv').config()

const url = process.env.url
const anon_key = process.env.ANON_KEY_PORTO

// Create a single supabase client for interacting with your database
const supabase = createClient(url, anon_key)

module.exports = { supabase }
