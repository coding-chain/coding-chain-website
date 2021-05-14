import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styles: []
})
export class HomeRootComponent implements OnInit {
  editorOptions = {theme: 'vs', language: 'csharp', wrappingIndent: 'indent'};
  code = ' public static void main() {\n\tConsole.Writeln("Hello world!");\n}';

  constructor() {
  }

  ngOnInit(): void {
  }

}
