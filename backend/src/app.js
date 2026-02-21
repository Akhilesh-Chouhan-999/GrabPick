import express from 'express' ;
import cors from 'cors' ; 
import helmet from 'helmet' ; 
import morgan from 'morgan' ; 
import compression from 'compression' ;
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.routes.js' ;
const app = express() ; 


app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ;
app.use(cors()) ;
app.use(helmet()) ; 
app.use(morgan('dev')) ; 
app.use(compression()) ;
configDotenv() ;


app.get('/ping', (req, res) => {
    
    res
    .status(200)
    .json('pong')
});
app.use('/api/v1/auth' , authRoutes ) ;


export default app ; 



