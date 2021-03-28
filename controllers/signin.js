const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        console.log(data)
        const isValid = bcrypt.compareSync(password, data[0].hash);
        console.log('const', isValid)
        if(isValid) {
            console.log('True', isValid)
            return db.select('*'). from('users')
             .where('email', '=', email)
             .then(user => {
                 res.json(user[0])
             })
             .catch(err => res.status(400).json('Error logging in'))
        } else {
            console.log('False', isValid)
            res.status(400).json('Sorry, invalid username or password')
        }
    })
    .catch(err => res.status(400).json('Invalid username or password!'))
 }

 module.exports = {
     handleSignin
 }