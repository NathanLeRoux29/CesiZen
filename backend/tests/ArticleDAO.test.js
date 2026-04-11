const ArticleDAO = require('../src/dao/ArticleDAO');
const db = require('../src/config/db');

// Mock de la base de données
jest.mock('../src/config/db');

describe('ArticleDAO', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllActive', () => {
        it('doit retourner une liste d\'articles actifs', async () => {
            const mockArticles = [
                { id: 1, title: 'Article 1', is_active: 1 },
                { id: 2, title: 'Article 2', is_active: 1 }
            ];
            
            db.query.mockResolvedValue([mockArticles]);

            const result = await ArticleDAO.getAllActive();

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE a.is_active = 1'));
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Article 1');
        });

        it('doit retourner un tableau vide si aucun article n\'est actif', async () => {
            db.query.mockResolvedValue([[]]);

            const result = await ArticleDAO.getAllActive();

            expect(result).toHaveLength(0);
        });
    });

    describe('getById', () => {
        it('doit retourner un article par son ID', async () => {
            const mockArticle = { id: 1, title: 'Test Article' };
            db.query.mockResolvedValue([[mockArticle]]);

            const result = await ArticleDAO.getById(1);

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE a.id = ?'), [1]);
            expect(result).toEqual(mockArticle);
        });

        it('doit retourner null si l\'article n\'existe pas', async () => {
            db.query.mockResolvedValue([[]]);

            const result = await ArticleDAO.getById(999);

            expect(result).toBeNull();
        });
    });
});
