import express from "express";
import fs from "fs";
import os from "os";
import bodyParser from "body-parser";
import Pool from "pg";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import  {pushMessage}  from "./libs/kafkaProducer.js";
import  {run}  from "./libs/kafkaConsumer.js";

const app = express();

const pool = new Pool.Pool({
  host: "localhost",
  database: "demo",
  password: "dbadmin123",
  user: "admin",
  port: 5432,
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const ddbClient = new DynamoDBClient({
  region: process.env.REGION || "ap-southeast-1",
});

const users = [
  { id: 1, name: "admin" },
  { id: 2, name: "aws" },
  { id: 3, name: "david" },
  { id: 4, name: "mina" },
  { id: 5, name: "jennie" },
];

app.get("/", async (req, res) => {
  try {
    const clientIp = req.header("x-forwarded-for");
    const elbIP = req.socket.remoteAddress;
    const containerIp = req.socket.localAddress;
    const containerName = os.hostname();
    console.log("os hostname: ", os.hostname());
    const ip = containerIp.split(":")[3];
    const version = 5;
    const bgColor = process.env.bgColor || "#283E5B";
    const html = `
    <html>
    <head>
      <title>AWS Application Demo</title>
    </head>
    <body style='background-color: ${bgColor}; color: wheat;text-align: center;'>
      <h1 style='color: orange'>Welcome to AWS</h1>
      <h3>Container name: <span style='color: pink'>${containerName}</span></h3>
      <h3>Container's IP Address: <span style='color: pink'>${ip}</span></h3>
      <h3>Application Version: <span style='color: coral'>V${version}</span></h3>
    <body>
    </html>
    `;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/producer", async (req, res) => {
  try {
    
    const a = await pushMessage();
console.log({a})
    res.send({code: 200});
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
// --------------------

// app.get("/students", async (req, res) => {
//   const id = req.query.id;
//   let query = `SELECT * FROM students`;
//   if (req.query.id !== undefined) {
//     query += ` WHERE id=${id}`;
//   }

//   pool.query(query, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows);
//   });
// });
// app.post("/students", async (req, res) => {
//   const { name, score } = req.body;
//   const query = `INSERT INTO students(id, name, score) VALUES(DEFAULT,'${name}', '${Number(
//     score
//   )}') RETURNING *`;
//   pool.query(query, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(201).send(`Student ID ${results.rows[0].id} Added!`);
//   });
// });
// app.put("/students", async (req, res) => {
//   const { id, name, score } = req.body;
//   const query = `UPDATE students SET name='${name}', score='${Number(
//     score
//   )}' WHERE id=${id}`;
//   pool.query(query, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).send(`Student ID ${id} Updated!`);
//   });
// });
// app.delete("/students", async (req, res) => {
//   const id = req.query.id;
//   const query = `DELETE FROM students WHERE id=${id}`;
//   pool.query(query, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).send(`Student ID ${id} Deleted!`);
//   });
// });

// app.get("/users", async (req, res) => {
//   try {
//     // const result = await query("SELECT * FROM users WHERE id=1");
//     // res.json(result.rows);
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.get("/users/:id", async (req, res) => {
//   try {
//     // const result = await query("SELECT * FROM users WHERE id=1");
//     // res.json(result.rows);
//     const id = req.params.id;
//     const user = users.find((user) => user.id == id);
//     if (user) res.json(user);
//     else res.status(404).send("Not Found");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/users", async (req, res) => {
//   try {
//     // const result = await query("SELECT * FROM users WHERE id=1");
//     // res.json(result.rows);
//     console.dir(req.body);
//     res.send(req.body);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/secrets/users", async (req, res) => {
//   try {
//     // const result = await query("SELECT * FROM users WHERE id=1");
//     // res.json(result.rows);
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/write-logs", async (req, res) => {
//   try {
//     // const result = await query("SELECT * FROM users WHERE id=1");
//     // res.json(result.rows);
//     console.dir(req.body);

//     // fs.writeFile("./data/test.txt", "Hello file!", function (err) {
//     //   if (err) {
//     //     return console.log(err);
//     //   }
//     //   console.log("The file was saved!");
//     // });

//     // Or
//     fs.writeFileSync(
//       "./data/logs.txt",
//       req.body.message + ": " + new Date().toLocaleTimeString()
//     );

//     res.send(req.body);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.post("/write-cache", async (req, res) => {
//   try {
//     console.dir(req.body);

//     fs.writeFileSync(
//       "./cache/tmp.txt",
//       req.body.message + ": " + new Date().toLocaleTimeString()
//     );

//     res.send(req.body);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });
// app.get("/call-dynamodb", async (req, res) => {
//   try {
//     const id = req.query.id || "100";
//     const input = {
//       TableName: "demoaws",
//       Key: {
//         PK: { S: id },
//       },
//     };
//     const command = new GetItemCommand(input);
//     const result = await ddbClient.send(command);
//     if (result.Item) res.json({ name: result.Item.name.S });
//     else
//       res
//         .status(404)
//         .send(`itemId ${id} is not existed. Please try another Id!`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
  run();
});
