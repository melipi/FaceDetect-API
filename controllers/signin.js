const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json('Incorrect form submission')
    } 
    
    async function checkUser(email, password) {
        //... fetch user from a db etc.
        db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            console.log('check data', data)
        
            const match = await bcrypt.compare(password, user.passwordHash);
            
            if(match) {
                //login
                return db.select('*'). from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Error logging in'))
            } else {
                res.status(400).json('hash doesn\'t match db')
            } 
        })
        .catch(err => res.status(400).json('Invalid email or password!'))
    }
}

 module.exports = {
     handleSignin
 }