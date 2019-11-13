//our root app component
import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'


@Component({
  selector: 'my-app2',
  template: `
   
     <p>Chander Prakash Swami</p>
    
  `,
})
export class App {
  
  public Items = [
                     {name: "Test Data"},
                     {name: "Test Data2"},
                     {name: "Test Data3"},
                     {name: "Test Data4"},
                  ];
     
     }
}

@NgModule({
  imports: [BrowserModule],
  
  declarations: [ App ],
  bootstrap: [ App ]
})
export class AppModule {}