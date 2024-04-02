const express = require("express");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

const auth = getAuth();

const app = express();
/*Código introducido de video
/*{
const cookieParser = require('cookie-parser')

const csrfMiddleware = csrf({cookie:true})

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrfMiddleware)
app.all("*",(req,res,next) => {
  res.cookie("XSRF-TOKEN",req.csrfToken)
})
app.post('/sessionLogin',(req,res,) => {
  const idToken = req.body.idToken.toString()

  const expiresin = 60*60*24*5*1000

  admin.auth().createSessionCookie(idToken,{expiresIn}).then(
    (sessionCookie) => {
      const options = {maxAge:expiresin,httpOnly:true}

      res:cookie("session",sessionCookie,options)
      res.end(JSON.stringify({status:"success"}))
    },
    (error) => {
      res.status(401).send("UNAUTHORIZED REQUEST")
      res.redirect('/login')
    }
  )
})
/*}*/

/*const cookieParser = require("cookie-parser");*/
const csrf = require("csurf");
const bodyParser = require("body-parser");

const csrfMiddleware = csrf({ cookie: true });

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
  res.render("login");
});


app.get("/registro", function (req, res) {
  res.render("registro");
});

app.get("/profile", function (req, res) {
  res.render("profile");
});

app.get("/", function (req, res) {
  res.render("index");
});

/**
 * 
 */
const db = admin.firestore();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// List data
app.get("/", async (req, res) => {
  const data = await readData("users");
  res.render("index", { data });
});

async function readData(collectionName) {
  const snapshop = await db.collection(collectionName).get();
  const data = [];
  snapshop.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

// Add New Users
app.get("/add-user", (req, res) => {
  res.render("add-user");
});

app.post("/add-user", async (req, res) => {
  const data = req.body;
  const newDocId = await createData("users", data);
  res.redirect("/");
});

async function createData(collectionName, data) {
  const docRef = db.collection(collectionName).doc();
  await docRef.set(data);
}

// Add New Tasks
app.get("/add-task", async (req, res) => {
  const data = await readData("users");
  res.render("add-task", { data });
});

app.post("/add-task", async (req, res) => {
  const date = Timestamp.now();
  const modDate = date.toDate();
  const data = {
    title: `${req.body.title}`,
    description: `${req.body.description}`,
    status: `${req.body.status}`,
    assignedUser: `${req.body.assignedUser}`,
    createdAt: `${modDate}`,
    lastUpdated: `${modDate}`,
  };
  const newDocId = await createTask("tasks", data);
  res.redirect("/");
});

async function createTask(collectionName, data) {
  const docRef = db.collection(collectionName).doc();
  await docRef.set(data);
}

// List Current Tasks
app.get("/tasks/:user-name", async (req, res) => {//Se cambia :id por user-name
  const { id } = req.params;

  const data = await readUserTasks("tasks", id);
  res.render("user-tasks", { data });
});

async function readUserTasks(collectionName, id) {
  const snapshop = await db.collection(collectionName).where('assignedUser', '==', id).get();
  const data = [];
  snapshop.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

// Update Task Status
app.get("/update-task/:user-name", async (req, res) => {
  const { id } = req.params;
  const taskToUpdate = {
    status: false,
  };
  await updateData("tasks", id, taskToUpdate);
  res.redirect("/");
});

// Edit / Update User Data
app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const doc = await readSingleData("users", id);
  res.render("edit-user", { doc });
});

app.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
  };
  await updateData("users", id, dataToUpdate);
  res.redirect("/");
});

async function readSingleData(collectionName, docId) {
  const docRef = db.collection(collectionName).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error("Document not found!");
  }
  return { id: doc.id, ...doc.data() };
}

async function updateData(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.update(data);
}

// Delete User
app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await deleteData("users", id);
  res.redirect("/");
});

// Delete Tasks
app.get("/delete-task/:id", async (req, res) => {
  const { id } = req.params;
  await deleteData("tasks", id);
  res.redirect("/");
});

async function deleteData(collectionName, docId) {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.delete();
}
//Demo Byker
app.get("/demo", (req, res) => {
  res.render("demo-byker");
});

app.get("/index", (req, res) => {
  res.render("index");
})

app.get("/registro", (req, res) => {
  res.render("registro");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/productos", (req, res) => {
  res.render("productos");
})

app.get("/profile", (req, res) => {
  res.render("profile");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const userRecord = await admin.auth().getUserByEmail(email);
    
  } catch (error) {
    // Error durante la autenticación
    console.error('Error de autenticación:', error);
    res.status(401).send('Error de autenticación');
  }
});