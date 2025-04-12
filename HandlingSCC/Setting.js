/* eslint-disable no-undef */
const {
  SelectBasedOnUser,
  EditData
} = require('../supabaseControl/handlingSupabase')
const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SettingProfile = async (request, h) => {
  const { username } = request.auth.credentials
  const { First, Last, Username } = request.payload

  const checkAccount = await SelectBasedOnUser('Account', 'username', username)
  if (checkAccount.length !== 0) {
    await EditData('Account', 'username', username, [
      { FirstName: First },
      { LastName: Last },
      { username: Username }
    ])
    const SECRET_ACCESS_TOKEN = 'access_secret_key'
    const SECRET_REFRESH_TOKEN = 'refresh_secret_key'

    const access_token = jwt.sign(
      {
        username: Username
      },
      SECRET_ACCESS_TOKEN,
      { expiresIn: 7 * 24 * 60 * 60 }
    )

    const refresh_token = jwt.sign(
      {
        username: Username
      },
      SECRET_REFRESH_TOKEN,
      { expiresIn: 14 * 24 * 60 * 60 }
    )
    const response = h.response({
      Status: 'Success',
      username: Username,
      name: First + ' ' + Last,
      refresh_token: refresh_token,
      access_token: access_token
    })
    response.code(200)
    return response
  }
  const response = h.response({
    Status: 'Failed'
  })
  response.code(424)
  return response
}

const ChangePassword = async (request, h) => {
  const { username } = request.auth.credentials
  const { currentPassword,  newPassword, confirmPassword} = request.payload
  console.log(currentPassword,  newPassword, confirmPassword)
  const checkAccount = await SelectBasedOnUser('Account', 'username', username)
  const checkMatch = await Bcrypt.compare(currentPassword, checkAccount[0].pass)
  console.log(checkMatch)
  if (checkAccount.length !== 0 && newPassword === confirmPassword && checkMatch){
    Bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        const response = h.response({
          status: 'Failed'
        })
        response.code(401)
        return response
      }

      //Start To Hashing and store to Database
      Bcrypt.hash(confirmPassword, salt, async (err, hash) => {
        if (err) {
          const response = h.response({
            status: 'Failed'
          })
          response.code(401)
          return response
        }
        const GetMyHashPass = hash
        console.log(GetMyHashPass)
        
        //Store To Database
        await EditData('Account', 'username', username, [{ pass: GetMyHashPass }])
        console.log("Berhasil Merubah Data")
      })
    })
    const response = h.response({
      status: 'Success Change Profile'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'Failed'
  })
  response.code(424)
  return response
}

const ValidatePassword = async (request, h) => {
  const { username } = request.auth.credentials
  const { password } = request.payload

  const checkAccount = await SelectBasedOnUser('Account', 'username', username)
  const checkMatch = Bcrypt.compare(password, checkAccount[0].pass)
  if (checkAccount.length !== 0 && checkMatch) {
    const response = h.response({
      Status: 'Success'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'Failed'
  })
  response.code(424)
  return response
}

module.exports = { ValidatePassword, ChangePassword, SettingProfile }
