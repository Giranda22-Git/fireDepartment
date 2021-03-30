module.exports =
class Login {
    constructor(login) {
        if (this.newLoginValid(login))
            this._login = login
        else return new Error('bad login')
    }

    get login () {
        return this._login
    }

    set login (login) {
        if (this.newLoginValid(login))
            this._login = login
        else return new Error('bad login')
    }

    async newLoginValid (login) {
        return login.length >= 6 && login.length <= 128
    }
}