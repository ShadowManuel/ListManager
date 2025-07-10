import $ from 'jquery';


export class ListManager {
  private container: JQuery<HTMLElement>;
  private inputField: JQuery<HTMLInputElement>;
  private addButton: JQuery<HTMLButtonElement>;
  private list: JQuery<HTMLUListElement>;

  constructor(containerId: string) {
    const $container = $(`#${containerId}`);
    if ($container.length === 0) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.container = $container;
    this.container.html(this.generateHTML());

    this.inputField = this.container.find('input[type="text"]') as JQuery<HTMLInputElement>;
    this.addButton = this.container.find('button.add-item') as JQuery<HTMLButtonElement>;
    this.list = this.container.find('ul.item-list') as JQuery<HTMLUListElement>;

    this.attachEvents();
  }

  private generateHTML(): string {
    return `
      <input type="text" class="item-input" />
      <button class="add-item">Add Item</button>
      <ul class="item-list"></ul>
    `;
  }

  private attachEvents(): void {
    this.addButton.on('click', () => this.addItem());
    this.inputField.on('keypress', (e: JQuery.KeyPressEvent) => {
      if (e.which === 13) this.addItem();
    });

    this.list.on('click', '.remove-item', (e) => {
      $(e.currentTarget).closest('li').remove();
    });
  }

  private addItem(): void {
    const value = this.inputField.val()?.toString().trim();
    if (!value) return;

    const $item = $(`<li>${value} <button class="remove-item">✕</button></li>`);
    this.list.append($item);
    this.inputField.val('');
  }

  public getItems(): string[] {
    return this.list.find('li').map((_i, el) => $(el).text().replace('✕', '').trim()).get();
  }

  public clear(): void {
    this.list.empty();
  }
}
