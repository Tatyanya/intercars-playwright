import { Locator, Page, expect } from '@playwright/test';
import { ParserUtils } from '../utils/ParserUtils';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private readonly subCategoryCounts: Locator;
  private readonly subCategoryItems: Locator;
  private readonly headerName: Locator;

  private readonly productTile: Locator;
  private readonly productPrice: Locator;
  private readonly productCartIcon: Locator;

  private readonly closeModalButton: Locator;


  constructor(page: Page) {
    super(page);

    this.subCategoryCounts = this.page.locator('#collapse .count');
    this.subCategoryItems = this.page.locator('.groups-buttons :not(.btn-group-back) [title].waves-effect');
    this.headerName = this.page.locator('h1');
    this.productTile = this.page.locator('.container-baner-fo-js');
    this.productPrice = this.productTile.locator('[datatest-id="tap-item-product-price"]');
    this.productCartIcon = this.productTile.locator('#fc-add-cart');

    this.closeModalButton = this.page.locator('.closeModalAddToCard');
  }



  async getSubcategoryCountsSum(): Promise<number> {
    await this.subCategoryCounts.first().waitFor({ state: 'visible' });

    const allCounts = await this.subCategoryCounts.all();
    let total = 0;

    for (const el of allCounts) {
      const text = (await el.textContent() ?? '').trim();
      const match = ParserUtils.parseCount(text);
      if (match) total += match;
    }

    return total;
  }

  async getRandomSubcategoryName(): Promise<Locator> {
    const count = await this.subCategoryItems.count();
    const randomIndex = Math.floor(Math.random() * count);
    return this.subCategoryItems.nth(randomIndex);
  }

  async clickRandomSubcategoryAndCheckName(): Promise<void> {
    const randomItem = await this.getRandomSubcategoryName();
    const name = await randomItem.textContent() ?? '';
    await randomItem.click();
    await this.waitForPageLoad();

    const headerText = await this.headerName.textContent() ?? '';

    expect.soft(headerText.toLowerCase()).toContain(name.toLowerCase());
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
    await this.waitForPageLoad();
  }

  async getCountOfProductsDisplayed(): Promise<number> {
    await this.productTile.first().waitFor({ state: 'visible' });
    return await this.productTile.count();
  }

  async addProductsToCart(count: number): Promise<number[]> {
    const displayedCount = await this.getCountOfProductsDisplayed();
    const prices: number[] = [];

    for (let i = 0; i < Math.min(count, displayedCount); i++) {
      const priceText = await this.productPrice.nth(i).textContent() ?? '';
      const price = ParserUtils.parsePrice(priceText);
      prices.push(price);

      await this.productCartIcon.nth(i).click();

      await this.waitForPageLoad();
      // close modal to confirm that product was added and continue with next one
      if (await this.closeModalButton.isVisible()) {
        await this.closeModal();
      }
    }

    return prices;
  }
}