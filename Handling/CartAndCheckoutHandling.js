/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


const { nanoid } = require('nanoid');
const { supabase } = require('../supabase');
require("dotenv").config({ path: "../env" })

const { select_data_user, Insert_Supabase, UpdateData, deleteData, CheckMessage } = require('./Function')

const CartData = [{
    id: '',
    data: []
}];
let CartToPay = []


const addToCart = async (request, h) => {
    const { id } = request.auth.credentials;
    const { idProduct, index, pcs, SellerID } = request.payload;

    let { data, error } = await supabase
        .from('Productku')
        .select('*')


    const Index_product = data.findIndex((item) => item.id === idProduct);
    if (Index_product !== -1) {
        const product = data[Index_product];
        console.log(product)
        if (pcs < 1 && product[index].stock <= 0) {
            const response = h.response({
                status: "Failed",
                message: "PCS KURANG DARI 0",
            })
            response.code(401)
        }
        //sebelum mendaftarikan. di dahulukan check cart user dahulu, jika ada product yang sama, maka cukup tambahkan pcs nya saja
        const CartUserIndex = CartData.findIndex((item) => item.id === id)
        if (CartUserIndex !== -1) {
            const data = CartData[CartUserIndex].data
            const checkProduct = data.findIndex((item) => item.id === idProduct.toString())
            if (checkProduct !== -1) {
                const getPcs = data[checkProduct].pcs
                const getIdCart = data[checkProduct].idCart
                await UpdateData('cartproduct', 'idCart', getIdCart, [{ pcs: getPcs + pcs }])
                const response = h.response({
                    status: 'Success',
                    message: 'Add To Cart',
                })

                response.code(200)
                return response
            }
        }
        const data_baru = {
            idCart: nanoid(20),
            id: idProduct.toString(),
            title: product.title,
            indexCategory: index,
            pcs: pcs,
            price: product.price[index],
            totalPrice: product.price[index] * pcs,
            origin: product.origin,
            weight: product.weight,
            totalweight: product.weight * pcs,
            userID: id,
            SellerID: SellerID,

        }
        await Insert_Supabase('cartproduct', data_baru)

        const response = h.response({
            status: 'Success',
            message: 'Add To Cart',
            data: data_baru,
        })

        response.code(200)
        return response
    }
    const response = h.response({
        status: "Failed",
        message: "PCS KURANG DARI 0",
    })
    response.code(401)
}


