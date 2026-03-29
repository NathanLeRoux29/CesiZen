/**
 * Modèle de données pour un Exercice de Respiration.
 */
class BreathExercise {
    constructor(id, title, breath_in_time, breath_hold_time, breath_out_time, description) {
        this.id = id;
        this.title = title;
        this.breath_in_time = breath_in_time;
        this.breath_hold_time = breath_hold_time;
        this.breath_out_time = breath_out_time;
        this.description = description;
    }
}

module.exports = BreathExercise;
