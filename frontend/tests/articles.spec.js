import { test, expect } from '@playwright/test';

test.describe('Articles et Contenu', () => {
  test('[ART-01] - Consulter la liste des articles', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le bouton "Découvrir le catalogue" sur l'accueil
    const catalogueBtn = page.getByRole('link', { name: /découvrir le catalogue/i });
    await expect(catalogueBtn).toBeVisible();
    await catalogueBtn.click();

    // Vérifier redirection vers le catalogue
    await expect(page).toHaveURL(/\/Catalogue/);
    
    // Vérifier la présence de cartes d'articles
    const articleCards = page.locator('.v-card');
    await expect(articleCards.first()).toBeVisible();
  });

  test('[ART-02] - Consulter un article spécifique', async ({ page }) => {
    await page.goto('/Catalogue');
    
    // Cliquer sur la première carte d'article
    const firstArticle = page.locator('.article-card').first();
    await expect(firstArticle).toBeVisible();
    
    const articleTitle = await firstArticle.locator('.article-card__title').innerText();
    await firstArticle.click();

    // Vérifier redirection vers le détail de l'article
    await expect(page).toHaveURL(/\/article\/\d+/);
    
    // Vérifier l'affichage du titre
    await expect(page.locator('h1.article-detail__title')).toContainText(articleTitle);
  });

  test('[ART-03] - Filtrer par catégorie', async ({ page }) => {
    await page.goto('/Catalogue');
    
    // Attendre les articles
    await expect(page.locator('.article-card').first()).toBeVisible();
    await page.locator('.v-chip').first().waitFor({ state: 'visible' });
    
    // Cliquer sur la catégorie "Yoga" (spécifiquement dans le groupe de filtres)
    const yogaChip = page.locator('.premium-chip').filter({ hasText: /^Yoga$/ });
    await yogaChip.click();

    // Vérifier que les articles affichés sont bien de la catégorie Yoga
    const categoryChips = page.locator('.article-card__category');
    await expect(categoryChips.first()).toContainText('Yoga');
  });
});
