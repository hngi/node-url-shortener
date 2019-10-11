const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { PORT, SECRET_KEY, DB_URL } = require("./config/constants");

const { initRoutes } = require("./routes/routes");
const db = require("./database/db");

const app = express();
const store = new MongoDBStore({
  uri: DB_URL,
  collection: "mySessions"
});

store.on("error", error => {
  console.log(error);
});

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*'); //Don't think we need CORS here.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// load local css and js files
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("super-secret-secret")); //Parse the cookie data (User ID).

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookies: {
      maxAge: 1000 * 60 * 60 * 24 * 30
    }
  })
);

app.set("view engine", "ejs");

initRoutes(app);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
