/* eslint-disable no-undef */
const { InsertData, SelectBasedOnUser,DeleteData } = require('../supabaseControl/handlingSupabase')
const Bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const AccountRegist = async (request, h) => {
    const { FirstName, LastName, username, email, pass1, pass2 } = request.payload;
    console.log(FirstName, LastName, username, email, pass1, pass2)

    const Check = await SelectBasedOnUser('Account', 'username', username);
    const check2 = await SelectBasedOnUser('Account','email',email)
    console.log(Check)
    if (Check.length !== 0 ||check2.length!==0|| pass1 !== pass2) {
        const response = h.response({
            status: "Failed"
        })
        response.code(401)
        return response;
    }
    //Prepare To hashing
    Bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            const response = h.response({
                status: "Failed"
            })
            response.code(401)
            return response;
        }

        //Start To Hashing and store to Database
        Bcrypt.hash(pass2, salt, async (err, hash) => {
            if (err) {
                const response = h.response({
                    status: "Failed"
                })
                response.code(401)
                return response;
            }
            const GetMyHashPass = hash
            const NewAccount = {
                FirstName: FirstName,
                LastName: LastName,
                username: username,
                email: email,
                pass: GetMyHashPass
            }
            //Store To Database
            await InsertData('Account',NewAccount);

        })
    })
    const response = h.response({
        status: "Success Regist Data"
    })
    response.code(200)
    return response;
}

const SECRET_ACCESS_TOKEN = 'access_secret_key';
const SECRET_REFRESH_TOKEN = 'refresh_secret_key';
const SignInAccount = async (request, h) => {
    const { username, pass } = request.payload;
    console.log(username,pass)

    const GetAccount = await SelectBasedOnUser('Account', 'username', username)
    console.log(GetAccount)
    if (GetAccount.length !== 0) {
        const CheckPass = Bcrypt.compare(pass, GetAccount[0].pass);
        if (CheckPass) {

            const access_token = jwt.sign({
                'username': GetAccount[0].username
            }, SECRET_ACCESS_TOKEN, { 'expiresIn': 7 * 24 * 60 * 60  })

            const refresh_token = jwt.sign({
                'username': GetAccount[0].username,
            }, SECRET_REFRESH_TOKEN, { 'expiresIn': 14 * 24 * 60 * 60 })

            const checkTokenRefresh = await SelectBasedOnUser('RefreshToken', 'idAccount', GetAccount[0].id);
            if(checkTokenRefresh.length!==0){
                await DeleteData('RefreshToken','idAccount',GetAccount[0].id)
            }
            const NewRefreshToken = {
               idAccount : GetAccount[0].id,
               RefreshToken : refresh_token
            }
            //Store To Database
            await InsertData('RefreshToken',NewRefreshToken);

            const response = h.response({
                status: "Success",
                message: "Success Login",
                username : username,
                access_token : access_token,
                refresh_token : refresh_token,
                name : GetAccount[0].FirstName + " " + GetAccount[0].LastName,
            })
            response.code(200)
            return response
        }
    }
    const response = h.response({
        status: "Failed",
        message: "Account Not Found"
    })
    response.code(404)
    return response
}

const CheckAuthor = async (request,h)=>{
    const {username} = request.auth.credentials

    check = await SelectBasedOnUser('Account','username',username)
    if(check.length!==0 && check[0].isAuthor){
        const response = h.response({
            'Status' : "Author",
            "Author" : true
        })
        response.code(200)
        return response
    }
    const response = h.response({
        'Status' : "Author",
        "Author" : false
    })
    response.code(200)
    return response
}

module.exports = { AccountRegist,SignInAccount,CheckAuthor }