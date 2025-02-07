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
        host: 'localhost',
        port: 5000,
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
            origin: "http://localhost:5173",
            methods: ['GET', 'POST']
        }
    });

    const permissonId = {}

    io.on("connection", (socket) => {
        console.log("terhubung", socket.id)
       
        socket.on('Register', (username) => {
            storeConnections[username] = {
                'user': username,
                'id': socket.id,
                'status': "main"
            };
            console.log('Toko terdaftar:', username);
            console.log(storeConnections)
        })
       
        socket.on("RegistRoomChat", (username) => {
            storeConnections[username+nanoid(10)] = {
                'user': username,
                'id': socket.id,
                'status': "main"
            };
            console.log(storeConnections)
        })


        socket.on('Reset', (username) => {
            if (storeConnections[username] === socket.id) {
                console.log(storeConnections[username], "Keluar")
                delete storeConnections[username]
            }
        })

        socket.on('SendId', (id) => {
            permissonId[id + nanoid(5)] = {
                'user': id,
                'id': socket.id,
                'status': false,
            }
            for ([key, value] of Object.entries(storeConnections)) {
                console.log(key)
                if (value.user === id && value.status == "main") {
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
                    receive.data = { ...receive.data, idSocket: values.id }
                    io.to(values.id).emit('Receive', receive.data)
                    storeConnections[key] = {
                        user: receive.data['username'],
                        id: values.id,
                        status: 'main'
                    }
                    console.log("data", storeConnections[key], "ia Adalah", key, "Berhasil Di Rubah")
                }
            }
        })


        socket.on('disconnect', () => {
            for ([key, conn] of Object.entries(storeConnections)) {
                if (socket.id === conn.id) {
                    delete storeConnections[key]
                    console.log(socket.id, "terputus")
                    break
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

module.exports = { storeConnections }