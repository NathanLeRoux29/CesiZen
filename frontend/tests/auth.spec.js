import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('[AUTH-01] - Accéder à la page de connexion', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur l'icône de compte dans la barre de navigation
    const accountBtn = page.locator('.app-bar').getByRole('button').filter({ has: page.locator('.mdi-account-circle') });
    await accountBtn.click();

    // Vérifier redirection vers Login
    await expect(page).toHaveURL(/\/Login/);
    
    // Vérifier présence formulaire
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('[AUTH-02] - Créer un compte utilisateur', async ({ page }) => {
    await page.goto('/Login');
    
    // Basculer en mode inscription
    await page.getByText(/s'inscrire/i).first().click();
    
    // Remplir le formulaire
    await page.getByLabel("Nom d'utilisateur").fill('TestUser' + Date.now());
    await page.getByLabel("Adresse Email").fill('test' + Date.now() + '@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Valider
    await page.getByRole('button', { name: /créer mon compte/i }).click();

    // Vérifier message de succès
    await expect(page.locator('.v-alert')).toContainText(/compte créé/i);
  });

  test('[AUTH-03] - Se connecter à son compte', async ({ page }) => {
    await page.goto('/Login');
    
    // Saisir identifiants (du SQL)
    await page.locator('input[type="email"]').fill('user@cesizen.fr');
    await page.locator('input[type="password"]').fill('user123');
    
    // Se connecter
    await page.getByRole('button', { name: /se connecter/i }).click();

    // Vérifier redirection accueil
    await expect(page).toHaveURL(/\/$/);

    // Vérifier que le nom d'utilisateur apparaît dans la barre
    await expect(page.locator('.app-bar')).toContainText(/utilisateur/i);
  });
});
