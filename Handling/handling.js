/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { supabase } = require('../supabase');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require("dotenv").config({ path: "../env" })

const { select_data_user, UpdateData, Insert_Supabase, deleteData } = require('./Function')
const SettingStatus = async (request, h) => {
    const { id } = request.auth.credentials
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
const SECRET_ACCESS_TOKEN = 'access_secret_key';
const SECRET_REFRESH_TOKEN = 'refresh_secret_key';

const Get_Acces = async (request, h) => {
    const { refreshToken } = request.payload;
    console.log("get Access", refreshToken)

    const checkToken = await select_data_user('RefreshToken', refreshToken, 'refreshToken')
    if (checkToken.length !== 0) {
        console.log(checkToken)
        const account = await select_data_user('Account', checkToken[0].idAccount, 'id')
        const id = account[0].id

        const acces_token = jwt.sign(
            { id }, SECRET_ACCESS_TOKEN, { 'expiresIn': 10 * 60 }
        )
        console.log(acces_token)
        const response = h.response({
            status: "Success",
            message: "Token Berhasil Diperbarui",
            acces_token: acces_token,
            username: account[0].username
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






const GetRoomChat = async (request, h) => {
    const { id } = request.auth.credentials

    const { data, error } = await supabase
        .from('CategoryChat')
        .select('idCategory,LastContent,CreatedAt,\
            SenderAccountID,ReceiveAccountID,\
            userReceive:Account!ReceiveAccountID(username),\
            usernameSend:Account!SenderAccountID(username),\
            PictSend:Account!SenderAccountID(image),PictReceive:Account!ReceiveAccountID(image)')
        .or(`and(SenderAccountID.eq.${id},isDeletedOnAccount1.eq.${false}),\
            and(ReceiveAccountID.eq.${id},isDeletedOnAccount2.eq.${false})`)
        .order('timestamp',{ascending : true})

    let ListChatBasedOnRoom = {}
    let dataCategoryChat = []
    if (data) {
        await Promise.all(
            data.map(async (item) => {

                const get_data = async () => {
                    let { data, error } = await supabase
                        .from('ChatData')
                        .select("idChat,Content,isRead,isDeletedOnAccount1,\
                            isDeletedOnAccount2,CreatedAt,ReceiveAccountID,SenderAccountID,\
                            Sender:Account!SenderAccountID(username),Receive:Account!ReceiveAccountID(username)")
                        .eq('idCategoryChat', item.idCategory)
                        .order('id', { ascending: true }); // Use { ascending: false } for descending order
                    return data
                }

                const ListChat = await get_data();


                const nUnRead = ListChat.filter((item) =>
                    (item.ReceiveAccountID === id && item.isRead === 'false'))


                //Mengambil Data Chating yang tidak dihapus oleh userID
                ListChatBasedOnRoom[item.idCategory] = {
                    data: ListChat.filter((item) => ((item.SenderAccountID === id && item.isDeletedOnAccount1 === false) || (item.ReceiveAccountID === id && item.isDeletedOnAccount2 === false))),
                }
                
                item = { ...item, nUnRead: nUnRead.length }
                dataCategoryChat.push(item)

            })
        )

        console.log("Hasil Data")

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
    const { id } = request.auth.credentials;
    const { IdCategoryChat } = request.params;

    const checkCategoryChat = await select_data_user('CategoryChat', IdCategoryChat, 'idCategory');
    if (checkCategoryChat[0].ReceiveAccountID === id) {
        await UpdateData('CategoryChat', 'idCategory', IdCategoryChat, [{ isAllRead: true }])
        await UpdateData('ChatData', 'idCategoryChat', IdCategoryChat, [{ isRead: true }])
    }
    return true
}


const Chatting = async (request, h) => {
    const { id } = request.auth.credentials
    const { Text, to, idCategoryRoomChat } = request.payload;
    const storeConnections = request.server.app.storeConnections
    const io = request.server.app.io

    let IdCategoryChat = idCategoryRoomChat ? idCategoryRoomChat : nanoid(10)
    const times = new Date();
    const hours = times.getHours();
    const minute = times.getMinutes();
    const timeStamp = Number(times.getTime());
    const createdAt = `${hours}.${minute}`


    //tambahkan ke data Category Chat Terlebih Dahulu 
    //tapi harus di validasi apakah category sudah ada?jika ada maka tidak perlu
    const { data, error } = await supabase
        .from('CategoryChat')
        .select('*')
        .or(`and(SenderAccountID.eq.${id},ReceiveAccountID.eq.${to}),and(SenderAccountID.eq.${to},ReceiveAccountID.eq.${id})`)
        .order('timestamp', { ascending: true });

    console.log(data)
    if (!idCategoryRoomChat && data.length === 0) {
        await Insert_Supabase('CategoryChat', {
            idCategory: IdCategoryChat,
            StatusChat: 'Private',
            LastContent: Text,
            isAllRead: false,
            CreatedAt: createdAt,
            isDeletedOnAccount1: false,
            isDeletedOnAccount2: false,
            SenderAccountID: id,
            ReceiveAccountID: to,
            timestamp: timeStamp,
        })
    } else {
        await UpdateData('CategoryChat', 'idCategory', data ? data[0].idCategory : idCategoryRoomChat,
            [
                { isAllRead: false },
                { LastContent: Text },
                { CreatedAt: createdAt },
                { timestamp: timeStamp },
                { isDeletedOnAccount1: false },
                { isDeletedOnAccount2: false },
                { SenderAccountID: id },
                { ReceiveAccountID: to },
            ])
    }

    //lalu tambahkan kedalam data chat
    await Insert_Supabase('ChatData', {
        idCategoryChat: data.length !== 0 ? data[0].idCategory : IdCategoryChat,
        idChat: nanoid(5),
        isRead: false,
        Content: Text,
        CreatedAt: createdAt,
        isDeletedOnAccount1: false,
        isDeletedOnAccount2: false,
        SenderAccountID: id,
        ReceiveAccountID: to,
        id: timeStamp,
    })

    for ([key, value] of Object.entries(storeConnections)) {
        if (value.idUser === to) {
            console.log("mengirim ke", key)
            io.to(value.id).emit("ReloadMessage", data.length !== 0 ? data[0].idCategory : IdCategoryChat)
        }
        console.log(value, to)
    }
  
    const response = h.response({
        status: "Success",
        message: "Pesan Berhasil Terkirim",
    })
    response.code(200)
    return response

}


const DeleteChat = async (request, h) => {
    const { id } = request.auth.credentials;
    const { idChat } = request.params;

    console.log(idChat)

    const data = await select_data_user('ChatData', idChat, 'idChat');
    if (data.length === 1) {
        console.log(data)
        for ([key, value] of Object.entries(data[0])) {
            if (value === id) {
                if (key === 'SenderAccountID') {
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


//===========================SETTING HANDLING=======================/

const TokenSetting = []; //menampung Nilai Token setting
const CheckPass = async (request, h) => {
    const { id } = request.auth.credentials;
    const { pass } = request.payload;
    console.log(id)

    const account = await select_data_user('Account', id, 'id')
    console.log(pass)
    const result = await bcrypt.compare(pass, account[0].kata_sandi);
    if (result) {
        const token = nanoid(20)

        const MyToken = {
            user: id,
            token: token
        }
        TokenSetting.push(MyToken)//menambahkan ke Array TokenSetting

        const response = h.response({
            Status: 'Success',
            PassCorrect: true,
            TokenSetting: token
        })
        response.code(200)
        console.log("token berhasil di dapatkan")
        return response
    }
    console.log("token gagal didapatkan")

    const response = h.response({
        Status: 'Failed',
        Message: 'Kata Sandi Salah',
        PassCorrect: false,
    })
    response.code(401)
    return response
}


const ChangeName = async (request, h) => {
    const { id } = request.auth.credentials;
    const { token, data } = request.payload;

    const checkedIndex = TokenSetting.findIndex((item) => item.token === token && item.user === id)
    if (checkedIndex !== -1) {
        await UpdateData('Account', 'id', id, [{ nama: data }]);
        const response = h.response({
            Status: "Success",
            Message: "Nama Berhasil Dirubah"
        })
        response.code(200)
        TokenSetting.splice(checkedIndex, 1)
        return response
    }
}

const setPass = async (newPassword, newPassword2, id) => {
    if (newPassword === newPassword2) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, async (err, hash) => {
                if (err) {
                    return false
                }
                await UpdateData('Account', 'id', id, [{ kata_sandi: hash }]);
            })

        })
        return true
    }
    return false
}

const ChangePass = async (request, h) => {
    const { id } = request.auth.credentials;
    const { oldPassword, newPassword, newPassword2 } = request.payload;

    const account = await select_data_user('Account', id, 'id')
    const result = await bcrypt.compare(oldPassword, account[0].kata_sandi);
    if (result) {
        const ChangeMyPass = await setPass(newPassword, newPassword2, id)
        if (ChangeMyPass) {
            const response = h.response({
                Status: 'Success',
                Message: 'Success To Change Pass'
            })
            response.code(200)
            return response
        }
    }
    const response = h.response({
        Status: 'Error',
        Message: 'Failed To Change Pass'
    })
    response.code(401)
    return response
}

const ChangePassForNewUser = async (request, h) => {
    const { id } = request.auth.credentials;
    const { newPassword, newPassword2 } = request.payload;
    console.log(newPassword, newPassword2)
    const ChangeMyPass = await setPass(newPassword, newPassword2, id)

    if (ChangeMyPass) {
        const response = h.response({
            Status: 'Success',
            Message: 'Success To Change Pass'
        })
        response.code(200)
        return response
    }
    const response = h.response({
        Status: 'Error',
        Message: 'Failed To Change Pass'
    })
    response.code(401)
    return response
}

const AddBio = async (request, h) => {
    const { id } = request.auth.credentials
    const { token, data } = request.payload;

    const checkedIndex = TokenSetting.findIndex((item) => item.token === token && item.user === id)
    if (checkedIndex !== -1) {
        await UpdateData('Account', 'id', id, [{ Bio: data }]);
        const response = h.response({
            Status: "Success",
            Message: "Bio Berhasil Ditambah"
        })
        response.code(200)
        TokenSetting.splice(checkedIndex, 1)
        return response
    }
}

const ChangeUsername = async (request, h) => {
    const { id } = request.auth.credentials
    const { token, data } = request.payload;

    const checkedIndex = TokenSetting.findIndex((item) => item.token === token)
    if (checkedIndex !== -1) {
        const check = await select_data_user('Account', data, 'username')
        if (check.length > 0 || data.includes(" ")) {
            const response = h.response({
                Status: "Failed",
                Message: "Username Sudah Ada"
            })
            response.code(500);
            return response
        }

        await UpdateData('Account', 'id', id, [{ username: data }]);

        const response = h.response({
            Status: "Success",
            Message: "Username Berhasil Dirubah",
        })
        response.code(200)
        TokenSetting.splice(checkedIndex, 1)
        return response
    }

    const response = h.response({
        Status: "Failed",
        Message: "Username Tidak Dikenal"
    })
    response.code(500);
    return response
}


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const SECRET_CLIENT = process.env.SECRET_CLIENT
const AuthGoogle = (request, h) => {
    const redirectUri = "https://cruel-davita-sadeshop-79e55b22.koyeb.app/callback";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&scope=email profile`;

    return h.redirect(googleAuthUrl);
}

const CallBackAuth = async (request, h) => {
    const code = request.query.code;
    const redirect_uri = "https://cruel-davita-sadeshop-79e55b22.koyeb.app/callback"

    let payload = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: SECRET_CLIENT,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri,
    }).toString()


    const endpoint = await fetch("https://oauth2.googleapis.com/token", {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload
    })
    if (!endpoint) {
        throw new Error("Failed")
    }
    //Mengambil data dalam bentuk json
    const result = await endpoint.json();

    const id_token = result.id_token;
    const decoded = jwt.decode(id_token)

    const idAccount = nanoid(10)
    const username = `${decoded.given_name}${nanoid(10)}`

    //proses Validasi, apakah user yang menggunakan authentication sudah ada dalam table account
    //jika tidak ada maka akan di daftarkan dengan default pass
    const checkedAccount = await select_data_user('Account', decoded.email, 'email')
    let new_user = false;

    if (checkedAccount.length === 0) {
        const AccountData = {
            id: idAccount,
            username: username,
            email: decoded.email,
            nama: decoded.name,
            kata_sandi: `${decoded.given_name}${nanoid(10)}`,
            image: 'user.png',
            state: null,
            city: null,
            road: null,
            postalCode: null,
            Bio: null
        }
        new_user = true
        await Insert_Supabase('Account', AccountData)

        //Send To Email=======================================

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'sadewowidyanto@gmail.com',
                pass: process.env.PASS_EMAIL
            },
            debug: true, // Aktifkan log debug
            logger: true,
        })

        const mailMessages = {
            from: "sadewowidyanto@gmail.com",
            to: decoded.email,
            subject: "Selamat Datang 😁",
            html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h1 style="color: black;">Daftar Akun Berhasil</h1>
            <p>Terima kasih telah mendaftar account di project prtofolio saya 😁😁. Jangan Lupa memberikan Kata Sandi dengan aman dan jangan lupa untuk memverifikasi akun Anda</p>
    
            <p>Jika Anda tidak melakukan pendaftaran, abaikan email ini.</p>
            <p>Salam, <br> Tim Support</p>
          </div>
        `,
        };

        await transporter.sendMail(mailMessages);


        //=====================================================

    }

    //mendefenisikan Token untuk masuk.
    const acces_token = jwt.sign(
        { 'id': checkedAccount.length !== 0 ? checkedAccount[0].id : idAccount }, SECRET_ACCESS_TOKEN, { 'expiresIn': 10 * 60 }
    )

    const refresh_token = jwt.sign(
        { 'username': checkedAccount.length !== 0 ? checkedAccount[0].username : username }, SECRET_REFRESH_TOKEN, { 'expiresIn': 7 * 24 * 60 * 60 }
    )

    const checked = await select_data_user('RefreshToken', checkedAccount.length !== 0 ? checkedAccount[0].id : idAccount, 'idAccount')
    console.log(checked)
    if (checked.length === 1) {
        await deleteData('RefreshToken', 'idAccount', checkedAccount.length !== 0 ? checkedAccount[0].id : idAccount)
    }

    await Insert_Supabase('RefreshToken', {
        idAccount: checkedAccount.length !== 0 ? checkedAccount[0].id : idAccount,
        refreshToken: refresh_token
    })


    const response = h.response({
        status: "Success",
        message: "Login Berhasil",
        acces_token: acces_token,
        refresh_token: refresh_token,
        username: checkedAccount.length !== 0 ? checkedAccount[0].username : username
    })

    response.code(200)

    const redirectToFrontend = "https://sade-shop-fe.vercel.app/login"
    return h.redirect(`${redirectToFrontend}?acces_token=${acces_token}&refresh_token=${refresh_token}&username=${checkedAccount.length !== 0 ? checkedAccount[0].username : username}&new_user=${new_user}`);
}

module.exports = {
    Get_Acces, SettingStatus, Chatting, GetRoomChat, CheckToRead, DeleteChat, CheckPass,
    ChangeName, ChangePass, AddBio, ChangeUsername, AuthGoogle, CallBackAuth, ChangePassForNewUser
}



