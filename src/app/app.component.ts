import { Component } from '@angular/core';

// This code would ideally be loaded in main.ts before everything else
// For demonstration it is here with the rest of the theming logic
import cssVars from 'css-vars-ponyfill';
import './dropdown';
cssVars({
  shadowDOM: true,
  watch: true
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showDropdown = true;
  textColor = 'blue';
  lightTheme = true;

  toggleStylesheet() {
    const myId = 'myStylesheet';
    const styleNode = document.getElementById(myId);

    if (styleNode) {
      // remove it
      styleNode.parentNode.removeChild(styleNode);
    } else {
      // add it
      const newStyle = document.createElement('link');
      document.head.appendChild(newStyle);
      newStyle.rel = 'stylesheet';
      newStyle.id = myId;
      newStyle.href = '/assets/themesheet.css';
    }
    // by removing and adding we are hoping the cssVars watch will come into play
  }

  toggleTheme() {
    this.lightTheme = !this.lightTheme;

    // This forces ShadyCSS to update all web components using shadow DOM
    (window as any).ShadyCSS.styleDocument({
      '--root-color': this.lightTheme ? '#2d2d2d' : '#fff',
      '--root-background-color': this.lightTheme ? '#fff' : '#2d2d2d',
      '--dropdown-color': this.lightTheme ? '#2d2d2d' : '#fff',
      '--dropdown-background-color': this.lightTheme ? '#ccc' : '#000',
    });

    // This forces the CSS Vars Ponyfill to update global styles
    // TODO: need to clean up old style tags previously added
    const newStyle = document.createElement('style');
    document.head.appendChild(newStyle);
    newStyle.id = 'ie-theme';
    newStyle.innerHTML = `
      :root {
        --root-color: ${this.lightTheme ? '#2d2d2d' : '#fff'};
        --root-background-color: ${this.lightTheme ? '#fff' : '#2d2d2d'};
        --dropdown-color: ${this.lightTheme ? '#2d2d2d' : '#fff'};
        --dropdown-background-color: ${this.lightTheme ? '#ccc' : '#000'};
      }
    `;
  }

  // This example updates a individual components shadow dom
  // This works until the element is added or removed and then "forgets" its state
  // Because of this it is ideal we use a flat global structure for CSS Vars
  toggleTextColor() {
    this.textColor = this.textColor === '#000' ? '#fff' : '#000';
    (window as any).ShadyCSS.styleSubtree(document.querySelector('x-dropdown'), {'--dropdown-color' : this.textColor});
  }
}
