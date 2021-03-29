const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        if (data.length) {
            console.log('check data', data)

            const isValid = bcrypt.compareSync(password, data[0].hash);
    
            console.log('check const', isValid)
    
            if(isValid) {
                console.log('True', isValid)
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('1 - Error, something went wrong'))
            } else {
                console.log('False', isValid)
                res.status(400).json('2 - Invalid username or password!')
            }
        }
    })
    .catch(err => res.status(400).json('4 - Invalid username or password!'))
 }

 module.exports = {
     handleSignin
 }