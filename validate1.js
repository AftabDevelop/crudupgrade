const validator = require('validator');

function validateuser(data) {
    
    const mandatory = ["name","age","email","password"];
    const isAllpresent = mandatory.every(feild => data.hasOwnProperty(feild));
    if(!isAllpresent){
        throw new Error("Feild is missing");
    }

    if(!validator.isEmail(data.email)){
        throw new Error("Email is not correct");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Password is not strong");
    }

    if(data.name.length<3 || data.name.length>30){
        throw new Error("Name is must be 3 character and less than 30 character");
    }

}
module.exports = validateuser;

//.every() ek array method hai jo check karta hai:
// "Kya array ka har element ek condition ko satisfy karta hai?"
// Yahan condition hai:
// data.hasOwnProperty(field)
// → Ye check karta hai: "data" object ke paas kya wo field hai?