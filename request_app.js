const axios = require('axios');
const fs = require('fs');
const winston = require('winston');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var LogEnable=false;
var max_retry=3;
var retry_getinfo=1;
var retry_postinfo=1;
var logger;
readline.question('Are You want Enable Debugging Y/N: ', async confirm =>  {
    if(confirm==='Y') {
        LogEnable=true;
    }
    logger = winston.createLogger({
        level: 'info',
        silent:!LogEnable,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        defaultMeta: { service: 'user-service' },
        transports: [
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'info.log' }),
     ]});
    readline.close();
    let proceed= await getinfo();
   
});
const username = 'arockia'
const password = 'arockia@123'
const AUTH_TOKEN = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.headers.common['Authorization'] =`Basic ${AUTH_TOKEN}`;
async function getinfo() {
    
    logger.log('info', 'Started to getting api data');
    try {
      const response = await axios.get('/posts');
      saveinfo(response);
	} catch (err) {
        logger.log('error', 'Unable to getting information api information'+err);
        if(retry_getinfo < max_retry){
            getinfo();
            retry_getinfo++;
        }
        console.error(err);
    }
};
async function saveinfo(response)  {
    logger.log('info', 'Started to Save Response');
    try {
        const dataWrite= await fs.writeFileSync("data/response.json",JSON.stringify(response.data),"utf-8");
        readinfo();
    } catch (err) {
        logger.log('error', 'Unable to save api information'+err);
        console.error(err);
    }
}
const readinfo=async () => {
    logger.log('info', 'Start to Read to Saved Response');
    try {
        const readdata =  await fs.readFileSync("data/response.json",{ encoding: 'utf8' });
        postinfo(readdata);
    } catch (err) {
        logger.log('error', 'Unable to read Saved Api Response'+err);
        console.error(err);
    }
}
const postinfo=async (readdata) => {
    logger.log('info', 'Start To Post Data to another server');
    try {
        const PostResponse = await axios.post('/posts',readdata);
    } catch (err) {
        logger.log('error', 'Unable to Post Data Another Server'+err);
        
        if(retry_postinfo < max_retry){
            postinfo(readdata);
            retry_postinfo++;
        }
        console.error(err);
    }
}

