require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

//App config
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//DB config
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
        })
        console.log('MongoDB connected')
    }

    catch(err){
        console.error(err.message)
        process.exit(1)
    }
}


//Creating Schema and model
const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean
})


const Reminder = new mongoose.model("reminder", reminderSchema)

//specifying API routes
app.get("/getAllReminder", (req, res) => {
    Reminder.find({}, (err, reminderList) => {
        if(err){
            console.log(err)
        }
        if(reminderList){
            res.send(reminderList)
        }
    })
})
app.post("/addReminder", (req, res) => {
    const { reminderMsg, remindAt } = req.body
    const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded: false
    })
    reminder.save(err => {
        if(err){
            console.log(err)
        }
        Reminder.find({}, (err, reminderList) => {
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    })

})
app.post("/deleteReminder", (req, res) => {
    Reminder.deleteOne({_id: req.body.id}, () => {
        Reminder.find({}, (err, reminderList) => {
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    })
})

connectDB();
app.listen(9000, () => console.log("Be started"))