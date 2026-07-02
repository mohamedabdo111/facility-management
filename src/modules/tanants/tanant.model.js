import mongoose from 'mongoose';

const schema = mongoose.Schema;
const model = mongoose.model;

const TanantSchema = new schema({
    name: {
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true,
        unique: true
    },
   
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    isActive:Boolean,
    
}, { timestamps: true });

const TanantModel = model('Tanant', TanantSchema);

export default TanantModel;