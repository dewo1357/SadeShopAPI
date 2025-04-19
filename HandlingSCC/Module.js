/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const { InsertData, SelectBasedOnUser, uploadImagestoSupabase, DeleteData, EditData } = require("../supabaseControl/handlingSupabase");

const { supabase } = require("../supabaseControl/supabase")
const { nanoid } = require("nanoid")
require('dotenv').config({ path: './.env' })
const nodemailer = require("nodemailer")

const GetModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { data, error } = await supabase
        .from('Module')
        .select('*,AuthorFirstName:Account!idAccount(FirstName),AuthorLastName:Account!idAccount(LastName)')
    if (error) {
        console.log("Failed To Get Data in ")
        console.log(error)
        const response = h.response({
            'Status': "Failed",
            'Message': "Data Not Found"
        })
        response.code(404)
        return response
    }
    if (data.length !== 0) {
        const response = h.response({
            'Status': "Success",
            'Module': data
        })
        response.code(200)
        return response
    }
    const response = h.response({
        'Status': "Failed",
        'Message': "Module Not Found"
    })
    response.code(404)
    return response

}

const AddImageModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { files } = request.payload;
    
    await uploadImagestoSupabase(files, 'modulepicture')
    const response = h.response({
        'Status': "Success",
    })
    response.code(200)
    return response
}

const AddModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { Title, SubTitle, Description, ContentHtml, PictureName } = request.payload;

    const Account = await SelectBasedOnUser('Account', 'username', username);
    if (Account.length !== 0) {
        const idAccount = Account[0].id
        await InsertData('Module', { Title, SubTitle, Description, ContentHtml, idAccount, PictureName })
        const response = h.response({
            'Status': "Success",
        })
        console.log("berhasil")
        response.code(200)
        return response
    }
    const response = h.response({
        'Status': "Failed",
        'Message': "Account Not Found"
    })
    response.code(404)
    return response
}

const GetModuleByAccount = async (request, h) => {
    const { username } = request.auth.credentials;
    const { user } = request.params;
    const account = await SelectBasedOnUser('Account', 'username', user)
    console.log(account)
    if (account.length !== 0) {

        const { data, error } = await supabase
            .from('Module')
            .select('*,AuthorFirstName:Account!idAccount(FirstName),AuthorLastName:Account!idAccount(LastName)')
            .eq('idAccount', account[0].id)
            .order('created_at', { ascending: true })
        if (error) {
            console.log("Failed To Get Data in ")
            console.log(error)
            const response = h.response({
                'Status': "Failed",
                'Message': "Account Not Found"
            })
            response.code(404)
            return response
        }

        const response = h.response({
            Status: "Success",
            Module: data
        })

        response.code(200)
        return response
    }
    const response = h.response({
        'Status': "Failed",
        'Message': "Account Not Found"
    })
    response.code(404)
    return response
}

const SettingModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params
    const { Title, SubTitle, Description, ContentHtml, PictureName } = request.payload;
    const data = [
        { Title }, { SubTitle }, { Description }, { ContentHtml }, { PictureName }
    ]
    const dataModule = await SelectBasedOnUser('Module','id',idModule)
    console.log(dataModule)
    console.log(PictureName)
    if(dataModule[0].PictureName !== PictureName){
        console.log("process delete")
        await supabase.storage.from('modulepicture').remove([`${process.env.URL_KEY}/storage/v1/object/public/modulepicture//`, dataModule[0].PictureName])
    }
    console.log(data)
    await EditData('Module', 'id', idModule, data)
    const response = h.response({
        Status: "Success",
        Module: data
    })
    response.code(200)
    return response
}

const SettingSubModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params
    const { SubTitle, Description, ContentHtml, PictureName,LinkEmbed } = request.payload;
    const data = [
        { SubTitle }, { Description }, { ContentHtml }, { PictureName },{LinkEmbed}
    ]
    const dataModule = await SelectBasedOnUser('SubModule','id',idModule)
    if(dataModule[0].PictureName !== PictureName){
        await supabase.storage.from('modulepicture').remove([`${process.env.URL_KEY}/storage/v1/object/public/modulepicture//`, dataModule[0].PictureName])
    }
    console.log(data)
    await EditData('SubModule', 'id', idModule, data)
    const response = h.response({
        Status: "Success",
        Module: data
    })
    response.code(200)
    return response
}

const DeleteModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params
    console.log(idModule)
    await DeleteData("SubModule", "idModule", idModule)
    await DeleteData('Module', 'id', idModule)
    return true
}

const DeleteSubModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params
    console.log(idModule)
    await DeleteData("SubModule", "id", idModule)
    return true
}

const DeletePlaylistModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params
    console.log(idModule)
    await DeleteData("PlaylistModule", "id", idModule)
    return true
}

const AddSubModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule, SubTitle, Description, ContentHtml, PictureName,LinkEmbed } = request.payload;
    console.log(LinkEmbed)

    const Account = await SelectBasedOnUser('Account', 'username', username);
    if (Account.length !== 0) {
        const idAccount = Account[0].id
        await InsertData('SubModule', { idModule, SubTitle, Description, ContentHtml, idAccount, PictureName,LinkEmbed })
        const response = h.response({
            'Status': "Success",
        })
        console.log("berhasil")
        response.code(200)
        return response
    }
    const response = h.response({
        'Status': "Failed",
        'Message': "Data Not Found"
    })
    response.code(404)
    return response
}


const GetSubModulById = async (request, h) => {
    const { user } = request.auth.credentials
    const { idModule } = request.params;

    const { data, error } = await supabase
        .from('SubModule')
        .select('*,Module:Module!idModule(Title)')
        .eq('idModule', idModule)
        .order('created_at', { ascending: true })
    if (error) {
        console.log("Failed To Get Data in ")
        console.log(error)
        const response = h.response({
            'Status': "Failed",
            'Message': "Data Not Found"
        })
        response.code(404)
        return response
    }
    if (data.length !== 0) {
        const response = h.response({
            Status: "Success",
            data: data
        })
        response.code(200)
        return response
    }
    const response = h.response({
        Status: "Failed",
    })
    response.code(404)
    return response
}

const AddToPlaylistModule = async (request, h) => {
    const { username } = request.auth.credentials
    const { idModule, idSubModule } = request.payload;

    const Account = await SelectBasedOnUser('Account', 'username', username)
    console.log(Account)
    if (Account.length !== 0) {
        await InsertData("PlaylistModule", {
            idModule: idModule,
            idSubModule: idSubModule,
            idAccount: Account[0].id
        })
        const response = h.response({
            Status: "Success",
        })
        response.code(200)
        return response
    }
    const response = h.response({
        Status: "Failed",
    })
    response.code(404)
    return response
}

const GetMyplaylistModule = async (request, h) => {
    const { username } = request.auth.credentials;
    const { user } = request.params;
    const account = await SelectBasedOnUser('Account', 'username', user)
    console.log(account)
    if (account.length !== 0) {



        const { data, error } = await supabase
            .from('PlaylistModule')
            .select('*,TitleSub:SubModule!idSubModule(SubTitle),Title:Module!idModule(Title),\
                Pict:SubModule!idSubModule(PictureName),Content:SubModule!idSubModule(ContentHtml),\
                ModuleDescription:SubModule!idSubModule(Description),Link:SubModule!idSubModule(LinkEmbed)')
            .eq('idAccount', account[0].id)
            .order('created_at', { ascending: true })
        if (error) {
            console.log("Failed To Get Data in ")
            console.log(error)
            const response = h.response({
                'Status': "Failed",
                'Message': "Account Not Found"
            })
            response.code(404)
            return response
        }

        const result = [];
        console.log(data)
        data.map((item) => {
            result.push(
                {
                    id: item.id,
                    idSub: item.idSubModule,
                    idModule: item.idModule,
                    SubTitle: item.TitleSub.SubTitle,
                    Title: item.Title.Title,
                    PictureName: item.Pict.PictureName,
                    ContentHtml: item.Content.ContentHtml,
                    LinkEmbed : item.Link.LinkEmbed,
                    Description: item.ModuleDescription.Description,

                }
            )
        })

        const response = h.response({
            Status: "Success",
            Module: result
        })

        response.code(200)
        return response
    }
    const response = h.response({
        'Status': "Failed",
        'Message': "Account Not Found"
    })
    response.code(404)
    return response
}

const Exercise = async (request, h) => {
    const { username } = request.auth.credentials;
    const { idModule } = request.params;
    console.log(idModule)

    const Account = await SelectBasedOnUser('Account', 'username', username)
    if (Account.length !== 0) {
        const idAccount = Account[0].id
        const CheckedExercise = await SelectBasedOnUser('Exercise', 'idModule', idModule)
        if (CheckedExercise.length === 0) {
            await InsertData('Exercise', {
                idAccount, idModule
            })
        }
        return true;
    }
}

