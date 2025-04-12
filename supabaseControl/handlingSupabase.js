/* eslint-disable no-undef */
const { supabase } = require('./supabase');


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

const selectDataBased2Column = async (Table, column1, column2, value1, value2) => {
    const { data, error } = await supabase
        .from(Table)
        .select('*')
        .or(`${column1}.eq.${value1},${column2}.eq.${value2}`)
    if (error) {
        console.log("Failed To Get Data in Based On", column1, "and", column2)
        console.log(error)
        return data
    }
    return data
}

const SelectBasedOnUser = async (Table, ColumnReference, ValueReference) => {
    const { data, error } = await supabase
        .from(Table)
        .select('*')
        .eq(ColumnReference, ValueReference)
    if (error) {
        console.log("Failed To Get Data in ")
        console.log(error)
        return data
    }
    return data
}

const InsertData = async (Table, data) => {
    console.log(data)
    const { error } = await supabase
        .from(Table)
        .insert(data)
    if (error) {
        console.log("Failed To Insert Data")
        console.log(error)
        return false
    }
    return true
}

const DeleteData = async (Table, ColumnReference, ValueReference) => {
    const response = await supabase
        .from(Table)
        .delete()
        .eq(ColumnReference, ValueReference)
    return response
}

const GetData = async (Table) => {
    let { data, error } = await supabase
        .from(Table)
        .select('*')
    if (error) {
        return false
    }
    return data

}

const EditData = async (Table,ColumnReference,ValueReference, ArrayUpdate) => {
    Promise.all(ArrayUpdate.map(async (item) => {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
            .from(Table)
            .update(item)
            .eq(ColumnReference,ValueReference)
    }))
}


module.exports = { selectDataBased2Column, InsertData, SelectBasedOnUser, DeleteData, uploadImagestoSupabase, GetData,EditData }