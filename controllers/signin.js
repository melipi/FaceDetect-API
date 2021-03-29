const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        if (data.length) {
            const isValid = bcrypt.compare(password, data[0].hash, function(err, result) {
                console.log('check result', result) //debug
                res.status(400).json('1- Error matching credentials to db')
            });

            console.log('check const', isValid) //debug

            if(isValid) {
                console.log('True', isValid)    //debug
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('2- Error matching credentials to db'))
            } else {
                console.log('False', isValid)   //debug
                res.status(400).json('3- Error matching credentials to db')
            }
        }
    })
    .catch(err => res.status(400).json('4- Error matching credentials to db'))
 }

 module.exports = {
     handleSignin
 }