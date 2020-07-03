const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const { response } = require('express');

module.exports = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if(!authHeader)
        return response.status(401).send({ error: 'Nenhum token encontrado' });

    const parts = authHeader.split(' ');

    if(!parts.lenght === 2)
        return response.status(401).send({ error: 'Erro no token' });

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return response.status(401).send({ error: 'Token mal formatado' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return response.status(401).send({ error: 'Token invalido' });

        request.userId = decoded.id;
        return next();
    });
}