const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Missing required fields')
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash); // returns true
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                .catch(err => res.status(400).json('error getting user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}