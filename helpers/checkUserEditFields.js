const path = require('path')
exports.checkUserEditFields = (fields, files) => {
    const { name, about, phone } = fields

    if (name.trim() === '' && about.trim() === '' && phone.trim() === '' && !Object.keys(files).length) {
        return 'Edit info can not be empty'
    }

    // if (name.trim() !== '') {
    //     if (name.trim().length < 6) {
    //         return 'Name must be at least 6 characters'
    //     }
    // }
    // if (phone.trim() !== '') {
    //     const phoneCheck = /((09|03|07|08|05)+([0-9]{8})\b)/g
    //     if (!phoneCheck.test(phone)) {
    //         return 'Phone must be valid'
    //     }
    // }
    // if (about.trim() !== '') {
    //     if (about.trim().length < 20) {
    //         return 'About must be at least 20 characters'
    //     }
    // }
    return ''
}

exports.checkFiles = (files, maxSize) => {
    if (files.avatar.size > maxSize * 1024 * 1024) {
        return 'File is too large'
    }
    const filetypes = new RegExp('jpeg|jpg|png|gif')
    const extname = filetypes.test(path.extname(files.avatar.name).toLowerCase())
    const mimetype = filetypes.test(files.avatar.type)
    if (mimetype && extname) {
        return ''
    } else {
        return 'File type is not allow'
    }
}