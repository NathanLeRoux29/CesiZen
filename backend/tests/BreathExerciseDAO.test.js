const BreathExerciseDAO = require('../src/dao/BreathExerciseDAO');
const db = require('../src/config/db');

jest.mock('../src/config/db');

describe('BreathExerciseDAO', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('doit retourner tous les exercices de respiration', async () => {
            const mockExercises = [{ id: 1, name: '7-4-8' }];
            db.query.mockResolvedValue([mockExercises]);
            const result = await BreathExerciseDAO.getAll();
            expect(result).toEqual(mockExercises);
        });
    });

    describe('getById', () => {
        it('doit retourner un exercice par son ID', async () => {
            const mockExercise = { id: 1, name: '7-4-8' };
            db.query.mockResolvedValue([[mockExercise]]);
            const result = await BreathExerciseDAO.getById(1);
            expect(result).toEqual(mockExercise);
        });
    });
});
