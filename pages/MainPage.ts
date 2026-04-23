import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export class MainPage extends BasePage {
  private readonly pageLogo: Locator;
  private readonly cartIcon: Locator;
  private readonly menuCOmmon: Locator;
  private readonly closeAcceptCookieModelButton: Locator;
  private readonly acceptHumanPage: Locator;
  private readonly acceptHumanCheckButton: Locator;

  // Main sidebar elements
  private readonly allMenuItem: Locator;
  private readonly TyresMenuItem: Locator;

  // details of All menu subItems
  private readonly allMenuItemHeader: Locator;
  private readonly selectAllbutton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageLogo = this.page.locator('[datatest-id="tap-header-logo"]');
    this.cartIcon = this.page.locator('.header-cart-area a');
    this.menuCOmmon = page.locator('[data-action="navigation"]');
    this.closeAcceptCookieModelButton = page.locator('.osano-cm-dialog__close.osano-cm-close');
    this.acceptHumanPage = page.locator('[aria-live="polite"]');
    this.acceptHumanCheckButton = this.acceptHumanPage.locator('input[type="checkbox"]');
    // Main sidebar sections
    this.allMenuItem = this.menuCOmmon.locator('[datatest-id="tap-menu-test-main"]');
    this.TyresMenuItem = this.menuCOmmon.locator('[datatest-id="tap-topmenu-tires"]');


    // details of All menu subItems
    this.allMenuItemHeader = page.locator('[datatest-id="tap-menu-test-column"][onclick]');
    this.selectAllbutton = page.locator('[datatest-id="tap-menu-test-column"].submenu-all')

  }

  async verifyLogo(): Promise<void> {
    await expect(this.pageLogo).toBeVisible();
  }

  async verifyMenuItems() {
    await expect(this.allMenuItem).toBeVisible();
    await expect(this.TyresMenuItem).toBeVisible();
  }

  async verifyAllMenuSubItems() {
    await this.allMenuItem.click();
    await expect(this.allMenuItemHeader).toBeVisible();
    await expect(this.selectAllbutton).toBeVisible();
  }

  async selectAll() {
    await this.allMenuItem.click();
    await this.selectAllbutton.click();
    await this.waitForPageLoad();
  }

  async clickCartIcon() {
    await this.cartIcon.click();
    await this.waitForPageLoad();
  }

  async closeAcceptCookieModel() {
    if (await this.closeAcceptCookieModelButton.isVisible()) {
      await this.closeAcceptCookieModelButton.click();
    }
  }


  async acceptHumanCheck(): Promise<void> {

    const isChallenge = await this.acceptHumanPage
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    if (isChallenge) {
      await this.page.pause();
    }

  }





}