import {connect} from 'mongoose' //Dependencia que nos permite hacer transacciones hacia Mongo

const dbConnect=async()=>{
    try{
        await connect(process.env.MONGO_CNN)
        console.log('Connected to database')
    }catch(error){
        console.log(error)
    }
}
export default dbConnect