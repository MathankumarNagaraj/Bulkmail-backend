const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Mathan:123@cluster0.cbblu.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("connected to DataBase")
}).catch(function () { console.log("failed to connect with DB") })

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        }); new Promise(async function (resolve, reject) {


          try {
            for (i = 0; i < emailList.length; i++) {
                await transporter.sendMail(
                    { 
                        from: "mathankumarn1104@gmail.com",
                        to: emailList[i],
                        subject: "Checking bulkmail app",
                        text: msg
                    }
                )
                console.log("email sent to" + emailList[i])
            }

        resolve("Success")

      }
      catch (error) {

        reject("Failed")

      }

    }).then(function () {
      res.send(true)
    }).catch(function () {
      res.send(false)
    })



  }).catch(function (error) {
    console.log(error)
  })


})

app.listen(5000, function () {
  console.log("server started...")
})