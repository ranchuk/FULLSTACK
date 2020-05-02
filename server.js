const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const Middleware = require('./middleware/middleware');
// const ErrorHnadlingMiddleware = require('./middleware/error-handling');
const PlansController = require('./controllers/plans-controller');
const SubscriptionsController = require('./controllers/subscriptions-controller');

dotenv.config()
Middleware(app);

app.use('/api/plans', PlansController);
app.use('/api/subscriptions', SubscriptionsController);

// Error middleware must be defined after all other middleware/routes
// ErrorHnadlingMiddleware(app);

// Connect to mongo
// mongoose.connect(
//   process.env.mongoURI,
//   {
//     useNewUrlParser: true,
//     useCreateIndex: true
//   },
//   function(err, db) {
//     if (err) {
//       throw err;
//     }
    
//     }
// );

    //Server static assets if in production
    if (process.env.NODE_ENV === "production") {
      //Set static folder
      app.use(express.static("client/build"));

      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      });
    }

    const PORT = process.env.PORT || 5000;

    var server = app.listen(PORT, () => {
      console.log("server is running on port", server.address().port);
    });
