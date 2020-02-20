const handleGetProfile = (req, res, db ) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({ id: id }) //ES6 allows just { id } since Property and Value are the same.
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Error getting user')
            }
        })
        .catch(err => res.status(400).json(err));
}

//ES6 - Don't need value when it is the same as the attribute.
module.exports = {
    handleGetProfile
}