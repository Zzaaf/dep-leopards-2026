const removeHttpHeader = (req, res, next) => {
    // Во всех ответах удалить HTTP заголовок 'x-powered-by'
    res.removeHeader('x-powered-by');
    res.set('ForYou', 'Olcha');
    next();
}

module.exports = removeHttpHeader;