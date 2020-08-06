import multer from 'multer';
import path from 'path';
import crypto from 'crypto';


const upload = multer({

    storage: multer.diskStorage({

        destination: path.resolve(__dirname, '..', '..', 'uploads', 'points'),

        filename: (request, file, callback) => {
            
            const hash = crypto.randomBytes(6).toString('hex');
            const fileName = `${hash}-${file.originalname}`;
    
            callback(null, fileName);
        }
    }) 
});

export default upload;