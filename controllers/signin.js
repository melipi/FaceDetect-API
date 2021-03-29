const handleSignin = (db, bcrypt) => async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then (async data => {
        const isValid = await bcrypt.compare(password, data[0].hash);
        if (isValid) {
            try {
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                  res.json(user[0])
                })
            } catch (err) {
                res.status(400).json('Failed to fetch the user');
            }
        } else {
            res.status(400).json('Invalid credentials');
        }
    })
    .catch(err => {
        res.status(400).json('failed to login');
    })
}

 module.exports = {
     handleSignin
 }