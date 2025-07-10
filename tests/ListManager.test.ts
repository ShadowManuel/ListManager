/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import { ListManager } from '../src/ListManager';

describe('ListManager', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="test-container"></div>';
        container = document.getElementById('test-container')!;
    });

    it('should render input, button, and list', () => {
        new ListManager('test-container');

        expect($(container).find('input').length).toBe(1);
        expect($(container).find('button').length).toBe(1);
        expect($(container).find('ul').length).toBe(1);
    });

    it('should add item on button click', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');
        const button = $(container).find('button');

        input.val('Hello');
        button.trigger('click');

        expect(manager.getItems()).toEqual(['Hello']);
    });

    it('should not add empty or whitespace-only items', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');
        const button = $(container).find('button');

        input.val('   ');
        button.trigger('click');

        expect(manager.getItems()).toEqual([]);
    });

    it('should add item on Enter keypress', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');

        input.val('Test');
        const e = $.Event('keypress', { which: 13 });
        input.trigger(e);

        expect(manager.getItems()).toEqual(['Test']);
    });

    it('should remove item on ✕ click', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');
        const button = $(container).find('button');

        input.val('Item to remove');
        button.trigger('click');

        $(container).find('button.remove-item').trigger('click');

        expect(manager.getItems()).toEqual([]);
    });

    it('should clear all items', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');
        const button = $(container).find('button');

        input.val('One');
        button.trigger('click');
        input.val('Two');
        button.trigger('click');

        manager.clear();

        expect(manager.getItems()).toEqual([]);
    });
    
    it('should return all current items with getItems()', () => {
        const manager = new ListManager('test-container');
        const input = $(container).find('input');
        const button = $(container).find('button');
        
        input.val('Item 1');
        button.trigger('click');
        
        input.val('Item 2');
        button.trigger('click');
        
        expect(manager.getItems()).toEqual(['Item 1', 'Item 2']);
    });
    
    it('should throw if container is invalid', () => {
        expect(() => {
            new ListManager('does-not-exist');
        }).toThrow('Container with ID "does-not-exist" not found.');
    });
});
