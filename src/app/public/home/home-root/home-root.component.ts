import {Component, OnInit} from '@angular/core';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styles: []
})
export class HomeRootComponent implements OnInit {
  editorOptions = {theme: 'vs', language: 'csharp', wrappingIndent: 'indent', dimension: {height: 300, width: 300} } as MonacoEditorConstructionOptions;
  code = ' public static void main() {\n\tConsole.Writeln("Hello world!");\n}';

  constructor() {
  }

  ngOnInit(): void {
  }

}
