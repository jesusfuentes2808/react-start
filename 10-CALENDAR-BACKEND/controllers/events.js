const express = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = express.response) => {
    const eventos = await Evento.find({}).populate('user', 'name');

    res.status(200).json(
        {
            ok: true,
            eventos
        }
    );
}

const crearEvento = async(req, res = express.response) => {
    

    try {
        let evento = new Evento(req.body);
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        
        res.status(200).json(
            {
                ok: true,
                evento: eventoGuardado
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

const actualizarEvento = async(req, res = express.response) => {
    try {
        const eventoId = req.params.id;
        const uid = req.uid;

        let evento = await Evento.findOne({_id: eventoId});
        if(!evento){
            return res.status(404).json(
                {
                    ok: false,
                    msg: 'Evento no encontrado',
                }
            );
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json(
                {
                    ok: false,
                    msg: 'No tiene privilegios para editar este evento'
                }
            );
        }


        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});



        /*let evento = new Evento(req.body);
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        */
        res.status(200).json(
            {
                ok: true,
                evento: eventActualizado
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

const eliminarEvento = async(req, res = express.response) => {
    try {
        const eventoId = req.params.id;
        const uid = req.uid;

        let evento = await Evento.findOne({_id: eventoId});
        if(!evento){
            return res.status(404).json(
                {
                    ok: false,
                    msg: 'Evento no encontrado',
                }
            );
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json(
                {
                    ok: false,
                    msg: 'No tiene privilegios para editar este evento'
                }
            );
        }


        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        await Evento.findByIdAndDelete(eventoId);

        res.status(200).json(
            {
                ok: true,
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

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}