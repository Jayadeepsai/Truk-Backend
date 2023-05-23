//first import the express
const express = require("express");
//define the router
const router = express.Router();
//next mongoose is required
const mongoose = require("mongoose");
//express validator
const { body } = require('express-validator'); //use express validator for few required things

const nodemailer = require('nodemailer')

const pointsWithdraw = require('../models/pointswithdraw');
const quoteGenerate = require('../models/generateQuotemodal');
const vehicle = require("../models/vehicle");
const userSignup = require("../models/userSignup");
const adminData = require("../models/adminModel");

//Admin signup

router.post('/signupAdmin', (req, res, next) => {
    console.log("User ")
    const adminSignup = new adminData({
        _id: new mongoose.Types.ObjectId,

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,

    });


    var mobileNo = req.body.mobileNo;
    //first check if user is alredy existed 
    adminData.findOne({ mobileNo: mobileNo }).select().exec().then(doc => {
        console.log(doc)
        if (doc == null) { //if no user found then create new user
            adminSignup.save().then(result => {
                // sendnotificationforplacebid(req.body.firstName + req.body.lastName,"You Registered As",req.body.role,req.body.uniqueDeviceId)
                res.status(200).json({
                    message: "Admin signed up susccessfully",
                    status: "success",
                    Id: result._id,
                    selectType: result.role
                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: "failed"
                });
            })

        } else {
            res.status(500).json({
                message: "user aleredy exists",
                status: "failed"

            })
        }


    });


});

//Admin Login


router.post('/loginAdmin', async (req, res) => {
    adminData.find({ email: req.body.email, password: req.body.password }).select().exec().then(
        doc => {

            if (doc.length) {
                console.log(doc)
                res.status(200).json({
                    data: doc
                })
            } else {
                res.status(200).json({
                    message: "No Matching data found",
                    status: "failed",

                })

            }
        }
    ).catch(err => {
        res.status.json({

            error: err
        })
    })
});

//get all users for admin dashboard

router.get('/allUsers', async (req, res) => {
    try {
        const users = await userSignup.find({})

        res.status(200).json({
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

//get all type of loads for admin dashboard

router.get('/allPostedLoads', async (req, res) => {
    try {
        const loads = await quoteGenerate.find({})

        res.status(200).json({
            TotalUsers: loads.length,
            loads
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

//Users filter for admin

router.get('/usersFilter/:gstVerify', async (req, res) => {
    try {
        const users = await userSignup.find({ gstVerify: req.params.gstVerify })
        if (!users) {
            res.status(404).send({ error: "Users not found" })
        }
        res.status(200).json({
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
});

//Get loads by status for admin

router.get('/loadsByStatusForAdmin/:isActive', async (req, res) => {
    try {
        const load = await quoteGenerate.find({ isActive: req.params.isActive })
        if (!load) {
            res.status(404).send({ error: "Loads not found" })
        }
        res.status(200).json({
            TotalLoads: load.length,
            load
        })
    } catch (error) {
        res.status(401).json({ error })
        console.log(error)
    }
});


//all vehiclesfor admin  panel

router.get('/allVehiclesForAdmin', async (req, res) => {
    try {
        const vehicles = await vehicle.find({})

        res.status(200).json({
            TotalVehicles: vehicles.length,
            vehicles
        })
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
});

// Search function


// router.get('searchUsers/:key', async (req, res) => {
//     console.log("saan")
//         const result = await userSignup.find({
//             '$or': [
//                 { mobileNo: { $regex: "^" + req.params.key } },
//                 { companyName: { $regex: "^" + req.params.key } },
//                 { role: { $regex: "^" + req.params.key } },
//                 { firstName: { $regex: "^" + req.params.key } },
//                 { lastName: { $regex: "^" + req.params.key } },
//                 { city: { $regex: "^" + req.params.key } },

//             ]
//         })

//         try {
//             res.status(201).json({
//                 item: result
//             })
//         } catch (err) {
//             res.status(401).json(err)
//             console.log(err)
//         }
//     })


router.get('/searchByLetterForUsers/:key', async (req, res) => {
    const data = await userSignup.find(
        {
            "$or": [
                // { mobileNo: { $regex:  req.params.key  } },
                { companyName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { role: { $regex: new RegExp("^" + req.params.key, "i") } },
                { firstName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { lastName: { $regex: new RegExp("^" + req.params.key, "i") } },
                { city: { $regex: new RegExp("^" + req.params.key, "i") } },
            ]
        }
    )
    res.status(200).json({
        data
    })
})


router.get('/searchByLetterForVehicles/:key', async (req, res) => {
    const data = await vehicle.find(
        {
            "$or": [

                { trukvehiclenumber: { $regex: new RegExp("^" + req.params.key, "i") } },
                { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { trukname: { $regex: new RegExp("^" + req.params.key, "i") } },
                { trukOwnerNumber: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
    res.status(200).json({
        data
    })
});



router.get('/searchByLetterForActiveLoads/:key', async (req, res) => {
    const loads = await quoteGenerate.find(
        {
            "$or": [

                { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { DestinationLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                { LoadId: { $regex: new RegExp("^" + req.params.key, "i") } },
                { Number: { $regex: new RegExp("^" + req.params.key, "i") } },
                { expectedPrice: { $regex: new RegExp("^" + req.params.key, "i") } },

            ]
        }
    )
        try{    const data = loads.filter(data => {
                return data.isActive == "Active"
            })
            if (data.length) {

                res.status(200).json({
                    data,
                    message: "got the matching loads",
                    status: "success"
                })
            } else {
                res.status(200).json({
                    data,
                    message: "no matching loads found",
                    status: "success"
                })

            } }catch (error) {
                res.status(401).json({ error })
                console.log(error)
            }
        }
    )
//     res.status(200).json({
//         data
//     })
// });


    router.get('/searchByLetterForCompletedLoads/:key', async (req, res) => {
        const loads = await quoteGenerate.find(
            {
                "$or": [
    
                    { OriginLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                    { DestinationLocation: { $regex: new RegExp("^" + req.params.key, "i") } },
                    { LoadId: { $regex: new RegExp("^" + req.params.key, "i") } },
                    { Number: { $regex: new RegExp("^" + req.params.key, "i") } },
                    { expectedPrice: { $regex: new RegExp("^" + req.params.key, "i") } },
    
                ]
            }
        )
            try{    const data = loads.filter(data => {
                    return data.isActive == "Completed"
                })
                if (data.length) {
    
                    res.status(200).json({
                        data,
                        message: "got the matching loads",
                        status: "success"
                    })
                } else {
                    res.status(200).json({
                        data,
                        message: "no matching loads found",
                        status: "success"
                    })
    
                } }catch (error) {
                    res.status(401).json({ error })
                    console.log(error)
                }
            }
        )






module.exports = router;