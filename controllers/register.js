const handleRegister = (req, res, db, bcrypt, salt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Missing required fields')
    }
    const hash = bcrypt.hashSync(password, salt);
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
                    res.header("Access-Control-Allow-Origin", "*");
                    res.json(user[0]); 
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err, 'Unable to Register'))
}

module.exports = {
    handleRegister: handleRegister
};