const SubmitExercise = async (request, h) => {
    const { username } = request.auth.credentials
    const { idModule, Exercise } = request.payload


    const DataExercise = await SelectBasedOnUser('Exercise', 'idModule', idModule)
    if (DataExercise.length === 1) {
        const getIdExerise = DataExercise[0].id
        console.log("Id Exercise : ", getIdExerise)
        const Alphabet = ['A', 'B', 'C', 'D']
        //reset start to delete all 
        await DeleteData('AnswerExercise', 'idExercise', getIdExerise)
        await DeleteData('Exercisequestion', 'IdExercise', getIdExerise)

        await Promise.all(Exercise.map(async (item) => {
            const id = nanoid(10)
            await InsertData('Exercisequestion', { 'idquest': id, 'question': item.Soal, 'IdExercise': getIdExerise,'ImagesSoal':item.ImagesSoal?item.ImagesSoal:null })
            Promise.all(
                item.Ans.map(async (item, Index) => {
                    await InsertData('AnswerExercise', { 'idquest': id, 'AnswerExercise': item[`AnswerExercise`], 'Score': item[`Score`], idExercise: getIdExerise, })
                })
            )
        }))

    }

    return true
}

const GetExerCise = async (request, h) => {
    const { username } = request.auth.credentials
    const { idModule } = request.params
    const DataExercise = await SelectBasedOnUser('Exercise', 'idModule', idModule)
    const result = [];
    if (DataExercise.length === 1) {
        const getIdExerise = DataExercise[0].id
        const { data, error } = await supabase
            .from('Exercisequestion')
            .select('*')
            .eq('IdExercise', getIdExerise)
            .order('created_at', { ascending: true })
        await Promise.all(
            data.map(async (item, index) => {
                const Ans = await SelectBasedOnUser('AnswerExercise', 'idquest', item.idquest)
                const ExerciseComponent = {
                    'Soal': item.question,
                    'ImagesSoal' : item.ImagesSoal,
                    'Ans': Ans
                }
                result.push(ExerciseComponent)
            })
        )
        const response = h.response({
            'Status': 'Success',
            'Exercise': result
        })
        console.log(result)
        response.code(200)
        return response
    }
    const response = h.response({
        'Status': 'Failed',
    })
    response.code(404)
    return response
}

const SubmitFinishExercise = async (request, h) => {
    const { username } = request.auth.credentials
    const { Total_Score, idModule } = request.payload

    const checkAccount = await SelectBasedOnUser('Account', 'username', username)
    if (checkAccount.length === 1) {
        const getIdAccount = checkAccount[0].id
        const NameStudent = checkAccount[0].FirstName + " " + checkAccount[0].LastName

        await InsertData('ScoreExercise', {
            Score: Total_Score,
            idModule: idModule,
            idAccount: getIdAccount
        })

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
            to: "sumateracomputer@gmail.com",
            subject: "Exercise Student Report  ",
            html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h1 style="color: black;">Exercise Student Report</h1>
                        <h2>Nama :  ${NameStudent} </h2>
                        <h2>Score : ${Total_Score}/100 </h2>

                        <p>Laporan Nilai dari Sadewo widyanto</p>
                        <p>Salam, <br> Tim Support</p>
                    </div>
                    `,
        };
        
        try {
            const verfikasi = await transporter.sendMail(mailMessages);
            console.log("email di verfikasi", verfikasi.response)
            const response = h.response({
                status: "Success",
                message: "Pengiriman Nilai Berhasil"
            })
            response.code(200)
            return response
        } catch (e) {
            console.log(e.message)
            const response = h.response({
                status: "Failed",
            })
            response.code(400)
            return response
        }
    }


    const response = h.response({
        'Status': "Failed",
    })
    response.code(404)
    return response

}


module.exports = {
    AddModule, AddImageModule, GetModule, GetModuleByAccount,
    DeleteModule, SettingModule, AddSubModule, GetSubModulById,
    SettingSubModule, DeleteSubModule, AddToPlaylistModule, GetMyplaylistModule,
    DeletePlaylistModule, Exercise, SubmitExercise, GetExerCise, SubmitFinishExercise
}