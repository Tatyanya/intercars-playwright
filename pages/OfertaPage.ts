import { Locator, Page } from '@playwright/test';
import { ParserUtils } from '../utils/ParserUtils';
import { BasePage } from './BasePage';


export class OfertaPage extends BasePage {
  private readonly counts: Locator;

  constructor(page: Page) {
    super(page);

    this.counts = this.page.locator('#collapse .count');
  }

  async getCategoryWithHighestCount(): Promise<{ name: Locator; count: number }> {

    const allCounts = await this.counts.all();

    let maxCount = -1;
    let maxIndex = 0;

    for (let i = 0; i < allCounts.length; i++) {
      const text = await allCounts[i].textContent() ?? '';
      const count = ParserUtils.parseCount(text);
      if (count > maxCount) {
        maxCount = count;
        maxIndex = i;
      }
    }

    const name = allCounts[maxIndex].locator('..').locator('.group-filter-name');

    return { name, count: maxCount };
  }

  async clickCategoryWithHighestCount(): Promise<{ count: number; name: string }> {
    const { name, count } = await this.getCategoryWithHighestCount();
    await name.click();
    return { count, name: await name.textContent() ?? '' };
  }



}