const {createClient} = require('@supabase/supabase-js')
require('dotenv').config({path : './.env'})

const url = process.env.URL
const anon_key = process.env.ANON_KEY_PORTO

console.log("url", url)
console.log("Anon key : ", anon_key)
// Create a single supabase client for interacting with your database
const supabase = createClient(url, anon_key)

module.exports = { supabase }
