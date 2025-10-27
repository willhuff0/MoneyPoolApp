class AuthController {
    authDao;
    constructor(authDao) {
        this.authDao = authDao;
    }
    createUser = (req, res) => {
        const body = req.body;
        // if (!validateUserName)
    };
    startSession = (req, res) => {
    };
    invalidateAllSessions = (req, res) => {
    };
}
