const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'a2fac7acea114857b955117adb97edba'
  });

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('API error'))
}


const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(jsonEntries => res.json(jsonEntries[0]))
    .catch(err => res.status(400).json('unable to retrieve entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}