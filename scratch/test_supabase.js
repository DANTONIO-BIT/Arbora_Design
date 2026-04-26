import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl)
  const { data, error } = await supabase.from('categories').select('*')
  if (error) {
    console.error('Error fetching categories:', error)
  } else {
    console.log('Successfully fetched categories:', data.length)
    console.log('Categories:', data.map(c => c.name).join(', '))
  }
}

testConnection()
