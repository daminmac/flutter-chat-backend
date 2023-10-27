const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioDB =  await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Correo electrónico no encontrado'
            });
        }
        
        // Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'La Contraseña no es válida'
            });
        }

        // generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            Ok: true,
            body: usuarioDB, 
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
        return res.json({
            ok: true,
            msg: 'login'
        });
    }
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo electrónico ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar mi JWT (JSON Web Token)
        const token = await generarJWT( usuario.id );
    
        res.json({
            Ok: true,
            body: usuario, 
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    const token = await generarJWT( uid );

    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario, 
    login,
    renewToken
}