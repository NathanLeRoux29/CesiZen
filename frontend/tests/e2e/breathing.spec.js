import { test, expect } from '@playwright/test';

test.describe('Exercices de Respiration', () => {
  test('[RES-01] - Paramétrer une séance de respiration', async ({ page }) => {
    await page.goto('/Breathing');
    
    // On repère le texte de durée (ex: "Durée totale: 5 minutes")
    const durationText = page.locator('p').filter({ hasText: /durée totale/i });
    await expect(durationText).toContainText('5 minutes');

    // On change la valeur du slider (plus simple de cliquer sur le track pour playwright)
    const slider = page.locator('.v-slider').first();
    await slider.click({ position: { x: 100, y: 10 } }); // Clique plus loin pour augmenter

    // Vérifier que la durée a changé
    const newText = await durationText.innerText();
    expect(newText).not.toBe('Durée totale: 5 minutes');
  });

  test('[RES-03] - Lancer un exercice de respiration', async ({ page }) => {
    await page.goto('/Breathing');
    
    // Vérifier le titre de la page
    await expect(page.locator('h1.text-h4').first()).toContainText(/exercices de respiration/i);

    // Lancer l'exercice (bouton dans la page Breathing.vue)
    const startBtn = page.locator('.breathing-page').getByRole('button', { name: /commencer/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Vérifier que l'exercice démarre
    await expect(page.locator('.breathing-exercise-card')).toBeVisible();
    await expect(page.locator('.phase-text')).toBeVisible();
  });
});