const GetCart = async (request, h) => {
    const { id } = request.auth.credentials;
    console.log(id)
    const data = await select_data_user('Account', id, 'id')
    console.log("Mengambil Data Keranjang " + new Date().toISOString())
    if (data.length === 1) {
        const checkCart = CartData.findIndex((item) => item.id === id);
        if (checkCart !== -1) {
            CartData.splice(checkCart, 1);
        }

        let { data, error } = await supabase
            .from('cartproduct')
            .select('*,Seller:Account!SellerID(nama)')
            .eq('userID', id)
        const CustomerCart = data
        CartData.push({
            id: id,
            data: CustomerCart
        })

        const SellerProduct = await select_data_user('CheckoutData', id, 'SellerID');

        //checkPesan account
        const isThereMessage = await CheckMessage(id);
        const response = h.response({
            status: 'Success',
            message: 'Sucess to Get Cart Data',
            data: CustomerCart,
            SumProcessProduct: SellerProduct.length,
            notifMessage: isThereMessage
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

const hapusKeranjang = async (request, h) => {
    const { id } = request.auth.credentials;
    const { idProduct } = request.params;


    const IndexUsername = CartData.findIndex((item) => item.id === id);
    if (IndexUsername !== -1) {
        await deleteData('cartproduct', 'idCart', idProduct);
        const get_Index_product = CartData[IndexUsername].data.findIndex((item) => item.idCart === idProduct)
        console.log(CartData[IndexUsername].data)
        console.log(idProduct)
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

const GetCartBasedOnSeller = async (request, h) => {
    const { id } = request.auth.credentials;
    let Index = null

    const CartBasedOnCust = []
    console.log(CartData)
    const getCart = CartData.findIndex((item) => item.id === id)
    const CartBasedOnCustomer = CartData[getCart].data
    console.log("pertama")
    CartBasedOnCustomer.map((item, index) => {
        let point = 0
        if (CartBasedOnCust.length !== 0) {
            console.log("masukkkkkkkk")

            CartBasedOnCust.map((item2, index) => {
                console.log(item.SellerID,item2.SellerID)
                if (item.SellerID === item2.SellerID) {
                    console.log(item.SellerID,item2.SellerID)
                    Index = index
                    point = 1
                }
            })
        }
        if (point === 0 ) {
            const data = {
                username: item.user,
                Seller: item.Seller.nama,
                idUser: item.userID,
                SellerID: item.SellerID,
                cartProduk: [{
                    id: item.idCart,
                    indexCategory: item.indexCategory,
                    title: item.title,
                    pcs: item.pcs,
                    price: item.price,
                    totalPrice: item.totalPrice,
                    index: index
                }]
            }
            console.log(data)
            CartBasedOnCust.push(data)
        } else if (point == 1) {
            console.log("dijalankan karena ada seller yang sama")
            CartBasedOnCust[Index].cartProduk.push({
                id: item.idCart,
                indexCategory: item.indexCategory,
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
        if (item.userID === id) {
            dataCartToPay.push(item.idCart)
            TotalItem += item.pcs
            TotalPrice += item.totalPrice
            data.push(item)
        }
    })



    if (dataCartToPay.length !== 0) {
        console.log("Masuk kesinii")
        const response = h.response({
            status: 'Success',
            message: 'Data Berhasil Didapatkan',
            data: JSON.stringify(CartBasedOnCust),

            cartToPay: dataCartToPay,
            totalPrice: TotalPrice,
            TotalItem: TotalItem,
            allDataCartToPay: data
        })
        response.code(200)
        return response

    }
    //=======================================================
    //Respon Ini Terjadi Apabila tidak ada data CartTopPay(process Checkout yang belum Selesai)
    const response = h.response({
        status: 'Success',
        data: JSON.stringify(CartBasedOnCust),
        message: 'Data Berhasil Didapatkan',
    })
    response.code(200)
    return response
}



const EditPcsCart = async (request, h) => {
    const { id } = request.auth.credentials;
    const { idProduct, value } = request.payload;
    if (value > -1) {
        const index = CartData.findIndex((item) => id === item.id)
        //memperbarui CartData
        const data = CartData[index]
        //memperbarui berdasarkan
        const indexDataCart = data.data.findIndex((item) => item.idCart === idProduct)
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
        await UpdateData('cartproduct', 'idCart', idProduct, sesiUpdate)


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

const AddToPayCart = async (request, h) => {
    const { id } = request.auth.credentials;
    const { idCart, e } = request.payload;

    let TotalPrice = 0;
    let TotalItem = 0;

    const get_Cart = CartData.findIndex((item) => item.id === id)
    console.log(get_Cart)
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

        CartToPay.map((item) => {
            if (item.userID === id) {
                TotalPrice += item.totalPrice
                TotalItem += item.pcs
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

//===================================CHCEKOUT
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



let CheckOutArray = [];
const CheckOut = async (request, h) => {
    const { id } = request.auth.credentials
    const { Name, courier, province,
        city, kecamatan, kodepos } = request.payload;


    const CartToPayBasedOnUser = CartToPay.filter((item) => item.userID === id)

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
                        userID: item.userID,
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
                    userID: item.userID,
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
        data: CheckOutArray
    })

    response.code(200)
    return response
}

const GetOverallCheckout = (request, h) => {
    const { id } = request.auth.credentials;
    console.log("USERNAMEEEEE")


    const dataCheckOut = []
    let ShippingcCost = 0;
    let SubTotalPrice = 0;
    let name = null;
    CheckOutArray.map((item) => {
        let TotalPay = 0;
        if (item.userID === id) {
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
    const { id } = request.auth.credentials;
    console.log("HAPUS CHECKOUTTT")
    console.log(CheckOutArray)

    const checkoutDataBaru = CheckOutArray.filter((item) => item.userID !== id)
    const CartToPayBaru = CartToPay.filter((item) => item.userID !== id)
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
            Seller: item.Seller.nama,
            SellerID: item.SellerID,
            totalPay: item.totalPay,
            BuyerAccountID: item.userID,
            Courier: pengiriman.name,
            Courier_code: pengiriman.code,
            Courier_Service: pengiriman.service,
            Courier_Description: pengiriman.description,
            Courier_Cost: pengiriman.cost,
            Etd: pengiriman.etd,
        })

        const product = item.product
        await Promise.all(
            product.map(async (items) => {
                const get_username = await select_data_user('Productku', items.id, 'id')

                for ([key, value] of Object.entries(storeConnections)) {
                    console.log(storeConnections[key])
                    if (value.idUser === get_username[0].SellerID) {
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

const GetProcessOrder = async (request, h) => {
    const { id } = request.auth.credentials
    const { category } = request.params;

    const getData = await getDataProcess(category, id, 'BuyerAccountID')

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

const YourProductOrder = async (request, h) => {
    const { id } = request.auth.credentials
    const { category } = request.params;


    const getData = await getDataProcess(category, id, 'SellerID')

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

const CancelCheckout = async (request, h) => {
    const { id } = request.auth.credentials
    const { IdTransaction } = request.params
    console.log(IdTransaction)

    const CheckoutData = await select_data_user('CheckoutProductDetail', IdTransaction, 'id_transaction_category')
    if (CheckoutData[0].Status === 'Process') {
        await supabase.from('CheckoutProductDetail').delete()
            .eq('id_transaction_category', IdTransaction)

        const { error } = await supabase
            .from('CheckoutData')
            .delete()
            .eq('transaction_id', IdTransaction)
        if (error) {
            console.log(error)
        }

        const response = h.response({
            Status: "Success",
            Message: "Delete Checkout Data Success",
        })
        response.code(200)
        return response
    }
    const response = h.response({
        Status: "Failed",
        Message: "Delete Checkout Data Failed",
    })
    response.code(401)
    return response
}


module.exports = {
    addToCart, GetCart, hapusKeranjang, GetCartBasedOnSeller, EditPcsCart,
    AddToPayCart, getOngkir, CheckOut, GetOverallCheckout, ShippingSetter,
    FinishCheckout, GetProcessOrder, ActionToDeleteCheckout, YourProductOrder,
    CancelCheckout
}