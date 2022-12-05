module.exports = {
    sessionControl: (req, res, next) => {
        if (req.session.adminLogin) {
            next()
        }
        else {
            res.redirect("/admin")
        }
    },

    userSession: (req, res, next) => {
       
        if (req.session.login) {
            next()
        }
        else {
            res.redirect('/login')
        }
    }
}

