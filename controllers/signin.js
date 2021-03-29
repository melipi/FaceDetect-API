const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
        console.log(data);
        const isValid = bcrypt.compare(password, data[0].hash);
        console.log (isValid);
        return isValid;
    })
    .then(async same => {
        if (same) {
            try {
                const users = await knex('users')
                    .select('*')
                    .where('email', '=', req.body.email);
                res.json(users[0]);
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