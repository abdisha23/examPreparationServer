const {default: mongoose} = require('mongoose')

const dbConnection = () => {
    try{
        const conn = mongoose.connect(process.env.mongoDb_URL)
        console.log('Connection Successful')
    }
    catch(err){
        console.log('Connection Error: ' + err)
    }  
}
module.exports = dbConnection