// handlers/addDataHandler.js

// Simpan Experience
const { dummyProjects, dummyExperiences } = require('./Data/dummyData')

const {
  InsertData,
  GetData,
  Delete,
  Update,
  GetDataBased
} = require('./supabase/methodSupabase')

const Jwt = require('@hapi/jwt')
const bcrypt = require('bcrypt')

const addExperience = async (request, h) => {
  const { title, company, date, tasks, start_date, end_date, isOngoing } =
    request.payload

  // contoh validasi sederhana
  if (!title || !company) {
    return h.response({ error: 'Title & Company wajib diisi' }).code(400)
  }

  const Insert = await InsertData('Experience', {
    title: title,
    company: company,
    date: date,
    tasks: tasks,
    start_date: start_date,
    end_date: end_date,
    isOngoing: isOngoing
  })

  if (!Insert) return h.response({ status: 'failed' }).code(400)

  // nanti bisa disimpan ke DB
  console.log('Experience diterima:', {
    title,
    company,
    date,
    tasks,
    start_date,
    end_date,
    isOngoing
  })

  return h
    .response({
      message: 'Experience berhasil disimpan',
      data: { title, company, date, tasks, start_date, end_date, isOngoing }
    })
    .code(201)
}

// Simpan Project
const addProject = async (request, h) => {
  const { name, stack, link, description, active } = request.payload

  if (!name || !stack) {
    return h.response({ error: 'Nama & Tech wajib diisi' }).code(400)
  }

  const Insert = await InsertData('Project', {
    name: name,
    stack: stack,
    link: link,
    description: description,
    active: active
  })

  if (!Insert) {
    return h
      .response({
        status: 'failed',
        message: 'Gagal Menambahkan Data'
      })
      .code(400)
  }

  console.log('Project diterima:', { name, stack, link, description })

  return h
    .response({
      message: 'Project berhasil disimpan',
      data: { name, stack, link }
    })
    .code(201)
}

// Simpan Blog
const addBlog = async (request, h) => {
  const { title, description } = request.payload

  if (!title || !description) {
    return h.response({ error: 'Judul & Deskripsi wajib diisi' }).code(400)
  }

  const Insert = await InsertData('Blog', {
    Title: title,
    Content: description
  })

  if (!Insert) {
    return h
      .response({
        message: 'Gagal Menambah Data'
      })
      .code(400)
  }

  console.log('Blog diterima:', { title, description })

  return h
    .response({
      message: 'Blog berhasil disimpan',
      data: { title, description }
    })
    .code(201)
}

// ====================== EXPERIENCE ======================
const editExperience = async (request, h) => {
  const { id } = request.params

  const { title, company, date, tasks, start_date, end_date, isOngoing } =
    request.payload

  // contoh validasi sederhana
  if (!title || !company) {
    return h.response({ error: 'Title & Company wajib diisi' }).code(400)
  }

  const Insert = await Update('Experience', id, {
    title: title,
    company: company,
    date: date,
    tasks: tasks,
    start_date: start_date,
    end_date: end_date,
    isOngoing: isOngoing
  })

  if (!Insert) return h.response({ status: 'failed' }).code(400)

  console.log(id)

  if (!title || !company) {
    return h.response({ error: 'Title & Company wajib diisi' }).code(400)
  }

  console.log('Edit Experience:', {
    title,
    company,
    date,
    tasks,
    start_date,
    end_date,
    isOngoing
  })

  return h
    .response({
      message: `Experience dengan ID ${id} berhasil diperbarui`,
      data: { title, company, date, tasks, start_date, end_date, isOngoing }
    })
    .code(200)
}

const deleteExperience = async (request, h) => {
  const { id } = request.params

  const deleteExp = await Delete('Experience', id)
  if (!deleteExp) return h.response({ status: 'failed' }).code(400)

  console.log('Delete Experience:', id)

  return h
    .response({
      message: `Experience dengan ID ${id} berhasil dihapus`
    })
    .code(200)
}

// ====================== PROJECT ======================
const editProject = async (request, h) => {
  const { id } = request.params

  const { name, stack, link, description, active } = request.payload
  console.log(active)
  if (!name || !stack) {
    return h.response({ error: 'Nama & Tech wajib diisi' }).code(400)
  }

  const UpdateData = await Update('Project', id, {
    name: name,
    stack: stack,
    link: link,
    description: description,
    active: active
  })

  if (!UpdateData) {
    return h
      .response({
        status: 'failed'
      })
      .code(400)
  }

  console.log('Edit Project:', { id, name, stack, link })

  return h
    .response({
      message: `Project dengan ID ${id} berhasil diperbarui`,
      data: { id, name, stack, link }
    })
    .code(200)
}

const deleteProject = async (request, h) => {
  const { id } = request.params

  const DeleteData = await Delete('Project', id)
  if (!DeleteData) {
    return h
      .response({
        status: 'failed'
      })
      .code(500)
  }

  console.log('Delete Project:', id)

  return h
    .response({
      message: `Project dengan ID ${id} berhasil dihapus`
    })
    .code(200)
}

// ====================== BLOG ======================
const editBlog = async (request, h) => {
  const { id } = request.params
  const { Title, Content } = request.payload

  if (!Title || !Content) {
    return h.response({ error: 'Judul & Deskripsi wajib diisi' }).code(400)
  }

  const UpdateData = await Update('Blog', id, {
    Title: Title,
    Content: Content
  })

  if (!UpdateData) {
    return h
      .response({
        status: 'failed'
      })
      .code(500)
  }

  console.log('Edit Blog:', { id, Title, Content })

  return h
    .response({
      message: `Blog dengan ID ${id} berhasil diperbarui`,
      data: { id, Title, Content }
    })
    .code(200)
}

