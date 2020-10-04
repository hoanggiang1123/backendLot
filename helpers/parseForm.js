const formidable = require('formidable')
const fs = require('fs')
const { promisify  } = require('util')
const { randomString } = require('../helpers')
const { checkUserEditFields, checkFiles } = require('../helpers/checkUserEditFields')

const rename = promisify(fs.rename)

exports.parseForm = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        let error = checkUserEditFields(fields, files)
        if (error !== '') {
            return res.status(400).json({
                error
            })
        }
        let filename = ''
        if (Object.keys(files).length) {
            const fileError = checkFiles(files, 1)
            if (fileError !== '') {
                return res.status(400).json({
                    error: fileError
                })
            }
            const folder = fields.folder
            const oldpath = files.avatar.path
            filename = '/uploads/' + folder + '/' + randomString(10) + '-' + files.avatar.name
            const newpath = rootPath + '/public' + filename
            try {
                await rename(oldpath, newpath)
            } catch (error) {
                return res.status(400).json({
                    error: 'Image could not upload'
                })
            }
        }

        fields.filename = filename
        req.body = fields

        next()
        
    })
}