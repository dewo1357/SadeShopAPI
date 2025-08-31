const { supabase } = require('./conf')

const InsertData = async (table, data) => {
  const { error } = await supabase.from(table).insert(data)
  if (error) {
    return false
  }
  return true
}

const GetData = async table => {
  let { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.log(error)
    return false
  }
  return data
}

const Delete = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    return false
  }
  return true
}

const Update = async (table, id, data) => {
  const { error } = await supabase.from(table).update(data).eq('id', id)
  if (error) {
    return false
  }
  return true
}

const GetDataBased = async (table, column, valueColumns) => {
  let { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, valueColumns)
  if(error){
    return false
  }
  return data
}

module.exports = { InsertData, GetData, Delete, Update, GetDataBased }
