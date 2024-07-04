const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
}

const ensureSecretKey = () => {
    const envFilePath = path.resolve(__dirname,'../', '.env');
    if(fs.existsSync(envFilePath)){
        const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
        if(!envFileContent.includes('JWT_SECRET')){
            const secretKey = generateSecretKey();
            fs.appendFileSync(envFilePath, `JWT_SECRET=${secretKey}\n`);
            console.log('JWT_SECRET has been generated and added to .env file');
        } else {
            console.log('JWT_SECRET is already present in .env file');
        }
    } else {
        const secretKey = generateSecretKey();
        fs.writeFileSync(envFilePath, `JWT_SECRET=${secretKey}\n`);
        console.log('.env file created and JWT_SECRET has been added');
    }
}

module.exports = ensureSecretKey;

