import userModel from '../models/users.models.js';
import { generateToken } from '../utils/jwt.js';

const postSession = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		const token = generateToken(req.user); // se genera el token con el usuario
		res.cookie('jwtCookie', token, {
			// se envia el token a las cookies
			maxAge: 43200000, // seteamos que dure 12 hs en milisegundos
		});
		const user = await userModel.findOne({ email: req.user.email });
		user.last_connection = Date.now();
		await user.save();

		// Almacena el mensaje en una cookie
        res.cookie('message', 'Login exitoso', {
            maxAge: 7000, // La cookie expira después de 5 segundos
        });

		//return res.status(200).send('Login exitoso');
		// Redirige al usuario a la página de productos
        return res.redirect('/static/products');
		//return res.status(200).json({ message: 'Login exitoso', redirectUrl: '/static/products' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
};

const getCurrentSession = async (req, res) => {
	res.status(200).send(req.user);
};

const getGithubCreateUser = async (req, res) => {
	return res.status(200).send({ mensaje: 'Usuario creado' });
};

const getGithubSession = async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
};

const getLogout = async (req, res) => {
	if (req.session) {
		req.session.destroy();
		if (req.user) {
			const user = await userModel.findOne({ email: req.user.email });
			user.last_connection = Date.now();
			await user.save();
		}
	}
	res.clearCookie('jwtCookie');
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
};

const sessionController = {
	postSession,
	getCurrentSession,
	getGithubCreateUser,
	getGithubSession,
	getLogout,
};

export default sessionController;