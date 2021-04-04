const handleSignin = (db, bcrypt) => async (req, res) => {
    const { email, password } = req.body;

    // Validate empty submissions
    if(!email || !password) {
        return res.status(400).json('Email and password are required for sign in')
    }

    // login
    db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then (async data => {
        //check password against hash
        const isValid = await bcrypt.compare(password, data[0].hash);
        if (isValid) {
            try {
                //true
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                  res.json(user[0])
                })
            } catch (err) {
                res.status(400).json('Failed to fetch the user from db');
            }
        } else {
            res.status(400).json('Invalid credentials, please try again');
        }
    })
    .catch(err => {
        res.status(400).json('Login failed');
    })
}

 module.exports = {
     handleSignin
 }