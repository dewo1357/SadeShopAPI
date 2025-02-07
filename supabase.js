/* eslint-disable no-undef */
const { createClient } = require ("@supabase/supabase-js");
require("dotenv").config({path:".env"})


const supabaseUrl = process.env.SUPABASE_URL;
const API_KEY = process.env.API_KEY


if (!supabaseUrl) {
    console.error('Environment variables are missing!');
  }

const supabase = createClient(
    supabaseUrl    ,API_KEY
)

module.exports = {supabase}