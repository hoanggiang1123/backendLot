const multer = require('multer')
const randomstring = require('randomstring')
const path = require('path')
const upload = multer()

exports.uploadFile = (folder, fileMaxSize, field) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/uploads/${folder}`)
        },
        filename: (req, file, cb) => {
            cb(null, randomstring.generate(10) + path.extname(file.originalname))
        }
    })
    const upload = multer({
        storage,
        limits: {
            fileSize: fileMaxSize * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            const filetypes = new RegExp('jpeg|jpg|png|gif')
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
            const mimetype = filetypes.test(file.mimetype)
            if (mimetype && extname) {
                cb(null, true)
            } else {
                cb(new Error('File Not Allow'))
            }

        }
    }).single(field);

    return upload;

}