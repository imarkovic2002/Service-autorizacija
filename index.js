import dotenv from "dotenv";
dotenv.config();
import { methods } from './handlers/userHandler.js';
import { requestTime } from './middlewares/getRequestTime.js'
import { checkHeader } from './middlewares/checkAuthHeader.js'
import { authenticateToken } from './middlewares/authenticateToken.js'
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const jwtKey = process.env.JWT_SECRET_KEY


app.use(requestTime)
app.use(cors({ exposedHeaders: ['authenticated-user'] }))
app.use(express.json())
app.use('/api', router);

router.route('/user/register')
.post(async (req, res) => {
	try {
		const userData = req.body;
		const result = await methods.createUser(userData.name, userData.email, userData.password);
		res.setHeader('authenticated-user', result.email);
		res.status(200).json(result);
	} catch(error) {
		res.status(500).json({});
	}
});

router.route('/user/login')
.post(async (req, res) => {
	try {
		const userData = req.body;
		const user = await methods.checkCredentials(userData.email, userData.password);
		if(user) {
			res.setHeader('authenticated-user', await methods.generateHash());
			res.status(200).json({...user})
		} else {
			return res.status(401).json({})
		}
	} catch(error) {
		res.status(500).json({});
	}
});

router.route('/user/info/:id')
.get(checkHeader, (req, res) => {
	try {
		const id = req.params?.id;
		const user = methods.getUserProfile(id);
		res.status(200).json(user);
	} catch(error) {
		res.status(500).json({});
	}
});

//-------------------------------------------------------------

router.route('/user-jwt/register')
.post(async (req, res) => {
	try {
		const userData = req.body;
		const result = await methods.createUser(userData.name, userData.email, userData.password);
		res.setHeader('authenticated-user', result.email);
		res.status(200).json(result);
	} catch(error) {
		res.status(500).json({});
	}
});

router.route('/user-jwt/login')
.post(async (req, res) => {
	try {
		const userData = req.body;
		const user = await methods.checkCredentials(userData.email, userData.password);
		if(user) {
			const token = jwt.sign({userId: user.id, email: user.email}, JWT_SECRET_KEY);
			res.status(200).json({token});
		} else {
			return res.status(401).json({})
		}
	} catch(error) {
		res.status(500).json({});
	}
});

router.route('/user-jwt/info/:id')
.get(authenticateToken, (req, res) => {
	try {
		const id = req.params?.id;
		const user = methods.getUserProfile(id);
		res.status(200).json(user);
	} catch(error) {
		res.status(500).json({});
	}
});

app.listen(port, () => { console.log(`Service radi na portu ${port}`) });