const deleteBlog = async (request, h) => {
  const { id } = request.params

  const DeleteData = await Delete('Blog', id)
  if (!DeleteData) {
    return h
      .response({
        status: 'failed'
      })
      .code(500)
  }

  console.log('Delete Blog:', id)

  return h
    .response({
      message: `Blog dengan ID ${id} berhasil dihapus`
    })
    .code(200)
}

// handlers/getDataHandler.js

// GET All
const getExperiences = async (request, h) => {
  console.log('okokok')
  const Data = await GetData('Experience')
  if (!Data) {
    return h.response({ status: 'failed' }).code(400)
  }
  console.log('📌 Ambil semua Experiences')
  return h.response(Data).code(200)
}

const getProjects = async (request, h) => {
  const Data = await GetData('Project')
  if (!Data) {
    return h
      .response({
        status: 'Failed',
        message: 'Gagal Mendapatkan Data'
      })
      .code(404)
  }
  console.log('📌 Ambil semua Projects')
  return h.response(Data).code(200)
}

const getPrimaryProjects = async (request, h) => {
  const Data = await GetDataBased('Project', 'active', true)
  if (!Data) {
    return h
      .response({
        status: 'Failed',
        message: 'Gagal Mendapatkan Data',
        Data: []
      })
      .code(404)
  }
  console.log('📌 Ambil semua Projects')
  return h.response(Data).code(200)
}

const getBlogs = async (request, h) => {
  const DataBlogs = await GetData('Blog')
  console.log(DataBlogs)
  return h.response(DataBlogs).code(200)
}

// GET by ID
const getExperienceById = async (request, h) => {
  const { id } = request.params
  const exp = dummyExperiences.find(e => e.id === parseInt(id))
  console.log(`📌 Ambil Experience id=${id}`)
  return exp
    ? h.response(exp).code(200)
    : h.response({ message: 'Not found' }).code(404)
}

const getProjectById = async (request, h) => {
  const { id } = request.params
  const proj = dummyProjects.find(p => p.id === parseInt(id))
  console.log(`📌 Ambil Project id=${id}`)
  return proj
    ? h.response(proj).code(200)
    : h.response({ message: 'Not found' }).code(404)
}

const getBlogById = async (request, h) => {
  const { id } = request.params

  const blog = await GetDataBased('Blog', 'id', id)

  console.log(`📌 Ambil Blog id=${id}`)
  return blog
    ? h.response(blog).code(200)
    : h.response({ message: 'Not found' }).code(404)
}

const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, SECRET_ACCESS_TOKEN)
    console.log(decoded)
    return {
      isValid: true,
    }
  } catch (err) {
    return {
      isValid: false,
      error: err.message
    }
  }
}

const jwt = require('jsonwebtoken')
const SECRET_ACCESS_TOKEN = 'access_secret_key'
require('dotenv').config({ path: './.env' })
const Login = async (request, h) => {
  const { username, password } = request.payload
  const getPass = process.env.PASS

  const check = await bcrypt.compare(password, getPass)
  if (!check) {
    return h
      .response({
        status: 'failed',
        message: 'Invalid Username Or Pass'
      })
      .code(400)
  }

  const access_token = jwt.sign(
    {
      username: username
    },
    SECRET_ACCESS_TOKEN,
    { expiresIn: 14 * 24 * 60 * 60 }
  )

  return h.response({ token: access_token }).code(201)
}

const checkToken = (request, h) => {
  const { token } = request.payload

  const verify = verifyToken(token)

  console.log('hasil', verify)
  return verify.isValid
    ? h.response({ token: token }).code(201)
    : h.response({}).code(404)
}

const GetProfileData = async (request, h) => {
  const Profile = await GetData('Profile')
  return h.response({ Profile }).code(201)
}

const EditProfileData = async (request, h) => {
  const { id } = request.params
  const { name, profesi, description } = request.payload
  console.log(id)

  const Edit = await Update('Profile', id, {
    name: name,
    profesi: profesi,
    description: description
  })

  return Edit ? h.response({ Edit }).code(201) : h.response({}).code(400)
}

const Fs = require('fs')
const Path = require('path')
const { supabase } = require('./supabase/conf')
const UploadImageProfile = async (request, h) => {
  const file = request.payload.image // field "image"
  const oldFile = request.payload.oldFile // nama file lama (misalnya disimpan di DB/frontend)

  if (!file) {
    return h.response({ message: 'No file uploaded' }).code(400)
  }

  console.log(file)

  const filename = Date.now() + '-' + file.filename
  const fileBuffer = Fs.readFileSync(file.path)

  // Upload ke bucket "profileFoto"
  const { error: uploadError } = await supabase.storage
    .from('profileFoto')
    .upload(filename, fileBuffer, {
      contentType: file.headers['content-type'],
      upsert: true
    })

  if (uploadError) {
    console.error(uploadError)
    return h
      .response({ message: 'Upload failed', error: uploadError.message })
      .code(500)
  }

  // Hapus file lama jika ada
  console.log(oldFile)
  if (oldFile) {
    const { error: deleteError } = await supabase.storage
      .from('profileFoto')
      .remove([oldFile])

    if (deleteError) {
      console.error('Failed to delete old file:', deleteError)
    }
  }

  // Ambil URL public
  const { data: publicUrlData } = supabase.storage
    .from('profileFoto')
    .getPublicUrl(filename)

  await Update('Profile', 1, {
    image: publicUrlData.publicUrl,
    FileName: filename
  })
  return {
    status: 'success',
    filename,
    url: publicUrlData.publicUrl
  }
}

module.exports = {
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
}
