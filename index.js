/* eslint-disable no-undef */
const Hapi = require("@hapi/hapi");
const data = require("./routes.js")
const jwt = require("@hapi/jwt");
const { Server } = require('socket.io');
const { nanoid } = require("nanoid");


const storeConnections = {}
const storeConnectionsMassage = {};

const SECRET_ACCESS_TOKEN = 'access_secret_key';


const init = async () => {
    const server = Hapi.server({
        host: '0.0.0.0',
        port: process.env.PORT || 5000,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });


    await server.register(jwt)

    //OTOMATIS AKAN DI VALIDASI KETIKA MEMBUTUHKAN PROTECTED
    server.auth.strategy('jwt-access', 'jwt', {
        keys: SECRET_ACCESS_TOKEN,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: 15 * 60
        },
        validate: (artifacts) => {
            return { isValid: true, credentials: artifacts.decoded.payload }
        }
    });

    const io = new Server(server.listener, {
        cors: {
            origin: "http://localhost:5173", //"https://sade-shop-fe.vercel.app",   //"http://localhost:5173"
            methods: ['GET', 'POST']
        }
    });

    const permissonId = {}

    io.on("connection", (socket) => {
        console.log("terhubung", socket.id)
        socket.on('Register', (account) => {
            if(storeConnections[account.username]){
                storeConnections[account.username+nanoid(5)] = {
                    'user': account.username,
                    'idUser' : account.id,
                    'id': socket.id,
                    'status': "main"
                };
                console.log("pendaftar pertama")
            }else{
                storeConnections[account.username] = {
                    'user': account.username,
                    'idUser' : account.id,
                    'id': socket.id,
                    'status': "main"
                };
                console.log("pendaftar kedua")
            }
            
            console.log('Toko terdaftar:', account.username);
            console.log(storeConnections)
            
        })
               
        socket.on("RegistRoomChat", (account) => {
            storeConnections[account.username+nanoid(10)] = {
                'user': account.username,
                'idUser' : account.id,
                'id': socket.id,
                'status': "main"
            };
            console.log(storeConnections)
        })
        
        socket.on('Reset', (username) => {
            console.log(username)
            console.log(socket.id)
            for ([key, values] of Object.entries(storeConnections)) {
                if(values.id === socket.id){
                    delete storeConnections[key]
                    console.log(values.user,"terhapus")
                }
            }
            console.log(storeConnections)
        })

        socket.on('SendId', (id) => {
            permissonId[id + nanoid(5)] = {
                'user': id,
                'id': socket.id,
                'status': false,
            }
            for ([key, value] of Object.entries(storeConnections)) {
                console.log(key)
                if (value.user === id && value.status === "main") {
                    io.to(value.id).emit('AskAcces', "Seseorang Meminta Akses")
                    console.log(key, "menerima permintaan")
                }
            }
        })

        socket.on('TolakAkses', (username) => {
            for ([key, values] of Object.entries(permissonId)) {
                if (key.includes(username) && !values.status) {
                    io.to(values.id).emit('ActTolakAkses', "Akses Ditolak")
                }
            }
        })

        //ketika device lain meminta akses dan user mengizinkan, maka akan dikirimkan informasi account
        //meliputi token refresh & acces juga untuk bisa melakukan pengambilan data
        socket.on('Send', (receive) => {
            const username = receive.data['username']
            for ([key, values] of Object.entries(permissonId)) {
                console.log(key)
                if (key.includes(username) && !values.status) {
                    receive.data = { ...receive.data, idSocket: key,isRegist:true }
                    io.to(values.id).emit('Receive', receive.data)
                    console.log("data", storeConnections[key], "ia Adalah", key, "Berhasil Di Rubah")
                }
            }
        })

        /*
        socket.on('disconnecting', () => {
            for ([key, conn] of Object.entries(storeConnections)) {
                if (socket.id === conn.id) {
                    delete storeConnections[key]
                    console.log(socket.id, "terputus")
                }
            }
        })
        */


        socket.on('disconnect', () => {
            for ([key, conn] of Object.entries(storeConnections)) {
                if (socket.id === conn.id) {
                    delete storeConnections[key]
                    console.log(socket.id, "terputus")
                }
            }
        })
    })


    server.app.io = io;
    server.app.storeConnections = storeConnections
    server.app.storeConnectionsMassage = storeConnectionsMassage
    server.auth.default('jwt-access')
    server.route(data)


    await server.start();
    console.log((`Server berjalan pada ${server.info.uri}`));

}

init();

module.exports = {init};



