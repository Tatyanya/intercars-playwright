import { Page, expect } from '@playwright/test';


export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async verifyUrl(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }


}

