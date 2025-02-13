/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { supabase } = require('../supabase');

const select_data_user = async (tableName, value, column) => {
    try {
        let { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq(`${column}`, value)

        if (error) {
            console.log(error)
        }
        return data
    } catch (err) {
        console.log(err.message)
    }
}

const uploadImagestoSupabase = async (files, bucket) => {
    if (files) {
        console.log(files)
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(`${files.hapi.filename}`, files, {
                    contentType: files.hapi.headers['content-type'],
                    cacheControl: '3600',
                    duplex: "half"
                },

                );
            if (error) {
                console.log(error)
            } else {
                console.log(data)
                console.log("data bertambah")
                return true
            }

        } catch (e) {
            console.log("Error", e.message)
        }

    }
}


const UpdateData = async (tableName, columnReference, reference, updateValue) => {
    try {

        await Promise.all(updateValue.map(async (item) => {
            const { error } = await supabase
                .from(tableName)
                .update(item)
                .eq(columnReference, reference)
            if (error) {
                console.log(error)
            }
        }))

    } catch (err) {
        console.log(err.message);
    }

}

//insert data
const Insert_Supabase = async (tableName, data) => {
    const { error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
    if (error) {
        console.log(error)
    }
}

//fungsi ini untuk check apakah ada pesan yang belum di baca atau belum.
// hasil akan digunakan untuk Notifikasi Pesan Pada Head Menu
const CheckMessage = async (id) => {
    let { data, error } = await supabase
        .from('ChatData')
        .select("*")
        .eq('ReceiveAccountID', id)

    data = data.filter((item) => item.isRead === 'false')
    return data.length !== 0 ? true : false
}

const deleteData = async (tableName, ColumnReference, Value) => {
    const response = await supabase
        .from(tableName)
        .delete()
        .eq(ColumnReference, Value)

    return response

}





module.exports = {select_data_user,uploadImagestoSupabase,
    UpdateData,Insert_Supabase,CheckMessage,deleteData}