const express = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const {generarJWT} = require('../helper/jwt');

//Alternativo
const crearUsuario = async(req, res = express.response) => {
    const {email, name, password} = req.body;

    /*if(name.length < 5){
        return res.status(400).json(
            {
                ok: false,
                msg: 'El nombre debe de ser de 5 letras'
            }
        );
    }*/

    //manejo de errores

    try{
        let usuario = await Usuario.findOne({ email });
        
        if(usuario){
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El usuario ya existe con ese email',
                }
            );
        }

        usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);
        
        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json(
            {
                ok: true,
                msg: 'registro',
                uid: usuario.id,
                name: usuario.name,
                token
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                ok: false,
                msg: 'Por favor contacte al administrador',
            }
        );
    }
    
}


//Alternativo
const loginUsuario = async (req, res = express.response) => {
    const {email, password} = req.body;

    //manejo de errores
    /*const errors = validationResult(req);

    if(! errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped(),
        });
    }*/

    try {
        let usuario = await Usuario.findOne({ email });
        console.log(usuario);
        if(!usuario){
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'Usuario y contraseña son incorrectos',
                }
            );
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        console.log(validPassword);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password Incorrecto'
            });
        }

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json(
            {
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                token
            }
        );
    } catch(error) {
        console.log(error);
        res.status(500).json(
            {
                ok: false,
                msg: 'Por favor contacte al administrador',
            }
        );
    }

    
}

//Alternativo
const revalidarToken = async(req, res = express.response) => {

    const {uid, name} = req;
    const token = await generarJWT(uid, name);

    res.json(
        {
            ok: true,
            msg: 'revalidarToken',
            uid,
            name,
            token
        }
    );
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}

