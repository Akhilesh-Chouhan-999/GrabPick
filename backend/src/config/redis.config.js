import IORedis from 'ioredis' ;
import { REDIS_HOST, REDIS_PORT } from './env.js';

const redis = new IORedis({
        host : REDIS_HOST ,
        port : REDIS_PORT ,
}) ; 


export default redis ;  