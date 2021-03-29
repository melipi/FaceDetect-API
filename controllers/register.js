const handleRegister = (db, bcrypt, saltRounds) => async (req, res) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password) {
        return res.status(400).json('Incorrect form submission')
    }

    const hash = await bcrypt.hash(password, saltRounds);

    try {
        await db.transaction (async trx => {
          //Insert into login table
            const loginEmail = await trx('login')
                .insert({
                    email: email,
                    hash: hash
                })
                .returning('email');

          //Insert into users table
          const user = await trx('users')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date()
            })
            .returning('*');      
        res.json(user[0]);
        })
      }
      catch (err){
        console.log(err);
        res.status(400).json('Unable to register');
      }
}

module.exports = {
    handleRegister
};