const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const travelStorySchema = new Schema({
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocation: {
        type: [
            {
                location: { type: String, required: true },
                latitude: { type: Number, default: null },
                longitude: { type: Number, default: null },
            },
        ],
        default: [],
    },
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
   // createOne: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    visitedDate: { type: Date, required: true },
});

module.exports = mongoose.model("TravelStory", travelStorySchema);

/*
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelStorySchema = new Schema({
    title: {type : String,require:true},
    story: {type : String,require:true},
    visitedLocation: {type : [String],default:[]},
    isFavourite: {type : Boolean , default:false},
    userId: {type : Schema.Types.ObjectId , ref:"user",require:true},
    createOne: {type : Date,require:true},
    imageUrl: {type : String,require:true},
    visitedDate:{type:Date,required:true},

});

module.exports = mongoose.model("TravelStory",travelStorySchema);
*/