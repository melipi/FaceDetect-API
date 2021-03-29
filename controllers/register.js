const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password) {
        return res.status(400).json('Invalid entry- Empty email, name or pasword')
    }
    
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return res.status(400).json('1- Error registering user')
        } else {
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })    
            .catch(err => res.status(400).json('2- Error registering user'))
        }
    });
}

module.exports = {
    handleRegister
};