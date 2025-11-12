// js/apiClient.js
// CommonJS: para rodar em funções serverless (Netlify), NÃO no navegador direto!
// Não coloque este arquivo para ser chamado no front — use para backend/serverless!

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);



async function getProductsByCategory(category) {
  let query = supabase.from('products').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true }); 
  if (error) throw error;
  return data;
}



module.exports = {
  supabase,
  getAllProducts,
  getProductsByCategory
};
