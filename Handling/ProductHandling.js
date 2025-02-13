/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { supabase } = require('../supabase');
require("dotenv").config({ path: "../env" })
const {select_data_user,UpdateData,Insert_Supabase} = require('./Function')


const GetData = async (request, h) => {
    const { id } = request.auth.credentials;
    const io = request.server.app.io;
    const storeConnections = request.server.app.storeConnections;

    console.log("Get Product Data " + new Date().toISOString())
    let { data, error } = await supabase
        .from('Productku')
        .select('*,name:Account!SellerID(nama)')

    const targetSocket = storeConnections[id]; // Pastikan username adalah socket ID atau hubungkan dengan logic mapping
    if (targetSocket) {
        io.to(targetSocket).emit("Message", "SELAMAT DATANG")
        console.log("pesan terkirim kepada", targetSocket)
    }

    const response = h.response({
        status: "success",
        messages: "Data Berhasil Di Dapatkan",
        data: JSON.stringify(data)
    })

    response.code(200)
    return response
}

const GetProdukBySeller = async (request, h) => {
    const { id } = request.auth.credentials;

    let { data, error } = await supabase
        .from('Productku')
        .select('*,name:Account!SellerID(nama)')
        .eq('SellerID', id)


    let dataFilter = data
    const response = h.response({
        status: "success",
        message: "Data Success Didapat",
        data: dataFilter,
    })
    response.code(200)
    return response;
}

const AddProduct = async (request, h) => {
    const { id } = request.auth.credentials
    const { idProduct, images, title, kind, price, stok, content, weight } = request.payload;
    const data = await select_data_user('Account', id, 'id')

    if (data.length === 1) {
        const SellerID = data[0].id

        //check apakah user ini tervalidasi atau tidak. mengingat frontend mudah di manipulasi, perlu adanya validasi ulang
        const AccountToken = await select_data_user('AccountToken', id, 'idAccount');
        if (AccountToken.length === 1) {
            const Time = new Date().toISOString();
            const data_baru = {
                id: idProduct,
                SellerID: SellerID,
                URLimages: images,
                title: title,
                kind: kind,
                price: price,
                stok: stok,
                content: content,
                UpdateAt: Time,
                state: data[0].state,
                city: data[0].city,
                road: data[0].road,
                origin: data[0].postalCode,
                weight: weight
            }
            await Insert_Supabase('Productku', data_baru)
            const response = h.response({
                status: "Success",
                message: "Data Berhasil Di Tambah"
            })
            response.code(201);
            return response
        }


    }
    const response = h.response({
        status: "Failed",
        message: "Data Gagal Di Tambah"
    })
    response.code(404);
    return response
}

const EditProduct = async (request, h) => {
    const { id } = request.auth.credentials
    const { idProduct } = request.params;
    const { images, title, kind, price, stok, content } = request.payload;

    const Time = new Date().getDate();
    const sesiUpdate = [
        { price: price },
        { stok: stok },
        { URLimages: images },
        { title: title },
        { kind: kind },
        { content: content },
        { UpdateAt: Time }
    ]

    //cek apakah nama file yang masuk di variabel images sama dengan sebelumnya?
    //jika sama, maka tidak perlu ada penghapusan gambar. tapi jika iya akan dihapus gambar yang lama
    const dataProduct = await select_data_user('Productku', idProduct, 'id');
    if (images !== dataProduct[0].URLimages) {
        //Proses Menghapus
        console.log("dihapus")
        await supabase.storage.from('gambarProducts').remove([`${process.env.SUPABASE_URL}/storage/v1/object/public/gambarProducts/`, dataProduct[0].URLimages])
    }

    //eksekusi merubah data
    await UpdateData('Productku', 'id', idProduct, sesiUpdate)
    const response = h.response({
        status: "success",
        message: "Data Success Di Update",
        UpdateAt: Time,
    })

    response.code(200)
    return response
}


const DeleteProduct = async (request, h) => {
    const { id } = request.auth.credentials
    const { idProduct } = request.params;

    if (id) {
        const { error } = await supabase
            .from('Productku')
            .delete()
            .eq('id', idProduct)
        if (error) {
            console.log(error)
        }
        const response = h.response({
            status: "success",
            message: "Data Success Di Hapus",
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Data Gagal Di Dihapus",
    })
    response.code(500)
    return response;
}



module.exports = {
    GetData, GetProdukBySeller, AddProduct, EditProduct,
    DeleteProduct,
}