const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { blogHome, blogCreate, blogDetails, blogUpdate, blogDelete, blogListDown } = require("../controllers/userCont");
const upload = require("../middlewares/uploadFile");

const router = express.Router();

router.post("/", blogHome);

router.post("/create", verifyToken, upload.single("img"), blogCreate);

router.post("/details/:blogid", blogDetails);

router.post("/update/:blogid", verifyToken, upload.single("img"), blogUpdate);

router.post("/delete/:blogid", verifyToken, blogDelete);

router.post("/u_all-blog", verifyToken, blogListDown);

module.exports = router;