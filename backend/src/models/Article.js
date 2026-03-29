/**
 * Modèle de données pour un Article.
 */
class Article {
    /**
     * @param {number} id Identifiant unique.
     * @param {string} title Titre de l'article.
     * @param {string} summary Résumé court.
     * @param {string} content Contenu complet.
     * @param {string} media_url URL de l'image ou vidéo.
     * @param {string} author Auteur de l'article.
     * @param {boolean} is_active Statut de l'article.
     * @param {Date} created_at Date de création.
     * @param {number} id_category ID de la catégorie associée.
     */
    constructor(id, title, summary, content, media_url, author, is_active, created_at, id_category) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.media_url = media_url;
        this.author = author;
        this.is_active = is_active;
        this.created_at = created_at;
        this.id_category = id_category;
    }
}

module.exports = Article;
