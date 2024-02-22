const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/user");
const Blog = require("../models/blog");
const sequelize = require("../db/conn");
const { Op } = require("sequelize");

// controller for signup
const signupUser = async (req, res) => {
    try {
        const { name, uname, email, passwd, conpasswd } = req.body;

        if (name && uname && email && passwd && conpasswd) {
            if (passwd === conpasswd) {
                hashedPasswd = await bcrypt.hash(passwd, 12);

                const [user, created] = await User.findOrCreate({
                    where: { 
                        [Op.or]: {
                            user_name: uname,
                            email: email
                        }
                    },
                    defaults: {
                        user_name: uname,
                        name: name,
                        email: email,
                        passwd: hashedPasswd
                    }
                });
                if (created != true) {
                    res.status(409).json({message: "Email or Username already registered"});
                }
                else {
                    const uid = user.uid;
                    const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY);
                    console.log(token);

                    res.status(201).json({issignedup: true,
                                            message: "Signed Up Successfully",
                                            token: token
                    });
                }
            }
            else {
                res.status(401).json({message: "Password not matching"});
            }
        }
        else {
            res.status(400).json({ message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for login
const loginUser = async (req, res) => {
    try {
        const { email, passwd } = req.body;
        if (email && passwd) {
            const user = await User.findAll({
                where: { email: email },
                attributes: ["uid", "passwd"]
            });

            if (user.length > 0) {
                const uid = user[0].uid;
                const hashedPasswd = user[0].passwd;

                try {
                    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    
                    if (isMatch) {
                        const token = jwt.sign({ uid: uid }, process.env.SECRET_KEY);
                        console.log(token);

                        res.status(200).json({isloggedin: true, 
                                                message: "Logged In successfully",
                                                token: token});
                    }
                    else {
                        res.status(401).json({message: "Invalid Credentials"});
                    }
                } catch (bcryptError) {
                    res.status(500).json({message: "Internal Server Error"});
                    console.log("Error comparing passwords: ", bcryptError);
                }
            }
            else {
                res.status(404).json({message: "User not found"});
            }
        }
        else {
            res.status(400).json({ message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blog home
const blogHome = async (req, res) => {
    try {
        const data = await Blog.findAll({
            attributes: [[sequelize.literal('User.user_name'), 'uname'], "blogid", [sequelize.literal('User.name'), 'author'], "b_title", "b_desc", "img", "createdAt"],
            include: {
                model: User,
                attributes: []
            },
            order: ["sl_no"]
        });
    
        if (data.length > 0) {
            res.status(200).json({ isvalid: req.isvalid, message: req.message, blogs: data });
        }
        else {
            res.status(404).json({ isvalid: req.isvalid, message: req.message, blogs: "No blogs found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blog details
const blogDetails = async (req, res) => {
    try {
        const blogId = req.params.blogid;
        const data = await Blog.findOne({
            attributes: [[sequelize.literal('User.name'), 'author'], "b_title", "b_desc", "img", "createdAt"],
            include: {
                model: User,
                attributes: []
            },
            where: {blogid: blogId}
        });

        if (data !== null) {
            res.status(200).json({ blog: data });
        }
        else {
            res.status(404).json({ blog: "No blog found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blog create
const blogCreate = async (req, res) => {
    try {
        const { blogTitle, blogDesc } = req.body;
        const filepath = req.file ? req.file.path : null;
        
        if (blogTitle && blogDesc) {
            function generateBlogId(length) {
                return crypto.randomBytes(length).toString('hex');
            }

            const blogId = generateBlogId(8);

            if (filepath) {
                const data = await Blog.create({
                    blogid: blogId,
                    uid: req.uid,
                    b_title: blogTitle,
                    b_desc: blogDesc,
                    img: filepath
                });
    
                res.status(201).json({ iscreated: true, message: "Blog created successfully" });
            }
            else {
                const data = await Blog.create({
                    blogid: blogId,
                    uid: req.uid,
                    b_title: blogTitle,
                    b_desc: blogDesc
                });
    
                res.status(201).json({ iscreated: true, message: "Blog created successfully" });
            }
        }
        else {
            res.status(400).json({ iscreated: false, message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blog update
const blogUpdate = async (req, res) => {
    try {
        const uid = req.uid;
        const blogId = req.params.blogid;
        const { blogTitle, blogDesc } = req.body;
        const filepath = req.file ? req.file.path : null;

        if (filepath) {
            const user = await User.findOne({
                attributes: ['role'],
                where: {uid: uid}
            });
    
            console.log(user.role);

            if (user.role === "admin") {
                const affectedRow = await Blog.update({
                    b_title: blogTitle,
                    b_desc: blogDesc,
                    img: filepath
                },
                {
                    where: {
                        blogid: blogId
                    }
                });
        
                if (affectedRow[0] === 1) {
                    res.status(200).json({ isupdated: true, message: "Blog updated successfully" });
                }
                else {
                    res.status(500).json({ isupdated: false, message: "Blog updation failed" });
                }
            }
            else {
                const affectedRow = await Blog.update({
                    b_title: blogTitle,
                    b_desc: blogDesc,
                    img: filepath
                },
                {
                    where: {
                        uid: uid,
                        blogid: blogId
                    }
                });
        
                if (affectedRow[0] === 1) {
                    res.status(200).json({ isupdated: true, message: "Blog updated successfully" });
                }
                else {
                    res.status(500).json({ isupdated: false, message: "Blog updation failed" });
                }
            }
        }
        else {
            const user = await User.findOne({
                attributes: ['role'],
                where: {uid: uid}
            });
    
            console.log(user.role);

            if (user.role === "admin") {
                const affectedRow = await Blog.update({
                    b_title: blogTitle,
                    b_desc: blogDesc
                },
                {
                    where: {
                        blogid: blogId
                    }
                });
        
                if (affectedRow[0] === 1) {
                    res.status(200).json({ isupdated: true, message: "Blog updated successfully" });
                }
                else {
                    res.status(500).json({ isupdated: false, message: "Blog updation failed" });
                }
            }
            else {
                const affectedRow = await Blog.update({
                    b_title: blogTitle,
                    b_desc: blogDesc
                },
                {
                    where: {
                        uid: uid,
                        blogid: blogId
                    }
                });
        
                if (affectedRow[0] === 1) {
                    res.status(200).json({ isupdated: true, message: "Blog updated successfully" });
                }
                else {
                    res.status(500).json({ isupdated: false, message: "Blog updation failed" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for blog soft delete
const blogDelete = async (req, res) => {
    try {
        const uid = req.uid;
        const blogId = req.params.blogid;

        const user = await User.findOne({
            attributes: ['role'],
            where: {uid: uid}
        });

        console.log(user.role);

        if (user.role === "admin") {
            const deletedRow = await Blog.destroy({
                where: {
                    blogid: blogId
                }
            });
    
            if (deletedRow === 1) {
                res.status(200).json({ isdeleted: true, message: "Blog deleted successfully" });
            }
            else {
                res.status(500).json({ isdeleted: false, message: "Blog deletion failed" });
            }
        }
        else {
            const deletedRow = await Blog.destroy({
                where: {
                    uid: uid,
                    blogid: blogId
                }
            });
    
            if (deletedRow === 1) {
                res.status(200).json({ isupdated: true, message: "Blog deleted successfully" });
            }
            else {
                res.status(500).json({ isupdated: false, message: "Blog deletion failed" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

// controller for list down blogs of particular user
const blogListDown = async (req, res) => {
    try {
        const { uname } = req.body;

        if (uname) {
            const user = await User.findOne({
                where: { user_name: uname}
            });

            if (user !== null) {
                const userId = user.uid;
                const data = await Blog.findAll({
                    attributes: [[sequelize.literal('User.name'), 'author'], "b_title", "b_desc", "img", "createdAt"],
                    include: {
                        model: User,
                        attributes: []
                    },
                    where: {uid: userId},
                    order: ["sl_no"]
                });

                if (data.length > 0) {
                    res.status(200).json({ blogs: data });
                }
                else {
                    res.status(404).json({ blogs: "No blogs found" });
                }
            }
            else {
                res.json({msg: "Invalid Request"});
            }
        }
        else {
            res.status(400).json({ message: "All required fields are mandatory" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
}

module.exports = { signupUser, loginUser, blogHome, blogDetails, blogCreate, blogUpdate, blogDelete, blogListDown }