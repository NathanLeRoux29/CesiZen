/**
 * Modèle de données pour un Utilisateur.
 */
class User {
    constructor(id, username, email, password, is_admin, is_active, created_at) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin;
        this.is_active = is_active;
        this.created_at = created_at;
    }
}

module.exports = User;
