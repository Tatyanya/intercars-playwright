import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { MainPage } from '../pages/MainPage';
import { OfertaPage } from '../pages/OfertaPage';
import { ProductsPage } from '../pages/ProductsPage';
let mainPage: MainPage;
let ofertaPage: OfertaPage;
let productsPage: ProductsPage;
let cartPage: CartPage;

// test.use({ storageState: 'playwright/.auth/user.json' });

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);
  ofertaPage = new OfertaPage(page);
  productsPage = new ProductsPage(page);
  cartPage = new CartPage(page);
  await mainPage.navigateTo('/');
  await mainPage.waitForPageLoad();
  await mainPage.closeAcceptCookieModel();
});

test.afterEach(async ({ page }) => {
  await page.unrouteAll(); // Clean up all routes
});


test.describe('Main Page checks', () => {

  test('verify page logo is visible', async () => {
    await mainPage.verifyLogo();
  });

  test('verify page title', async () => {
    await mainPage.verifyTitle('Sklep motoryzacyjny: opony i części samochodowe | Intercars.pl');
  });

  test('verify url path', async () => {
    const baseURL = test.info().project.use.baseURL;
    await mainPage.verifyUrl(baseURL || 'https://intercars.pl/');
  });

  test('verify menu items are visible', async () => {
    await mainPage.verifyMenuItems();
    await mainPage.verifyAllMenuSubItems();
  });
});
test.describe('Oferta Page checks', () => {

  test('verify select all', async () => {
    await mainPage.selectAll();
    await ofertaPage.verifyTitle('Opony, akcesoria i części samochodowe   | Sklep Inter Cars');
  });

  test('e2e_click category with highest count', async () => {
    await mainPage.closeAcceptCookieModel();
    await mainPage.selectAll();
    await mainPage.acceptHumanCheck();

    // workaround

    // await ofertaPage.navigateTo('https://intercars.pl/oferta/');
    const { count, name } = await ofertaPage.clickCategoryWithHighestCount();
    console.log(`Clicked on category "${name}" with count: ${count}`);

    const total = await productsPage.getSubcategoryCountsSum();
    console.log(`Total subcategory counts: ${total}`);
    expect.soft(total, 'Total subcategory counts mismatch  ').toBe(count);

    let sum: number;
    await test.step('click random subcategory and check name', async () => {
      await productsPage.clickRandomSubcategoryAndCheckName();
    });
    await test.step('add products to cart', async () => {
      const count = 2;
      const prices = await productsPage.addProductsToCart(count);
      sum = prices.reduce((acc, price) => acc + price, 0);

      console.log(`Added products to cart with prices: ${prices}`);
    });

    await test.step('go to cart', async () => {
      await mainPage.clickCartIcon();
    });

    await test.step('verify the total price', async () => {
      const total = await cartPage.getTotalSum();
      console.log(`Total sum in cart: ${total}`);
      expect(sum).toBe(total);

    });

  });

});