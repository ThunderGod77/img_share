const mongoose = require("mongoose")

const dbURI = process.env.MONGODB_URI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports =  mongoose