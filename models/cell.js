import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';



const uri ="mongodb+srv://fstoro:Medellin2024@cluster0.g76fv5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connection = mongoose.createConnection(uri);

const AutoIncrement = AutoIncrementFactory(connection);

const ParkingSchema= new mongoose.Schema({
    cell_number:{
        type:Number,
        unique:true,
        required:[false,"the cell number is requiered"]
    },
    status:{
        type:String,
        default:"available",
        required:[true,'the status is required']
    },
    vehicle_plate:{
        type:String,
        maxlenght:[6,"maximum six characters"],
        default:null
    },
    entry_date:{
        type:Date,
        default:null},

    exit_date :{
        type:Date,
        default: null
        
    },
    pin:{
        type:String,
        default:null
    }
   
})

ParkingSchema.plugin(AutoIncrement, {inc_field : 'cell_number'});
export default connection.model('Cells', ParkingSchema, 'Cell')

