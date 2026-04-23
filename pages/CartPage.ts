import { Locator, Page } from '@playwright/test';
import { ParserUtils } from '../utils/ParserUtils';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly headerName: Locator;

  private readonly productTile: Locator;
  private readonly productPrice: Locator;
  private readonly totalSum: Locator;



  constructor(page: Page) {
    super(page);

    this.headerName = this.page.locator('h1');
    this.productTile = this.page.locator('.container-baner-fo-js');
    this.productPrice = this.productTile.locator('[datatest-id="tap-item-product-price"]');
    this.totalSum = this.page.locator('.payment-info>:not(.cart-buy-confirm-container) .summary-payment-info');

  }

  async getTotalSum(): Promise<number> {
    const text = await this.totalSum.textContent() ?? '';
    return ParserUtils.parsePrice(text);
  }

}