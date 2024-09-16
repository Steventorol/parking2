import express, { json } from 'express'
import dbConnect from '../database/config.js'
import '../database/config.js'
import cellRouter from '../routes/cellRoute.js'
import parkRouter from '../routes/parkRoute.js'
import exitRouter from '../routes/exitRoute.js'






class Server{
    constructor(){
        this.app=express()
        this.listen()
        this.dbConnection()
        this.pathCell='/api/cell'
      
        this.route()
        
        
        
    }
    async dbConnection(){ //Llamar funcion dbConenction a la base de datos
    await dbConnect()
    }

    route(){
        this.app.use(json()) //Parsear datos
        this.app.use(this.pathCell, cellRouter)
        this.app.use('/park',parkRouter)
        this.app.use('/exit',exitRouter)
     
    }
    listen(){
        this.app.listen(process.env.PORT,()=>{
            console.log('Server running')
        })
    }
}

export default Server //Exports the class server
