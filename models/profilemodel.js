//get the reuired libraries
const mongoose= require("mongoose");

// const subObj={
//     streetName:{type: String, required:true},
//     houseNo:{type: String, required: true},
//     city:{type: String, required:true},
//     state:{type: String, required:true},
//     zipCode:{type: String, required:true},
//     landMark:{type: String}
// } 

//define the schema here
const ProfileSchema = mongoose.Schema({
    //define the object ID
   _id: mongoose.Schema.Types.ObjectId,
   //username: { type: String, required: true },//email
//    password: { type: String, required: true },
   addressType: { type: String  },
   //address:  subObj,
   doorNo:  {type:String },
   areaName:  {type:String },
   landMark:  {type:String },
   city:  {type:String },
   pincode:  {type:String},
//    email:{type:String, required: true}
   
});


//export this mongoose module
module.exports = mongoose.model('ProfileDetails', ProfileSchema);