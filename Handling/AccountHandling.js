/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { supabase } = require('../supabase');
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../env" })
const { select_data_user, uploadImagestoSupabase,
    UpdateData, Insert_Supabase, CheckMessage, deleteData } = require('./Function')

const SECRET_ACCESS_TOKEN = 'access_secret_key';
const SECRET_REFRESH_TOKEN = 'refresh_secret_key';
const AccountToken = [];
const AccountTokenExpire = [];//ketika dimasukan kedalam array ini dahulu, dengan time terbatas.

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
    const { id } = request.auth.credentials
    const { files } = request.payload

    const get_Account = await select_data_user('Account', id, 'id');
    if (get_Account !== -1) {
        if (get_Account[0].image !== 'user.png') {
            await supabase.storage.from('ProfilePicture').remove([`${process.env.SUPABASE_URL}/storage/v1/object/public/ProfilePicture/`, get_Account[0].image])
        }
        await uploadImagestoSupabase(files, 'ProfilePicture')
        await UpdateData('Account', 'id', id, [{ image: files.hapi.filename }])

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
    const { id } = request.auth.credentials
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
    const { id } = request.auth.credentials
    const { filename } = request.params;
    await deletePictureBucket(filename, 'gambarProducts');
}


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


const AddAccount = async (request, h) => {
    const { username, email, nama, kata_sandi, kata_sandi2, image } = request.payload;
    const id = nanoid(15);
    let available = false

    let { data, error } = await supabase
        .from('Account')
        .select('*')
    data.map((item) => {
        if (item.username === username || username.includes(" ") || item.email === email) {
            available = true;
        }
    })

    if (available) {
        const response = h.response({
            status: "Failed",
            message: "No Message"
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
                        message: "Account Gagal Didaftarkan"
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
                    Bio: null
                }
                await Insert_Supabase('Account', AccountData)
            })
        })
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

const GetDataAccount = async (request, h) => {
    const storeConnections = request.server.app.storeConnections;
    const { username, kata_sandi } = request.payload;
    const data = await select_data_user('Account', username, 'username')
    console.log("Login Berhasil " + new Date().toISOString())
    let isFirstUser = false

    if (data.length === 1) {
        const result = await bcrypt.compare(kata_sandi, data[0].kata_sandi);
        if (result) {

            //checking apakah ada user sedang memakai account yang sama
            for ([token, values] of Object.entries(storeConnections)) {
                if (value.user === id && value.status === "main") {
                    io.to(value.id).emit('AskAcces', "Seseorang Meminta Akses")
                    if(!isFirstUser){
                        isFirstUser = true
                    }
                }
            }

            const acces_token = jwt.sign(
                {
                    'id': data[0].id
                }, SECRET_ACCESS_TOKEN, { 'expiresIn': 10 * 60 }
            )

            //sesi apabila lolos atau tidak ada user yang menggunakan user lain. 
            const refresh_token = jwt.sign(
                { username, kata_sandi }, SECRET_REFRESH_TOKEN, { 'expiresIn': 7 * 24 * 60 * 60 }
            )

            const checked = await select_data_user('RefreshToken', data[0].id, 'idAccount')
            console.log(checked)
            if (checked !== -1) {
                await deleteData('RefreshToken', 'idAccount', data[0].id)
            }

            await Insert_Supabase('RefreshToken', {
                idAccount: data[0].id,
                refreshToken: refresh_token,
            })

            const response = h.response({
                status: "Success",
                message: "Login Berhasil",
                acces_token: acces_token,
                refresh_token: refresh_token,
                username: username,
                id: data[0].id,
                isFirstUser: isFirstUser
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

const GetAccountByUsername = async (request, h) => {
    const { id } = request.auth.credentials;
    const { username } = request.params;
    console.log(username)

    let access = false;
    const Account = await select_data_user('Account', username, 'username')
    let { data, err } = await supabase
        .from("Productku")
        .select("*,Account:Account!SellerID(username)")
        .eq("SellerID", Account[0].id)
    console.log(id)
    const product = data

    if (id === Account[0].id) {
        access = true
    }

    if (Account && product) {
        const response = h.response({
            status: "Success",
            message: "Account Didapatkan",
            account: {
                nama: Account[0].nama,
                id: Account[0].id,
                image: Account[0].image,
                username: Account[0].username,
                province: Account[0].state,
                city: Account[0].city,
                road: Account[0].road,
                Bio: Account[0].Bio,
                postalCode: Account[0].postalCode
            },
            product: product,
            access: access,
        })
        console.log("Berhasil Mendapatkan data account")
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
    const { id } = request.auth.credentials;
    const isThereMessage = await CheckMessage(id);
    const dataToken = await select_data_user('AccountToken', id, 'idAccount');
    if (dataToken.length === 1) {
        const response = h.response({
            status: "verified",
            notifMessage: isThereMessage,
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
    await UpdateData('Account', 'id', id, [{ state: state }, { city: city }, { road: road }, { postalCode: postalCode }])
    const response = h.response({
        status: "not Verified",
        notifMessage: isThereMessage,
        verified: false
    })
    return response

}

///Mau Di Hapus
const GetMyAccount = async (request, h) => {
    const { id } = request.auth.credentials
    const checkedAccount = await select_data_user('Account', id, 'id')
    if (checkedAccount.length === 1) {
        const response = h.response({
            status: "Success",
            message: "Success To Get Account",
            dataAccount: checkedAccount[0]
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

module.exports = {
    AddAccount, GetDataAccount,
    GetAccountByUsername, CheckedToken, CheckAccount, GetMyAccount,
    UploadImage, deletePicture, ChangeImageProfile, VerifyAccount
}