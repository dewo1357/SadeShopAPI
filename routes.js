/* eslint-disable no-undef */

const {
  Get_Acces,
  SettingStatus,
  Chatting,
  GetRoomChat,
  CheckToRead,
  DeleteChat,
  CheckPass,
  ChangeName,
  ChangePass,
  AddBio,
  ChangeUsername,
  AuthGoogle,
  CallBackAuth,
  ChangePassForNewUser,
  DeleteCategoryChat
} = require('./Handling/handling')

const {
  AddAccount,
  GetDataAccount,
  GetAccountByUsername,
  CheckedToken,
  CheckAccount,
  GetMyAccount,
  UploadImage,
  deletePicture,
  ChangeImageProfile,
  VerifyAccount
} = require('./Handling/AccountHandling')

const {
  GetData,
  GetProdukBySeller,
  AddProduct,
  EditProduct,
  DeleteProduct
} = require('./Handling/ProductHandling')

const {
  GetCart,
  addToCart,
  hapusKeranjang,
  GetCartBasedOnSeller,
  EditPcsCart,
  AddToPayCart,
  getOngkir,
  CheckOut,
  GetOverallCheckout,
  ShippingSetter,
  FinishCheckout,
  GetProcessOrder,
  ActionToDeleteCheckout,
  YourProductOrder,
  CancelCheckout
} = require('./Handling/CartAndCheckoutHandling')

//SCC
const {
  AddModule,
  AddImageModule,
  GetModule,
  GetModuleByAccount,
  DeleteModule,
  SettingModule,
  AddSubModule,
  GetSubModulById,
  SettingSubModule,
  DeleteSubModule,
  AddToPlaylistModule,
  GetMyplaylistModule,
  DeletePlaylistModule,
  Exercise,
  SubmitExercise,
  GetExerCise,
  SubmitFinishExercise
} = require('./HandlingSCC/Module')

const {
  AccountRegist,
  SignInAccount,
  CheckAuthor
} = require('./HandlingSCC/Account')
const {
  ValidatePassword,
  ChangePassword,
  SettingProfile
} = require('./HandlingSCC/Setting')

// routes/addDataRoutes.js
const {
  getExperiences,
  getProjects,
  getBlogs,
  getExperienceById,
  getProjectById,
  getBlogById,
  addExperience,
  addProject,
  addBlog,
  editExperience,
  deleteExperience,
  editProject,
  deleteProject,
  editBlog,
  deleteBlog,
  getPrimaryProjects,
  Login,
  checkToken,
  GetProfileData,
  EditProfileData,
  UploadImageProfile
} = require('./Handling-Porto/manage')

