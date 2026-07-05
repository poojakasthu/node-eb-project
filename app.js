const express = require('express');

const app = express();

app.get('/', (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Node EB Project</title>

<style>

body{
font-family:Arial,sans-serif;
margin:0;
padding:0;
background:#f4f6f9;
}

header{
background:#1e3a8a;
color:white;
padding:20px;
text-align:center;
}

.hero{
padding:50px;
text-align:center;
}

.card-container{
display:flex;
justify-content:center;
gap:20px;
margin-top:30px;
flex-wrap:wrap;
}

.card{
background:white;
padding:20px;
width:250px;
border-radius:15px;
box-shadow:0px 4px 10px rgba(0,0,0,0.2);
}

button{
background:#2563eb;
color:white;
padding:12px 20px;
border:none;
border-radius:10px;
cursor:pointer;
}

footer{
margin-top:40px;
background:#111827;
color:white;
padding:15px;
text-align:center;
}

</style>

</head>

<body>

<header>
<h1>My Cloud Project Website 🚀</h1>
<p>Deployed using AWS Elastic Beanstalk</p>
</header>

<div class="hero">

<h2>Welcome</h2>

<p>
This website is built using Node.js and deployed on AWS using CI/CD pipeline.
</p>

<button onclick="alert('Project Successfully Running!')">
Explore
</button>

<div class="card-container">

<div class="card">
<h3>Node.js</h3>
<p>Backend runtime environment</p>
</div>

<div class="card">
<h3>AWS</h3>
<p>Cloud deployment platform</p>
</div>

<div class="card">
<h3>CI/CD</h3>
<p>Automatic deployment workflow</p>
</div>

</div>

</div>

<footer>
Created by Pooja ❤️
</footer>

</body>
</html>
`)
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log(`Server Running on port \${PORT}`)
})