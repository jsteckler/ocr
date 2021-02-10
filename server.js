const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
var Tesseract = require('tesseract.js')


//middlewares
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const PORT = process.env.PORT | 5000;

var Storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, __dirname + '/images');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

var upload = multer({storage: Storage});

//route
app.get('/', (req,res)=>{
    res.render('index');
});

app.post("/upload", upload.single('image'),(req, res) => {
        console.log(req.file);
	    
		Tesseract.recognize(
			'images/'+req.file.filename,
			'spa',
			{logger: p=>console.log(p)})
			.then(
				({data:{text}})=>{
					return res.json({message:text})
				}
			);
		});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});