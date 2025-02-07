/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { Genre, account, Cart } = require('./dataset')
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { supabase } = require('./supabase');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { server } = require('@hapi/hapi');
require("dotenv").config({ path: "src/.env" })





const getOngkir = async (request, h) => {
    try {
        const response = await fetch("https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=Sumatera Utara&limit=5&offset=0", {
            method: "GET",
            headers: { 'key': 'ezQ5t2Fa66da19458a756384yDIHMUOy' },
        })
        if (!response) {
            throw new Error("Data")
        }
        const result = await response.text()
        console.log(result)
        return result
    } catch (err) {
        console.log(err.message)
    }


}



async function calculateDomesticCost(origin, destination, weight, courier) {
    // Data yang dikirimkan melalui body
    const body = new URLSearchParams({
        origin: origin,
        destination: destination,
        weight: weight,
        courier: courier,
    });

    try {
        // Melakukan request POST
        const response = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost", {
            method: "POST",
            headers: {
                "key": "ezQ5t2Fa66da19458a756384yDIHMUOy",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });

        // Parsing response ke JSON
        if (response.ok) {
            const data = await response.json();

            return data.data
        } else {
            console.error("HTTP Error:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

/*
const CheckedCheckout =  () => {
    const WebSocketClient = () => {
        const socket = new WebSocket("http://localhost:2025")
        socket.onopen = () => {
            socket.send(JSON.stringify({
                'Subject': 'PERINGATAN',
                'Message': '"Data Checkout sebelumnya masih ada, ingin menambah nya atau menghapus dengan data baru?"'
            }))
        }
    }
}
*/

let CheckOutArray = [];
const CheckOut = async (request, h) => {
    const { username } = request.auth.credentials
    console.log('checkout Dataaaaa')

    const { Name, courier, province,
        city, kecamatan, kodepos } = request.payload;

    const CartToPayBasedOnUser = CartToPay.filter((item) => item.user === username)

    await Promise.all(
        CartToPayBasedOnUser.map(async (item) => {
            let resi = nanoid(25);
            let Seller_Sama = 0
            let Index = null
            const jenis_pengiriman = await calculateDomesticCost(item.origin, kodepos, item.totalweight, courier)
            console.log(jenis_pengiriman)
            if (CheckOutArray.length !== 0) {
                CheckOutArray.map((items, index) => {
                    if (items.Seller === item.Seller) {
                        Seller_Sama = 1;
                        resi = items.resi
                        Index = index
                        return
                    }
                })
                if (Seller_Sama === 1) {

                    CheckOutArray[Index].product.push({
                        id: item.id,
                        indexCategory: item.indexCategory,
                        title: item.title,
                        pcs: item.pcs,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        status: "Process"
                    })


                } else {
                    let data = {
                        transaction_id: resi.toString(),
                        origin: item.origin,
                        user: username,
                        Customer: Name,
                        courier: courier,
                        province: province,
                        city: city,
                        kecamatan: kecamatan,
                        postalCode: kodepos,
                        Seller: item.Seller,
                        SellerID: item.SellerID,
                        jenis_pengiriman: jenis_pengiriman,
                        piihan_pengiriman: jenis_pengiriman[0],
                        product: [{
                            id: item.id,
                            indexCategory: item.indexCategory,
                            title: item.title,
                            pcs: item.pcs,
                            price: item.price,
                            totalPrice: item.totalPrice,
                            status: "Process"
                        }]
                    }

                    CheckOutArray.push(data)
                }
            } else {
                let data = {
                    transaction_id: resi.toString(),
                    origin: item.origin,
                    user: username,
                    Customer: Name,
                    courier: courier,
                    province: province,
                    city: city,
                    kecamatan: kecamatan,
                    postalCode: kodepos,
                    jenis_pengiriman: jenis_pengiriman,
                    piihan_pengiriman: jenis_pengiriman[0],
                    Seller: item.Seller,
                    SellerID: item.SellerID,
                    product: [{
                        id: item.id,
                        indexCategory: item.indexCategory,
                        title: item.title,
                        pcs: item.pcs,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        status: "Process"
                    }]
                }
                CheckOutArray.push(data)
            }
        })
    )
    console.log(CheckOutArray)


    const response = h.response({
        status: 'Success',
        message: "Data Berhasil Di Dapatkan",
        data: CheckOutArray.filter((item) => item.user === username)
    })

    response.code(200)
    return response
}

const ShippingSetter = (request, h) => {
    const { transaction_id, value } = request.payload;
    console.log(transaction_id, value)
    const dataCheckoutBasedOnCustomer = CheckOutArray.slice()
    const index = dataCheckoutBasedOnCustomer.findIndex((item) => item.transaction_id === transaction_id)
    if (index !== -1) {
        dataCheckoutBasedOnCustomer[index].piihan_pengiriman = dataCheckoutBasedOnCustomer[index].jenis_pengiriman[value]
        CheckOutArray = dataCheckoutBasedOnCustomer;
        const response = h.response({
            status: "Success",
            message: "Pengiriman Berhasil Di Upadate"
        })
        return response
    }
}


const ActionToDeleteCheckout = (request, h) => {
    const { username } = request.auth.credentials;
    console.log("HAPUS CHECKOUTTT")
    const checkoutDataBaru = CheckOutArray.filter((item) => item.user !== username)
    const CartToPayBaru = CartToPay.filter((item) => item.user !== username)
    CheckOutArray = checkoutDataBaru
    CartToPay = CartToPayBaru
    const response = h.response({
        status: "Success",
        message: "Data Checkout Berhasil Di Hapus"
    })
    console.log(CheckOutArray)
    response.code(200)
    return response
}

const GetOverallCheckout = (request, h) => {
    const { username } = request.auth.credentials;
    console.log("USERNAMEEEEE")
    console.log(username)
    console.log(CheckOutArray)

    const dataCheckOut = []
    let ShippingcCost = 0;
    let SubTotalPrice = 0;
    let name = null;
    CheckOutArray.map((item) => {
        let TotalPay = 0;
        if (item.user === username) {
            item.product.map((item) => {
                TotalPay += item.totalPrice
            })
            if (name == null) {
                name = item.Customer;
            }
            SubTotalPrice += TotalPay
            item.totalPay = TotalPay + item.piihan_pengiriman.cost
            ShippingcCost += item.piihan_pengiriman.cost
            dataCheckOut.push(item)
            console.log("ambil Dataaaaa")
        }
    })
    const response = h.response({
        status: "Success",
        message: "Data Berhasil Di Dapatkan",
        data: dataCheckOut,
        subTotalPrice: SubTotalPrice,
        subTotalShippingCost: ShippingcCost,
        ServicePrice: SubTotalPrice * 0.1,
        Total: SubTotalPrice + ShippingcCost + (SubTotalPrice * 0.1)
    })
    return response
}


const FinishCheckout = async (request, h) => {
    const { username } = request.auth.credentials

    const io = request.server.app.io
    const storeConnections = request.server.app.storeConnections

    console.log("oooooo")
    const DataBasedOnCustomer = CheckOutArray.filter((item) => item.user === username);
    await Promise.all(DataBasedOnCustomer.map(async (item) => {


        delete item.jenis_pengiriman
        const pengiriman = item.piihan_pengiriman;
        await Insert_Supabase("CheckoutData", {
            transaction_id: item.transaction_id,
            origin: item.origin,
            Customer: item.Customer,
            province: item.province,
            city: item.city,
            road: item.kecamatan,
            postalCode: item.postalCode,
            Seller: item.Seller,
            SellerID: item.SellerID,
            totalPay: item.totalPay,
            Username_Buyer: item.user,
            Courier: pengiriman.name,
            Courier_code: pengiriman.code,
            Courier_Service: pengiriman.service,
            Courier_Description: pengiriman.description,
            Courier_Cost: pengiriman.cost,
            Etd: pengiriman.etd,
        })

        const product = item.product

        const arrayUsernameSeller = []
        await Promise.all(
            product.map(async (items) => {
                const get_username = await select_data_user('Productku', items.id, 'id')

                for ([key, value] of Object.entries(storeConnections)) {
                    console.log(storeConnections[key])
                    if (value.user === get_username[0].Username) {
                        io.to(value.id).emit('Notification', "Ada yang pesan Produk Kamu! Cek Sekarang Juga!")
                        console.log("pesan terikirim")
                        break
                    }
                }

                await Insert_Supabase("CheckoutProductDetail",
                    {
                        id_transaction_product: nanoid(20),
                        id_transaction_category: item.transaction_id,
                        id_product: items.id,
                        product_name: items.title,
                        pcs: items.pcs,
                        price: items.price,
                        totalPrice: items.totalPrice,
                        Status: items.status,
                        indexCategory: items.indexCategory
                    }
                )
            })
        )

    }))

    const checkoutDataBaru = CheckOutArray.filter((item) => item.user !== username)
    CheckOutArray = checkoutDataBaru;


    return true
}

const getDataProcess = async (category, valueReference, ColumnReference) => {
    let data = await select_data_user("CheckoutData", valueReference, ColumnReference)
    const getData = []

    await Promise.all(
        data.map(async (item) => {
            const product = await select_data_user("CheckoutProductDetail", item.transaction_id, "id_transaction_category")
            if (product.length != 0) {
                let totalPay = 0;
                const filterCategory = []
                product.map((items) => {
                    if (items.Status === category) {
                        totalPay += Number(items.totalPrice)
                        filterCategory.push(items)
                    }
                })
                totalPay += item.Courier_Cost
                item = { ...item, totalPay, products: filterCategory }
                if (filterCategory.length !== 0) {
                    getData.push(item)
                }
            }
        })
    )
    return getData
}

const GetProcessOrder = async (request, h) => {
    const { username } = request.auth.credentials
    const { category } = request.params;

    const getData = await getDataProcess(category, username, 'Username_Buyer')

    if (getData.length != 0) {
        const response = h.response({
            status: "Success",
            message: "Berhasil Mendapatkan Data Checkout",
            data: getData
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Data Checkout Process Kosong",
    })
    response.code(404)
    return response
}

const YourProductOrder = async (request, h) => {
    const { username } = request.auth.credentials
    const { category } = request.params;

    const accountdata = await select_data_user('Account', username, "username")
    const getData = await getDataProcess(category, accountdata[0].id, 'SellerID')

    if (getData != 0) {
        const response = h.response({
            status: "Success",
            message: "Berhasil Mendapatkan Data Checkout",
            data: getData
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Gagal Mendapatkan Data Checkout",
    })
    response.code(404)
    return response
}

const SettingStatus = async (request, h) => {
    const { username } = request.auth.credentials
    const { id_product_transaction, setValue } = request.payload;
    const data = await select_data_user('CheckoutProductDetail', id_product_transaction, 'id_transaction_product')

    const indexCategory = data[0].indexCategory
    const PcsToOrder = Number(data[0].pcs)
    //ambil data produk untuk di update stok
    const getProduct = await select_data_user('Productku', data[0].id_product, 'id')

    //ambil data cart untuk di update stok
    const updateDataCart = await select_data_user('cartproduct', data[0].id_product, 'id')
    await Promise.all(
        // process Update Stok
        updateDataCart.map(async (item) => {
            const PcsUpdate = item.pcs - PcsToOrder
            //eksekusi update stok
            PcsUpdate <= 0 ? await deleteData('cartproduct', 'idCart', item.idCart) : await UpdateData("cartproduct", 'idCart', item.idCart, [{ pcs: PcsUpdate }])
        })
    )

    const upDateListStok = getProduct[0].stok
    console.log(upDateListStok)
    upDateListStok[indexCategory] = getProduct[0].stok[indexCategory] - PcsToOrder
    console.log(upDateListStok)

    //eksekusi update stok produk
    await UpdateData('Productku', 'id', data[0].id_product, [{ stok: upDateListStok }])

    //memperbarui Status checkout
    await UpdateData('CheckoutProductDetail', 'id_transaction_product', id_product_transaction, [{ Status: setValue }])
    return true
}

const GetData = async (request, h) => {
    const { username } = request.auth.credentials;
    const io = request.server.app.io;
    const storeConnections = request.server.app.storeConnections;


    console.log("Get Product Data " + new Date().toISOString())
    let { data, error } = await supabase
        .from('Productku')
        .select('*')

    const targetSocket = storeConnections[username]; // Pastikan username adalah socket ID atau hubungkan dengan logic mapping
    if (targetSocket) {
        io.to(targetSocket).emit("Message", "SELAMAT DATANG")
        console.log("pesan terkirim kepada", targetSocket)
    }

    /*
    if (storeConnections[username]) {
        storeConnections[username].emit("Message", "Selamat Datang ")
    }
        */
    const response = h.response({
        status: "success",
        messages: "Data Berhasil Di Dapatkan",
        data: JSON.stringify(data)
    })

    response.code(200)
    return response
}

const GetProdukBySeller = async (request, h) => {
    const { username } = request.auth.credentials;
    let dataFilter = await select_data_user('Productku', username, 'Username')
    const response = h.response({
        status: "success",
        message: "Data Success Didapat",
        data: dataFilter,
    })
    response.code(200)
    return response;
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

const deletePictureBucket = async (filename, bucket) => {
    const filePath = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
    console.log(filePath)

    // 2. Hapus file dari bucket
    const { data, error } = await supabase
        .storage
        .from(bucket) // Ganti dengan nama bucket Anda
        .remove([filePath]);

    if (error) {
        console.error('Error deleting file:', error.message);
        return false; // Indikator kegagalan
    } else {
        console.log('File deleted successfully:', data);
        return true; // Indikator keberhasilan
    }
}

const ChangeImageProfile = async (request, h) => {
    const { username } = request.auth.credentials
    const { files } = request.payload

    const get_Account = await select_data_user('Account', username, 'username');
    if (get_Account !== -1) {
        if (get_Account[0].image !== 'user.png') {
            await supabase.storage.from('ProfilePicture').remove([`${process.env.SUPABASE_URL}/storage/v1/object/public/ProfilePicture/`, get_Account[0].image])
        }
        await uploadImagestoSupabase(files, 'ProfilePicture')
        await UpdateData('Account', 'username', username, [{ image: files.hapi.filename }])

        const { data, error } = await supabase
            .from('CategoryChat')
            .select('*')
            .or(`usernameSend.eq.${username},userReceive.eq.${username}`)
            .order('timestamp', { ascending: false });

        Promise.all(
            data.map( async(item) => {
                if (item.usernameSend === username) {
                    await UpdateData('CategoryChat','usernameSend',username,[{SenderPictPathName:files.hapi.filename}])
                } else {
                    await UpdateData('CategoryChat','userReceive',username,[{ReceivePictPathName:files.hapi.filename}])
                }
            })
        )
        const response = h.response({
            status: "Success",
            message: "Gambar Berhasil Di Upload",
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Gambar Gagal Di Upload",
    })
    response.code(400)
    return response



}

const UploadImage = async (request, h) => {
    const { username } = request.auth.credentials
    const { files } = request.payload
    const upload = await uploadImagestoSupabase(files, 'gambarProducts')
    if (upload) {
        const response = h.response({
            status: "Success",
            message: "Gambar Berhasil Di Upload",
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Gambar Gagal Di Upload",
    })
    response.code(400)
    return response

}

const deletePicture = async (request, h) => {
    const { username } = request.auth.credentials
    const { filename } = request.params;

    await deletePictureBucket(filename, 'gambarProducts');
}

const AddProduct = async (request, h) => {
    const { username } = request.auth.credentials
    const { images, title, kind, price, stok, content, weight } = request.payload;
    let { data, error } = await supabase
        .from('Account')
        .select('*')
    const checkedAccount = data.findIndex((item) => item.username === username);
    if (checkedAccount !== -1) {
        const Seller = data[checkedAccount].nama
        const SellerID = data[checkedAccount].id

        const AccountToken = await select_data_user('AccountToken', data[checkedAccount].id, 'idAccount')
        if (AccountToken.length === 1) {
            const id = nanoid();
            const Time = new Date().toISOString();

            const data_baru = {
                id: id,
                Seller: Seller,
                SellerID: SellerID,
                Username: username,
                URLimages: images,
                title: title,
                kind: kind,
                price: price,
                stok: stok,
                content: content,
                UpdateAt: Time,
                state: data[checkedAccount].state,
                city: data[checkedAccount].city,
                road: data[checkedAccount].road,
                origin: data[checkedAccount].postalCode,
                weight: weight
            }
            await Insert_Supabase('Productku', data_baru)

            console.log(data_baru);
            Genre.push(data_baru);
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
    const { username } = request.auth.credentials
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
    const { username } = request.auth.credentials
    const { idProduct } = request.params;

    if (username) {
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
        UpdateAt: Time,
    })
    response.code(500)
    return response;
}


const GetAccountByUsername = async (request, h) => {
    const { username } = request.params

    let { data, error } = await supabase
        .from('Account')
        .select('*')
    const index = data.findIndex((item) => item.username === username);
    const product = await select_data_user('Productku', username, 'Username')

    if (index !== -1) {
        const response = h.response({
            status: "Success",
            message: "Account Didapatkan",
            account: {
                nama: data[index].nama,
                image: data[index].image,
                username: data[index].username,
                province: data[index].state,
                city: data[index].city,
                road: data[index].road,
                postalCode: data[index].postalCode
            },
            product: product
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Account Tidak Ditemukan",
    })
    response.code(404)
    return response
}

const ProcesOrder = (request, h) => {
    const { username } = request.payload
    const { id_transaction, id_product } = request.params;



}

const SECRET_ACCESS_TOKEN = 'access_secret_key';
const SECRET_REFRESH_TOKEN = 'refresh_secret_key';

const Get_Acces = async (request, h) => {
    const { refreshToken } = request.payload;

    const checkToken = await select_data_user('RefreshToken', refreshToken, 'refreshToken')
    if (checkToken.length !== 0) {
        console.log(checkToken)
        const username = checkToken[0].username

        const acces_token = jwt.sign(
            { username }, SECRET_ACCESS_TOKEN, { 'expiresIn': 10 * 60 }
        )
        console.log(acces_token)
        const response = h.response({
            status: "Success",
            message: "Token Berhasil Diperbarui",
            acces_token: acces_token
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Token Tidak Diketahui ",
    })
    response.code(404)
    return response
}

const GetDataAccount = async (request, h) => {
    const storeConnections = request.server.app.storeConnections;
    const io = request.server.app.io
    const { username, kata_sandi } = request.payload;

    for ([key, value] of Object.entries(storeConnections)) {
        if (value.user === username) {
            const response = h.response({
                status: "Failed",
                message: "Account Sedang digunakan di device lain",
            })
            response.code(500)
            return response
        }
    }

    let { data, error } = await supabase
        .from('Account')
        .select('*')

    const index = data.findIndex((item) => item.username === username)

    console.log("Login Berhasil " + new Date().toISOString())


    if (index !== -1) {
        const result = await bcrypt.compare(kata_sandi, data[index].kata_sandi);
        console.log(result)

        if (result) {


            const acces_token = jwt.sign(
                { username }, SECRET_ACCESS_TOKEN, { 'expiresIn': 10 * 60 }
            )

            const refresh_token = jwt.sign(
                { username, kata_sandi }, SECRET_REFRESH_TOKEN, { 'expiresIn': 7 * 24 * 60 * 60 }
            )

            const checked = await select_data_user('RefreshToken', username, 'username')
            console.log(checked)
            if (checked !== -1) {
                await deleteData('RefreshToken', 'username', username)
            }

            await Insert_Supabase('RefreshToken', {
                username: data[index].username,
                idAccount: data[index].id,
                refreshToken: refresh_token
            })

            const response = h.response({
                status: "Success",
                message: "Login Berhasil",
                acces_token: acces_token,
                refresh_token: refresh_token,
                username: username
            })

            response.code(200)
            return response;
        }
    }
    const response = h.response({
        status: "Failed",
        message: "Akun Tidak Ditemukan",
    })
    response.code(404)
    return response;
}


const AddAccount = async (request, h) => {
    const { username, email, nama, kata_sandi, kata_sandi2, image } = request.payload;
    const id = nanoid(15);
    let available = false

    let { data, error } = await supabase
        .from('Account')
        .select('*')
    data.map((item) => {
        if (item.username === username) {
            available = true;
        }
    })

    if (available) {
        const response = h.response({
            status: "Failed",
            message: "Username Sudah Ada"
        })
        response.code(500);
        return response
    }

    if (kata_sandi === kata_sandi2) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(kata_sandi, salt, async (err, hash) => {
                if (err) {
                    const response = h.response({
                        status: "Failed",
                        message: "Account Gagal Didaft arkan"
                    })
                    response.code(400);
                    return response
                }

                const actual_sandi = hash
                const AccountData = {
                    id: id,
                    username: username,
                    email: email,
                    nama: nama,
                    kata_sandi: actual_sandi,
                    image: image,
                    state: null,
                    city: null,
                    road: null,
                    postalCode: null,
                }
                console.log(AccountData)
                const checked = account.filter((item) => id === item.id)
                if (checked.length == 0) {
                    account.push(AccountData);
                    await Insert_Supabase('Account', AccountData)
                }


            })
        })

        console.log("udah nambah data")
        const response = h.response({
            status: "success",
            message: "Account Berhasil Di Daftarkan"
        })
        response.code(200);
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Account Gagal11 Didaftarkan"
    })

    response.code(401);
    return response
}


const CartData = [{
    username: '',
    data: []
}];

const GetCart = async (request, h) => {
    const { username } = request.auth.credentials;
    const data = await select_data_user('Account', username, 'username')
    console.log("Mengambil Data Keranjang " + new Date().toISOString())
    const Index = data.findIndex((item) => item.username === username)
    if (Index !== -1) {
        const checkCart = CartData.findIndex((item) => item.username === username);
        if (checkCart !== -1) {
            CartData.splice(checkCart, 1);
        }
        CustomerCart = await select_data_user('cartproduct', username, 'user');
        CartData.push({
            username: username,
            data: CustomerCart
        })

        const SellerProduct = await select_data_user('CheckoutData', data[0].id, 'SellerID');
        console.log(SellerProduct)

        const response = h.response({
            status: 'Success',
            message: 'Sucess to Get Cart Data',
            data: CustomerCart,
            SumProcessProduct: SellerProduct.length
        })

        response.code(200)
        return response
    }

    const response = h.response({
        status: "Failed",
        message: "Nama Customer Tidak Dikenal",
    })
    response.code(404)
    return response
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

//select data
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


const addToCart = async (request, h) => {
    const { username } = request.auth.credentials;
    const { id, index, pcs, Seller, SellerID } = request.payload;

    let { data, error } = await supabase
        .from('Productku')
        .select('*')
    console.log(data)

    const Index_product = data.findIndex((item) => item.id === id);
    if (Index_product !== -1) {
        const product = data[Index_product];
        console.log(product)
        if (pcs < 1) {
            const response = h.response({
                status: "Failed",
                message: "PCS KURANG DARI 0",
            })
            response.code(401)
        }
        const data_baru = {
            idCart: nanoid(20),
            id: id.toString(),
            title: product.title,
            indexCategory: index,
            pcs: pcs,
            price: product.price[index],
            totalPrice: product.price[index] * pcs,
            origin: product.origin,
            weight: product.weight,
            totalweight: product.weight * pcs,
            user: username,
            Seller: Seller,
            SellerID: SellerID
        }
        await Insert_Supabase('cartproduct', data_baru)
        const response = h.response({
            status: 'Success',
            message: 'Add To Cart',
            data: data_baru,
        })
        console.log(Cart)
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "PCS KURANG DARI 0",
    })
    response.code(401)
}

const deleteData = async (tableName, ColumnReference, Value) => {
    const response = await supabase
        .from(tableName)
        .delete()
        .eq(ColumnReference, Value)

    return response

}

const hapusKeranjang = async (request, h) => {
    const { username } = request.auth.credentials;
    const { id } = request.params;


    const IndexUsername = CartData.findIndex((item) => item.username === username);
    if (IndexUsername !== -1) {
        await deleteData('cartproduct', 'idCart', id);
        const get_Index_product = CartData[IndexUsername].data.findIndex((item) => item.idCart === id)
        console.log(CartData[IndexUsername].data)
        console.log(id)
        CartData[IndexUsername].data.splice(get_Index_product, 1)
        const response = h.response({
            status: "Success",
            message: "Delete Cart Success"
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Delete Cart Failed",
    })
    response.code(404)
    return response
}

let CartToPay = []


const GetCartBasedOnSeller = async (request, h) => {
    const { username } = request.auth.credentials;
    let Index = null

    CartBasedOnCust = []
    const getCart = CartData.findIndex((item) => item.username === username)
    CartBasedOnCustomer = CartData[getCart].data
    console.log("pertama")
    console.log(CartBasedOnCustomer)
    CartBasedOnCustomer.map((item, index) => {
        let point = 0
        if (CartBasedOnCust.length !== 0) {
            CartBasedOnCust.map((item2, index) => {
                if (item.Seller === item2.Seller) {
                    Index = index
                    point = 1
                }
            })
        }
        if (point === 0 && item.user === username) {
            const data = {
                id: item.idCart,
                Seller: item.Seller,
                username: item.user,
                cartProduk: [{
                    id: item.idCart,
                    indexCategory: item.indexCategory,
                    SellerID: item.SellerID,
                    title: item.title,
                    pcs: item.pcs,
                    price: item.price,
                    totalPrice: item.totalPrice,
                    index: index
                }]
            }
            CartBasedOnCust.push(data)
        } else if (point == 1) {
            console.log("dijalankan karena ada seller yang sama")
            CartBasedOnCust[Index].cartProduk.push({
                id: item.idCart,
                indexCategory: item.indexCategory,
                SellerID: item.SellerID,
                title: item.title,
                pcs: item.pcs,
                price: item.price,
                totalPrice: item.totalPrice,
                index: index
            })
        }

    })

    //antisipasi apabila user reload data, yang mana user tidak sengaja
    //sudah menceklis pesanan.
    //Hal Ini dipakai untuk otomatisasi Ceklis pada checkbox
    const dataCartToPay = []
    const data = []
    let TotalItem = 0;
    let TotalPrice = 0
    CartToPay.map((item) => {
        if (item.user === username) {
            dataCartToPay.push(item.idCart)
            TotalItem += item.pcs
            TotalPrice += item.totalPrice
            data.push(item)
        }
    })

    if (dataCartToPay.length !== 0) {
        const response = h.response({
            status: 'Success',
            message: 'Data Berhasil Didapatkan',
            data: JSON.stringify(CartBasedOnCust),
            lengthCart: Cart.length,
            cartToPay: dataCartToPay,
            totalPrice: TotalPrice,
            TotalItem: TotalItem,
            allDataCartToPay: data
        })
        response.code(200)
        return response

    }
    //=======================================================
    console.log("bagian akhir")
    console.log(CartToPay)
    const response = h.response({
        status: 'Success',
        message: 'Data Berhasil Didapatkan',
        data: JSON.stringify(CartBasedOnCust),
        lengthCart: CartData.length
    })
    response.code(200)
    return response
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

const EditPcsCart = async (request, h) => {
    const { username } = request.auth.credentials;
    const { id, value } = request.payload;
    if (value > -1) {
        const index = CartData.findIndex((item) => username === item.username)
        //memperbarui CartData
        const data = CartData[index]
        console.log("pertamaxxx")
        console.log(data)
        //memperbarui berdasarkan
        const indexDataCart = data.data.findIndex((item) => item.idCart === id)
        if (indexDataCart === -1) {
            return false
        }

        data.data[indexDataCart].pcs = value
        const total = value * data.data[indexDataCart].price
        data.data[indexDataCart].totalPrice = total

        const bobot = value * Number(data.data[indexDataCart].weight)
        data.data[indexDataCart].totalweight = bobot.toString()

        const sesiUpdate = [{ pcs: value }, { totalPrice: total }, { totalweight: bobot.toString() }]
        //memeperbarui di dalam database
        await UpdateData('cartproduct', 'idCart', id, sesiUpdate)


        const response = h.response({
            status: "Success",
            message: "Data Berhasil Di Update"
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Data Gagal Di Update"
    })
    response.code(404)
    return response

}


const AddToPayCart = (request, h) => {
    const { username } = request.auth.credentials;
    const { idCart, e } = request.payload;
    let TotalPrice = 0;
    let TotalItem = 0;

    const get_Cart = CartData.findIndex((item) => item.username === username)
    if (get_Cart !== -1) {
        const dataCart = CartData[get_Cart].data
        if (e) {
            console.log("Berhasil")
            const index = dataCart.findIndex((item) => idCart === item.idCart && !CartToPay.includes(idCart))
            console.log(index)
            CartToPay.push(dataCart[index])
        } else {
            const index = CartToPay.findIndex((item) => idCart === item.idCart)
            CartToPay.splice(index, 1)
        }

        console.log("sempat masuk")
        console.log(CartToPay)

        const id_transaction_array = []
        CartToPay.map((item) => {
            if (item.user === username) {
                TotalPrice += item.totalPrice
                TotalItem += item.pcs
                id_transaction_array.push(item.id)
            }
        })
        const response = h.response({
            message: "Data Berhasil Di Update",
            status: "Success",
            data: CartToPay,
            TotalPrice: TotalPrice,
            TotalItem: TotalItem,
        })
        response.code(200)
        return response
    }
}

const AccountToken = [];
const AccountTokenExpire = [];//ketika dimasukan kedalam array ini dahulu, dengan time terbatas.
const VerifyAccount = async (request, h) => {
    const { username } = request.auth.credentials

    const { id, email, state, city, road, postalCode, pass } = request.payload;

    console.log(city, road, postalCode, pass)

    const account = await select_data_user('Account', id, 'id')
    const index = account.findIndex((item) => item.id === id)
    if (index !== -1) {
        const result = await bcrypt.compare(pass, account[index].kata_sandi);
        if (result) {
            //validasi apakah token akun id di atas sudah ada atau belum.
            const CheckAccountToken = AccountToken.filter((item) => item.idAccount === id);
            if (CheckAccountToken.length > 0) {
                return false
            }

            //validasi untuk menghapus data token sebelumnya untuk diganti yang terbaru
            const CheckAccountTokenExpire = AccountTokenExpire.filter((item) => item.idAccount === id);
            if (CheckAccountTokenExpire.length > 0) {
                CheckAccountTokenExpire.map((item, index) => {
                    AccountTokenExpire.splice(index, 1);
                })
            }

            //data Terbaru
            const filterBasedOnId = AccountTokenExpire.filter((item) => item.idAccount === id);
            const token = nanoid(30);
            if (filterBasedOnId.length === 0) {
                AccountTokenExpire.push({
                    idAccount: id,
                    token: token,
                    insertAtTime: new Date().getTime()
                })
            }

            //update Terbaru Account
            account[index] = { ...account[index], state, city, road, postalCode }
            await UpdateData('Account', 'id', id, [{ state: state }, { city: city }, { road: road }, { postalCode: postalCode }])

            console.log(account[index])
            console.log(AccountTokenExpire);

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'sadewowidyanto@gmail.com',
                    pass: 'qpax kohx ycul suca'
                },
                debug: true, // Aktifkan log debug
                logger: true,
            })

            const mailMessages = {
                from: "sadewowidyanto@gmail.com",
                to: email,
                subject: "Verifikasi Akun",
                html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h1 style="color: black;">Verifikasi Akun Anda</h1>
        <p>Halo,</p>
        <p>Terima kasih telah verifikasi account project prtofolio saya 😁😁. Silakan klik tombol di bawah untuk memverifikasi akun Anda:</p>
        <a href="http://localhost:5173/verify/${token}"
           style="display: inline-block; background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Verifikasi Sekarang
        </a>
        <p>Jika Anda tidak melakukan pendaftaran, abaikan email ini.</p>
        <p>Salam, <br> Tim Support</p>
      </div>
    `,
            };
            try {
                const verfikasi = await transporter.sendMail(mailMessages);
                console.log("email di verfikasi", verfikasi.response)
                const response = h.response({
                    status: "Success",
                    message: "Verifikasi Berhasil"
                })
                response.code(200)

                return response
            } catch (e) {
                console.log(e.message)
                const response = h.response({
                    status: "Failed",
                    message: "Verifikasi Gagal"
                })
                response.code(400)
                return response
            }
        }
        const response = h.response({
            status: "Failed",
            message: "Kata Sandi Salah"
        })
        response.code(400)
        return response
    }
}


const CheckedToken = async (request, h) => {
    const { username } = request.auth.credentials
    const { token } = request.payload;

    //validasi apakah token sudah ada atau belum.
    const CheckAccountToken = AccountToken.filter((item) => item.token === token);

    console.log(CheckAccountToken);
    if (CheckAccountToken.length > 0) {
        const response = h.response({
            status: "Failed",
            message: "Account sudah di Verifikasi",
        })
        response.code(401)
        return response
    }

    const data = await select_data_user('Account', username, 'username');
    console.log("data")
    if (data.length !== -1) {
        const IndexTokenExpireCheck = AccountTokenExpire.findIndex((item) => item.token === token);
        console.log(IndexTokenExpireCheck)
        if (IndexTokenExpireCheck !== -1) {
            const idAccount = AccountTokenExpire[IndexTokenExpireCheck].idAccount;
            const VerifyAt = new Date().getTime();
            //validasi Selisih, Jika Sudah melewati 5menit. maka token sudah expired untuk di verifikasi
            const acuan = 20 * 60000
            const hitung_selisih = VerifyAt - AccountTokenExpire[IndexTokenExpireCheck].insertAtTime
            console.log(hitung_selisih)
            if (hitung_selisih < acuan) {
                await Insert_Supabase('AccountToken', {
                    idAccount: idAccount,
                    token: token,
                })
                const response = h.response({
                    status: "Success",
                    message: "Account Berhasil Verifikasi",
                })
                response.code(200)
                return response
            } else {
                const response = h.response({
                    status: "Failed",
                    message: "Token sudah expired",
                })
                response.code(401)
                return response
            }


        } else {
            const response = h.response({
                status: "Failed",
                message: "Token Tidak Ditemukan",
            })
            response.code(401)
            return response
        }

    }
    const response = h.response({
        status: "Failed",
        message: "Account Tidak Ditemukan",
    })
    response.code(404)
    return response
}

const CheckAccount = async (request, h) => {
    const { username } = request.auth.credentials;

    const data = await select_data_user('Account', username, 'username')
    console.log(data)
    const account = data
    const checkedId = account.findIndex((item) => item.username === username)
    if (checkedId !== -1) {
        const id = account[checkedId].id
        console.log(id)

        const data = await select_data_user('AccountToken', id, 'idAccount');
        const AccountToken = data

        if (AccountToken.length === 1) {
            const response = h.response({
                status: "verified",
                verified: true
            })
            response.code(200)
            return response
        }

        //karena tidak di verifikasi maka alamat pada akun akan hilang
        const state = null
        const city = null
        const road = null
        const postalCode = null
        await UpdateData('Account', 'id', data.id, [{ state: state }, { city: city }, { road: road }, { postalCode: postalCode }])
        const response = h.response({
            status: "not Verified",
            verified: false
        })
        response.code(400)
        return response
    }
    const response = h.response({
        status: "not Found",
    })
    response.code(404)
    return response
}

const GetMyAccount = async (request, h) => {
    const { username } = request.auth.credentials
    let { data, error } = await supabase
        .from('Account')
        .select('*')
    const checkedAccount = data.findIndex((item) => item.username === username)
    if (checkedAccount !== -1) {
        const MyAccount = data[checkedAccount];
        const response = h.response({
            status: "Success",
            message: "Success To Get Account",
            dataAccount: MyAccount
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "Failed To Get Account",
    })
    response.code(404)
    return response
}


const GetRoomChat = async (request, h) => {
    const { username } = request.auth.credentials

    const { data, error } = await supabase
        .from('CategoryChat')
        .select('*')
        .or(`and(usernameSend.eq.${username},isDeletedOnAccount1.eq.${false}),and(userReceive.eq.${username},isDeletedOnAccount2.eq.${false})`)


    let ListChatBasedOnRoom = {}
    let dataCategoryChat = []
    if (data) {
        await Promise.all(
            data.map(async (item) => {

                const get_data = async () => {
                    let { data, error } = await supabase
                        .from('ChatData')
                        .select("*")
                        .eq('idCategoryChat', item.idCategory)
                        .order('id', { ascending: true }); // Use { ascending: false } for descending order
                    return data
                }

                const ListChat = await get_data();

                const nUnRead = ListChat.filter((item) =>
                    (item.Receive === username && item.isRead === 'false'))

                console.log(item.idCategory)
                ListChatBasedOnRoom[item.idCategory] = {
                    data: ListChat.filter((item) => (item.Sender === username && item.isDeletedOnAccount1 === false) || (item.Receive === username && item.isDeletedOnAccount2 === false)),
                }

                item = { ...item, nUnRead: nUnRead.length }
                dataCategoryChat.push(item)

            })
        )
        const response = h.response({
            status: "Success",
            Message: "Berhasil Mengambil Data",
            data: dataCategoryChat,
            ListChat: ListChatBasedOnRoom
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        Message: "Gagal Mengambil Data",
        data: data
    })
    response.code(404)
    return response
}

const CheckToRead = async (request, h) => {
    const { username } = request.auth.credentials;
    const { IdCategoryChat } = request.params;

    const checkCategoryChat = await select_data_user('CategoryChat', IdCategoryChat, 'idCategory');
    if (checkCategoryChat[0].userReceive === username) {
        await UpdateData('CategoryChat', 'idCategory', IdCategoryChat, [{ isAllRead: true }])
        await UpdateData('ChatData', 'idCategoryChat', IdCategoryChat, [{ isRead: true }])
    }
    return true

}


const Chatting = async (request, h) => {
    const { username } = request.auth.credentials
    const { Text, to, idCategoryRoomChat } = request.payload;
    const storeConnections = request.server.app.storeConnections
    const io = request.server.app.io

    let IdCategoryChat = idCategoryRoomChat ? idCategoryRoomChat : nanoid(10)
    const times = new Date();
    const hours = times.getHours();
    const minute = times.getMinutes();
    const timeStamp = Number(times.getTime());
    const createdAt = `${hours}.${minute}`

    //mendapatkan image Account penerima Pesan
    const imageReceive = await select_data_user('Account', to, 'username')
    const Sender = await select_data_user('Account', username, 'username')
    if (imageReceive.length === 1 && Sender.length === 1) {
        //tambahkan ke data Category Chat Terlebih Dahulu 
        //tapi harus di validasi apakah category sudah ada?jika ada maka tidak perlu
        const { data, error } = await supabase
            .from('CategoryChat')
            .select('*')
            .or(`and(usernameSend.eq.${username},userReceive.eq.${to}),and(usernameSend.eq.${to},userReceive.eq.${username})`)
            .order('timestamp', { ascending: false });

        console.log(data)
        if (!idCategoryRoomChat && data.length === 0) {
            await Insert_Supabase('CategoryChat', {
                idCategory: IdCategoryChat,
                StatusChat: 'Private',
                usernameSend: username,
                userReceive: to,
                LastContent: Text,
                isAllRead: false,
                CreatedAt: createdAt,
                ReceivePictPathName: imageReceive[0].image,
                SenderPictPathName: Sender[0].image,
                isDeletedOnAccount1: false,
                isDeletedOnAccount2: false,
                timestamp: timeStamp,
            })
        } else {

            await UpdateData('CategoryChat', 'idCategory', data ? data[0].idCategory : idCategoryRoomChat,
                [
                    { ReceivePictPathName: imageReceive[0].image },
                    { SenderPictPathName: Sender[0].image },
                    { isAllRead: false },
                    { usernameSend: username },
                    { userReceive: to },
                    { LastContent: Text },
                    { CreatedAt: createdAt },
                    { timestamp: timeStamp },
                    { isDeletedOnAccount1: false },
                    { isDeletedOnAccount2: false },
                ])
        }
        //lalu tambahkan kedalam data chat
        await Insert_Supabase('ChatData', {
            idCategoryChat: data.length !== 0 ? data[0].idCategory : IdCategoryChat,
            idChat: nanoid(5),
            isRead: false,
            Content: Text,
            Sender: username,
            CreatedAt: createdAt,
            Receive: to,
            isDeletedOnAccount1: false,
            isDeletedOnAccount2: false,
            id: timeStamp,
        })

        for ([key, value] of Object.entries(storeConnections)) {
            if (value.user === to) {
                console.log("mengirim ke", key)
                io.to(value.id).emit("ReloadMessage", data.length !== 0 ? data[0].idCategory : IdCategoryChat)
            }
        }
        console.log(storeConnections)
        const response = h.response({
            status: "Success",
            message: "Pesan Berhasil Terkirim",
        })
        response.code(200)
        return response

    }
    const response = h.response({
        status: "Failed",
        message: "Pesan Gagal Terkirim",
    })
    response.code(404)
    return response
}

const DeleteChat = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idChat } = request.params;

    console.log(idChat)

    const data = await select_data_user('ChatData', idChat, 'idChat');
    if (data.length === 1) {
        console.log(data)
        for ([key, value] of Object.entries(data[0])) {
            if (value === username) {
                if (key === 'Sender') {
                    await UpdateData('ChatData', 'idChat', idChat, [{ isDeletedOnAccount1: true }])
                } else {
                    await UpdateData('ChatData', 'idChat', idChat, [{ isDeletedOnAccount2: true }])
                }
                break
            }
        }
        const response = h.response({
            status: "Success",
            message: "Pesan Berhasil Dihapus",
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: "Failed",
        message: "Pesan Gagal Dihapus",
    })
    response.code(400)
    return response

}

module.exports = {
    GetData, GetProdukBySeller, AddProduct, EditProduct,
    DeleteProduct, AddAccount, GetDataAccount,
    GetAccountByUsername, addToCart, GetCart, hapusKeranjang, GetCartBasedOnSeller,
    EditPcsCart, AddToPayCart, getOngkir, CheckOut, GetOverallCheckout, ShippingSetter,
    FinishCheckout, GetProcessOrder, VerifyAccount, CheckedToken, CheckAccount, GetMyAccount,
    UploadImage, deletePicture, ChangeImageProfile, Get_Acces, ActionToDeleteCheckout,
    YourProductOrder, SettingStatus, Chatting, GetRoomChat, CheckToRead, DeleteChat
}