const routes = [
  {
    method: 'POST',
    path: '/ChangePassForNewUser',
    options: { auth: 'jwt-access' },
    handler: ChangePassForNewUser
  },
  {
    method: 'DELETE',
    path: '/CancelCheckout/{IdTransaction}',
    options: { auth: 'jwt-access' },
    handler: CancelCheckout
  },
  {
    method: 'GET',
    path: '/callback',
    options: { auth: false },
    handler: CallBackAuth
  },
  {
    method: 'GET',
    path: '/AuthenticationGoogle',
    options: { auth: false },
    handler: AuthGoogle
  },
  {
    method: 'GET',
    path: '/',
    options: { auth: false },
    handler: () => {
      return {
        Message: 'API IS RUNNING'
      }
    }
  },
  {
    method: 'POST',
    path: '/ChangeUsername',
    options: { auth: 'jwt-access' },
    handler: ChangeUsername
  },
  {
    method: 'POST',
    path: '/ChangePass',
    options: { auth: 'jwt-access' },
    handler: ChangePass
  },
  {
    method: 'POST',
    path: '/AddBio',
    options: { auth: 'jwt-access' },
    handler: AddBio
  },
  {
    method: 'POST',
    path: '/ChangeName',
    options: { auth: 'jwt-access' },
    handler: ChangeName
  },
  {
    method: 'POST',
    path: '/CheckPass',
    options: { auth: 'jwt-access' },
    handler: CheckPass
  },
  {
    method: 'DELETE',
    path: '/deleteCategoryChat/{idCategoryChat}',
    options: { auth: 'jwt-access' },
    handler: DeleteCategoryChat
  },
  {
    method: 'DELETE',
    path: '/DeleteChat/{idChat}',
    options: { auth: 'jwt-access' },
    handler: DeleteChat
  },
  {
    method: 'PUT',
    path: '/CheckToRead/{IdCategoryChat}',
    options: { auth: 'jwt-access' },
    handler: CheckToRead
  },
  {
    method: 'GET',
    path: '/GetRoomChat',
    options: { auth: 'jwt-access' },
    handler: GetRoomChat
  },
  {
    method: 'POST',
    path: '/Chatting',
    options: { auth: 'jwt-access' },
    handler: Chatting
  },
  {
    method: 'POST',
    path: '/Get_Acces',
    options: { auth: false },
    handler: Get_Acces
  },
  {
    method: 'POST',
    path: '/SettingStatus',
    options: { auth: 'jwt-access' },
    handler: SettingStatus
  },
  {
    method: 'DELETE',
    path: '/ActionToDeleteCheckout',
    options: { auth: 'jwt-access' },
    handler: ActionToDeleteCheckout
  },
  {
    method: 'GET',
    path: '/CheckAccount',
    options: { auth: 'jwt-access' },
    handler: CheckAccount
  },
  {
    method: 'GET',
    path: '/GetMyAccount',
    options: { auth: 'jwt-access' },
    handler: GetMyAccount
  },
  {
    method: 'POST',
    path: '/CheckedToken',
    options: { auth: false },
    handler: CheckedToken
  },
  {
    method: 'POST',
    path: '/VerifyAccount',
    options: { auth: 'jwt-access' },
    handler: VerifyAccount
  },
  {
    method: 'GET',
    path: '/YourProductOrder/{category}',
    options: { auth: 'jwt-access' },
    handler: YourProductOrder
  },
  {
    method: 'GET',
    path: '/GetProcessOrder/{category}',
    options: { auth: 'jwt-access' },
    handler: GetProcessOrder
  },
  {
    method: 'GET',
    path: '/FinishCheckout',
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
    method: 'GET',
    path: '/MasterData',
    options: { auth: false },
    handler: GetData
  },
  {
    method: 'GET',
    path: '/GetProductSeller',
    options: { auth: 'jwt-access' },
    handler: GetProdukBySeller
  },
  {
    method: 'POST',
    path: '/UploadImage',
    options: {
      auth: 'jwt-access',
      payload: {
        maxBytes: 10 * 1024 * 1024,
        output: 'stream', // File diterima dalam bentuk stream
        parse: true, // Parsing otomatis untuk multipart/form-data
        allow: 'multipart/form-data', // Izinkan format multipart
        multipart: true
      }
    },
    handler: UploadImage
  },
  {
    method: 'DELETE',
    path: '/deletePicture/{filename}',
    options: { auth: 'jwt-access' },
    handler: deletePicture
  },
  {
    method: 'POST',
    path: '/AddProduct',
    options: { auth: 'jwt-access' },
    handler: AddProduct
  },
  {
    method: 'PUT',
    path: '/EditProduct/{idProduct}',
    options: { auth: 'jwt-access' },
    handler: EditProduct
  },
  {
    method: 'DELETE',
    path: '/DELETEProduct/{idProduct}',
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
    }
  },
  {
    method: 'GET',
    path: '/GetDataAccountByUsername/{username}',
    options: { auth: 'jwt-access' },
    handler: GetAccountByUsername
  },

  {
    method: 'POST',
    path: '/ChangeImageProfile',
    options: {
      auth: 'jwt-access',
      payload: {
        maxBytes: 10 * 1024 * 1024,
        output: 'stream', // File diterima dalam bentuk stream
        parse: true, // Parsing otomatis untuk multipart/form-data
        allow: 'multipart/form-data', // Izinkan format multipart
        multipart: true
      }
    },
    handler: ChangeImageProfile
  },
  {
    method: 'POST',
    path: '/GetDataAccount',
    options: { auth: false },
    handler: GetDataAccount
  },
  {
    method: 'POST',
    path: '/AddAccount',
    options: { auth: false },
    handler: AddAccount
  },
  //CART DATA====================================================================
  {
    method: 'GET',
    path: '/GetCart',
    options: { auth: 'jwt-access' },
    handler: GetCart
  },
  {
    method: 'POST',
    path: '/addToCart',
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
    path: '/GetCartBasedOnSeller',
    options: { auth: 'jwt-access' },
    handler: GetCartBasedOnSeller
  },
  {
    method: 'PUT',
    path: '/EditPcsCart',
    options: { auth: 'jwt-access' },
    handler: EditPcsCart
  },
  {
    method: 'POST',
    path: '/AddToPayCart',
    options: { auth: 'jwt-access' },
    handler: AddToPayCart
  },
  {
    method: 'POST',
    path: '/AccountRegist',
    options: { auth: false },
    handler: AccountRegist
  },
  {
    method: 'POST',
    path: '/SignInAccount',
    options: { auth: false },
    handler: SignInAccount
  },
  {
    method: 'GET',
    path: '/GetModule',
    options: { auth: 'jwt-access' },
    handler: GetModule
  },
  {
    method: 'POST',
    path: '/AddModule',
    options: { auth: 'jwt-access' },
    handler: AddModule
  },
  {
    method: 'POST',
    path: '/UploadImageSCC',
    options: {
      auth: 'jwt-access',
      payload: {
        maxBytes: 10 * 1024 * 1024,
        output: 'stream', // File diterima dalam bentuk stream
        parse: true, // Parsing otomatis untuk multipart/form-data
        allow: 'multipart/form-data', // Izinkan format multipart
        multipart: true
      }
    },
    handler: AddImageModule
  },
  {
    method: 'DELETE',
    path: '/DeleteModule/{idModule}',
    options: { auth: 'jwt-access' },
    handler: DeleteModule
  },
  {
    method: 'DELETE',
    path: '/DeleteSubModule/{idModule}',
    options: { auth: 'jwt-access' },
    handler: DeleteSubModule
  },
  {
    method: 'GET',
    path: '/GetModuleByAccount/{user}',
    options: { auth: 'jwt-access' },
    handler: GetModuleByAccount
  },
  {
    method: 'PUT',
    path: '/SettingSubModule/{idModule}',
    options: { auth: 'jwt-access' },
    handler: SettingSubModule
  },
  {
    method: 'PUT',
    path: '/SettingModule/{idModule}',
    options: { auth: 'jwt-access' },
    handler: SettingModule
  },
  {
    method: 'POST',
    path: '/AddSubModule',
    options: { auth: 'jwt-access' },
    handler: AddSubModule
  },
  {
    method: 'GET',
    path: '/GetSubModulById/{idModule}',
    options: { auth: 'jwt-access' },
    handler: GetSubModulById
  },
  //GetMyplaylistModule
  {
    method: 'GET',
    path: '/GetMyplaylistModule/{user}',
    options: { auth: 'jwt-access' },
    handler: GetMyplaylistModule
  },
  {
    method: 'POST',
    path: '/AddToPlaylistModule',
    options: { auth: 'jwt-access' },
    handler: AddToPlaylistModule
  },
  {
    method: 'DELETE',
    path: '/DeletePlaylistModule/{idModule}',
    options: { auth: 'jwt-access' },
    handler: DeletePlaylistModule
  },
  {
    method: 'GET',
    path: '/Exercise/{idModule}',
    options: { auth: 'jwt-access' },
    handler: Exercise
  },
  {
    method: 'POST',
    path: '/SubmitExercise',
    options: { auth: 'jwt-access' },
    handler: SubmitExercise
  },
  {
    method: 'GET',
    path: '/GetExerCise/{idModule}',
    options: { auth: 'jwt-access' },
    handler: GetExerCise
  },
  {
    method: 'POST',
    path: '/SubmitFinishExercise',
    options: { auth: 'jwt-access' },
    handler: SubmitFinishExercise
  },
  {
    method: 'GET',
    path: '/CheckAuthor',
    options: { auth: 'jwt-access' },
    handler: CheckAuthor
  },
  {
    method: 'POST',
    path: '/SettingProfile',
    options: { auth: 'jwt-access' },
    handler: SettingProfile
  },
  {
    method: 'POST',
    path: '/ChangePassword',
    options: { auth: 'jwt-access' },
    handler: ChangePassword
  },
  {
    method: 'POST',
    path: '/ValidatePassword',
    options: { auth: 'jwt-access' },
    handler: ValidatePassword
  },

  //////////////////////////PORTOFOLIO ROUTE////////////////////////
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h
        .response({
          status: 'Success'
        })
        .code(201)
    }
  },
  {
    method: 'GET',
    path: '/api/experiences',
    options: {
      auth: false
    },
    handler: getExperiences
  },
  {
    method: 'GET',
    path: '/api/experiences/{id}',
    options: {
      auth: false
    },
    handler: getExperienceById
  },
  {
    method: 'GET',
    path: '/api/projects',
    options: {
      auth: false
    },
    handler: getProjects
  },
  {
    method: 'GET',
    path: '/api/Primaryprojects',
    options: {
      auth: false
    },
    handler: getPrimaryProjects
  },
  {
    method: 'GET',
    path: '/api/projects/{id}',
    options: {
      auth: false
    },
    handler: getProjectById
  },
  {
    method: 'GET',
    path: '/api/blogs',
    options: {
      auth: false
    },
    handler: getBlogs
  },
  {
    method: 'GET',
    path: '/api/blogs/{id}',
    options: {
      auth: false
    },
    handler: getBlogById
  },
  {
    method: 'POST',
    path: '/Login',
    options: {
      auth: false
    },
    handler: Login
  }, //
  {
    method: 'POST',
    path: '/checkToken',
    options: {
      auth: false
    },
    handler: checkToken
  },
  {
    method: 'POST',
    path: '/api/experience',
    options: {
      auth: 'jwt-access'
    },
    handler: addExperience
  },
  {
    method: 'POST',
    path: '/api/project',
    options: {
      auth: 'jwt-access'
    },
    handler: addProject
  },
  {
    method: 'POST',
    path: '/api/blog',
    options: {
      auth: 'jwt-access'
    },
    handler: addBlog
  },
  {
    method: 'PUT',
    path: '/experience/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: editExperience
  },
  {
    method: 'PUT',
    path: '/project/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: editProject
  },
  {
    method: 'PUT',
    path: '/blog/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: editBlog
  },
  {
    method: 'DELETE',
    path: '/project/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: deleteProject
  },
  {
    method: 'DELETE',
    path: '/experience/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: deleteExperience
  },
  {
    method: 'DELETE',
    path: '/blog/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: deleteBlog
  },
  {
    method: 'GET',
    path: '/GetProfileData',
    options: {
      auth: false
    },
    handler: GetProfileData
  },
  {
    method: 'PUT',
    path: '/EditProfileData/{id}',
    options: {
      auth: 'jwt-access'
    },
    handler: EditProfileData
  },
  {
    method: 'POST',
    path: '/upload-profile',
    options: {
      payload: {
        maxBytes: 5 * 1024 * 1024, // 5MB
        output: 'file',
        parse: true,
        multipart: true
      },
      auth : false
    },
    handler: UploadImageProfile
  }
]
module.exports = routes
