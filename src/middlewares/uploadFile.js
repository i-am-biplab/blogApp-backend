const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        const originalFileName = file.originalname;
        fileName = originalFileName.split('.')[0];
        
        cb(null, `${Date.now()}_${fileName}.png`);
    }
});

const upload = multer({storage: storage});

module.exports = upload;