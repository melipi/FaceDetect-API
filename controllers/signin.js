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
        console.log(data);
        const isValid = await bcrypt.compare(password, data[0].hash);
        console.log (isValid);
        return isValid;
    })
    .then(async same => {
        console.log(same);
        if (same) {
            try {
                const users = await knex('users')
                    .select('*')
                    .where('email', '=', email);
                    res.json(users[users.length - 1])
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