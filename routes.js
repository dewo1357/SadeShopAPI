/* eslint-disable no-undef */


const { Get_Acces, SettingStatus, Chatting, GetRoomChat, CheckToRead,
    DeleteChat, CheckPass, ChangeName, ChangePass, AddBio, ChangeUsername,
    AuthGoogle, CallBackAuth,ChangePassForNewUser } = require('./Handling/handling')

const {
    AddAccount, GetDataAccount,
    GetAccountByUsername, CheckedToken, CheckAccount, GetMyAccount,
    UploadImage, deletePicture, ChangeImageProfile, VerifyAccount
} = require('./Handling/AccountHandling')

const { GetData, GetProdukBySeller, AddProduct, EditProduct,
    DeleteProduct } = require('./Handling/ProductHandling')

const { GetCart, addToCart,hapusKeranjang, GetCartBasedOnSeller,
    EditPcsCart, AddToPayCart, getOngkir, CheckOut, GetOverallCheckout, ShippingSetter,
    FinishCheckout, GetProcessOrder, ActionToDeleteCheckout,
    YourProductOrder,CancelCheckout } = require('./Handling/CartAndCheckoutHandling')


const routes = [
    {
        method: "POST",
        path: "/ChangePassForNewUser",
        options: { auth: 'jwt-access' },
        handler: ChangePassForNewUser
    },
    {
        method: "DELETE",
        path: "/CancelCheckout/{IdTransaction}",
        options: {auth: 'jwt-access'},
        handler: CancelCheckout
    },
    {
        method: "GET",
        path: "/callback",
        options: { auth: false },
        handler: CallBackAuth
    },
    {
        method: "GET",
        path: "/AuthenticationGoogle",
        options: { auth: false },
        handler: AuthGoogle
    },
    {
        method: "GET",
        path: "/",
        options: { auth: false },
        handler: () => {
            return {
                'Message': 'API IS RUNNING'
            }
        }
    },
    {
        method: "POST",
        path: "/ChangeUsername",
        options: { auth: 'jwt-access' },
        handler: ChangeUsername
    },
    {
        method: "POST",
        path: "/ChangePass",
        options: { auth: 'jwt-access' },
        handler: ChangePass
    },
    {
        method: "POST",
        path: "/AddBio",
        options: { auth: 'jwt-access' },
        handler: AddBio
    },
    {
        method: "POST",
        path: "/ChangeName",
        options: { auth: 'jwt-access' },
        handler: ChangeName
    },
    {
        method: "POST",
        path: "/CheckPass",
        options: { auth: 'jwt-access' },
        handler: CheckPass
    },
    {
        method: "DELETE",
        path: "/DeleteChat/{idChat}",
        options: { auth: 'jwt-access' },
        handler: DeleteChat
    },
    {
        method: "PUT",
        path: "/CheckToRead/{IdCategoryChat}",
        options: { auth: 'jwt-access' },
        handler: CheckToRead
    },
    {
        method: "GET",
        path: "/GetRoomChat",
        options: { auth: 'jwt-access' },
        handler: GetRoomChat
    },
    {
        method: "POST",
        path: "/Chatting",
        options: { auth: 'jwt-access' },
        handler: Chatting
    },
    {
        method: "POST",
        path: "/Get_Acces",
        options: { auth: false },
        handler: Get_Acces
    },
    {
        method: "POST",
        path: "/SettingStatus",
        options: { auth: 'jwt-access' },
        handler: SettingStatus
    },
    {
        method: "DELETE",
        path: "/ActionToDeleteCheckout",
        options: { auth: 'jwt-access' },
        handler: ActionToDeleteCheckout
    },
    {
        method: "GET",
        path: "/CheckAccount",
        options: { auth: 'jwt-access' },
        handler: CheckAccount
    },
    {
        method: "GET",
        path: "/GetMyAccount",
        options: { auth: 'jwt-access' },
        handler: GetMyAccount
    },
    {
        method: "POST",
        path: "/CheckedToken",
        options: { auth: false },
        handler: CheckedToken
    },
    {
        method: "POST",
        path: "/VerifyAccount",
        options: { auth: 'jwt-access' },
        handler: VerifyAccount
    },
    {
        method: "GET",
        path: "/YourProductOrder/{category}",
        options: { auth: 'jwt-access' },
        handler: YourProductOrder
    },
    {
        method: "GET",
        path: "/GetProcessOrder/{category}",
        options: { auth: 'jwt-access' },
        handler: GetProcessOrder
    },
    {
        method: "GET",
        path: "/FinishCheckout",
        options: { auth: 'jwt-access' },
        handler: FinishCheckout
    },
    {
        method: 'PUT',
        path: '/ShippingSetter',
        options: { auth: false },
        handler: ShippingSetter
    },
    {
        method: 'GET',
        path: '/GetCheckOutData',
        options: { auth: 'jwt-access' },
        handler: GetOverallCheckout
    },
    {
        method: 'POST',
        path: '/CheckOut',
        options: { auth: 'jwt-access' },
        handler: CheckOut
    },

    {
        method: 'GET',
        path: '/getOngkir',
        handler: getOngkir
    },
    {
        method: "GET",
        path: "/MasterData",
        options: { auth: false },
        handler: GetData
    },
    {
        method: "GET",
        path: "/GetProductSeller",
        options: { auth: 'jwt-access' },
        handler: GetProdukBySeller
    },
    {
        method: "POST",
        path: "/UploadImage",
        options: {
            auth: "jwt-access"
            , payload: {
                maxBytes: 10 * 1024 * 1024,
                output: 'stream', // File diterima dalam bentuk stream
                parse: true, // Parsing otomatis untuk multipart/form-data
                allow: 'multipart/form-data', // Izinkan format multipart
                multipart: true
            },
        },
        handler: UploadImage
    },
    {
        method: "DELETE",
        path: "/deletePicture/{filename}",
        options: { auth: 'jwt-access' },
        handler: deletePicture
    },
    {
        method: "POST",
        path: "/AddProduct",
        options: { auth: 'jwt-access' },
        handler: AddProduct,
    },
    {
        method: "PUT",
        path: "/EditProduct/{idProduct}",
        options: { auth: 'jwt-access' },
        handler: EditProduct
    },
    {
        method: "DELETE",
        path: "/DELETEProduct/{idProduct}",
        options: { auth: 'jwt-access' },
        handler: DeleteProduct
    },

    //ACCOUNT====================================================================
    {
        method: 'GET',
        path: '/GetDataAccount',
        // eslint-disable-next-line no-unused-vars
        handler: (request, h) => {
            return account
        },
    }
    ,
    {
        method: 'GET',
        path: '/GetDataAccountByUsername/{username}',
        options: { auth: 'jwt-access' },
        handler: GetAccountByUsername,
    },

    {
        method: 'POST',
        path: '/ChangeImageProfile',
        options: {
            auth: "jwt-access"
            , payload: {
                maxBytes: 10 * 1024 * 1024,
                output: 'stream', // File diterima dalam bentuk stream
                parse: true, // Parsing otomatis untuk multipart/form-data
                allow: 'multipart/form-data', // Izinkan format multipart
                multipart: true
            },
        },
        handler: ChangeImageProfile,
    },
    {
        method: 'POST',
        path: "/GetDataAccount",
        options: { auth: false },
        handler: GetDataAccount
    },
    {
        method: "POST",
        path: "/AddAccount",
        options: { auth: false },
        handler: AddAccount,
    },
    //CART DATA====================================================================
    {
        method: 'GET',
        path: "/GetCart",
        options: { auth: 'jwt-access' },
        handler: GetCart
    },
    {
        method: 'POST',
        path: "/addToCart",
        options: { auth: 'jwt-access' },
        handler: addToCart
    },
    {
        method: 'DELETE',
        path: '/hapusKeranjang/{idProduct}',
        options: { auth: 'jwt-access' },
        handler: hapusKeranjang

    },
    {
        method: 'GET',
        path: "/GetCartBasedOnSeller",
        options: { auth: 'jwt-access' },
        handler: GetCartBasedOnSeller
    },
    {
        method: 'PUT',
        path: "/EditPcsCart",
        options: { auth: 'jwt-access' },
        handler: EditPcsCart
    },
    {
        method: 'POST',
        path: "/AddToPayCart",
        options: { auth: 'jwt-access' },
        handler: AddToPayCart
    }


]


module.exports = routes;