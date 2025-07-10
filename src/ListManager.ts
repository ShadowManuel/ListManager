import $ from 'jquery';


export class ListManager {
  private container: JQuery<HTMLElement>;
  private inputField: JQuery<HTMLInputElement>;
  private addButton: JQuery<HTMLButtonElement>;
  private clearButton: JQuery<HTMLButtonElement>;
  private list: JQuery<HTMLUListElement>;
  private isTestEnvironment: boolean;

  constructor(containerId: string) {
    const $container = $(`#${containerId}`);
    if ($container.length === 0) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.container = $container;
    this.isTestEnvironment = typeof jest !== 'undefined';
    this.container.html(this.generateHTML());

    this.inputField = this.container.find('input[type="text"]') as JQuery<HTMLInputElement>;
    this.addButton = this.container.find('button.add-item') as JQuery<HTMLButtonElement>;
    this.clearButton = this.container.find('button.clear-list') as JQuery<HTMLButtonElement>;
    this.list = this.container.find('ul.item-list') as JQuery<HTMLUListElement>;

    this.attachEvents();
  }

  private generateHTML(): string {
    return `
      <div class="input-container">
        <input type="text" class="item-input" placeholder="Neuen Eintrag hinzufügen..." />
        <button class="add-item">Hinzufügen</button>
        <button class="clear-list" title="Alle Einträge löschen">Alle löschen</button>
      </div>
      <ul class="item-list"></ul>
    `;
  }

  private attachEvents(): void {
    this.addButton.on('click', () => this.addItem());
    this.inputField.on('keypress', (e: JQuery.KeyPressEvent) => {
      if (e.which === 13) this.addItem();
    });
    this.clearButton.on('click', () => this.clear());

    this.list.on('click', '.remove-item', (e) => {
      const $item = $(e.currentTarget).closest('li');
      if (this.isTestEnvironment) {
        $item.remove();
      } else {
        $item.fadeOut(300, () => {
          $item.remove();
        });
      }
    });
  }

  private addItem(): void {
    const value = this.inputField.val()?.toString().trim();
    if (!value) return;

    const $item = $(`
      <li>
        <span class="item-text">${this.escapeHtml(value)}</span>
        <button class="remove-item" title="Eintrag löschen">✕</button>
      </li>
    `);
    
    if (this.isTestEnvironment) {
      this.list.append($item);
    } else {
      $item.hide().appendTo(this.list).fadeIn(300);
    }
    this.inputField.val('').focus();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public getItems(): string[] {
    return this.list.find('li .item-text').map((_i, el) => $(el).text().trim()).get();
  }

  public clear(): void {
    if (this.isTestEnvironment) {
      this.list.empty();
    } else {
      this.list.fadeOut(300, () => {
        this.list.empty().fadeIn(300);
      });
    }
  }
}
