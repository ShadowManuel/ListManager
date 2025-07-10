import { ListManager } from './ListManager.js';
import $ from 'jquery';


$(function() {
  try {
    const listManager = new ListManager('list-container');
    // Jetzt läuft deine App
  } catch (error) {
    console.error(error);
  }
});

