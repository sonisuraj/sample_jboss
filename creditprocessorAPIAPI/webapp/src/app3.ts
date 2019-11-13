//our root app component
import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'


@Component({
  selector: 'my-app',
  template: `
   
     <table ng-controller="myCtrl" border="1" cellpadding="9">
     
<tr>
<th style="background-color:#ececec" ></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Device Name</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">BackUp Method</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">BackUp Off site</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Back Up Schedule</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Description</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Device Type</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Discovery Status</font></th>
<th nowrap="nowrap"  style="background: black" ><font style=" color: white">DR Physical Device</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">DR Process</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">DR Required</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Enviroment</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">In Scope</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Is Virtual</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Logical CPU</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Logical Device Host</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Memory</font></th>

<th nowrap="nowrap" style="background: black" ><font style=" color: white">Migration Approach</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Monitoring System</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">OS</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">OS Version</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">OS Arch</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">OS Patch Level</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">  Role  </font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Status</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Windows Domain</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Id</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Custom Attributes</font></th>
<th nowrap="nowrap" style="background: black" ><font style=" color: white">Notes</font></th>
</tr>
<tr *ngFor="let Item of Items">
    <td><img src="/BlueBenchScope1/images/Information_icon.jpg" alt="HTML5 Icon"  style="width:15px;height:18px;"></td>
  <!-- <td style="background-color:#ececec">{{Item.name}}</td> -->
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td> 
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option  *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
  <td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
<td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
<td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
<td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec">{{Item.name}}</td>
  <td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}} >
    {{Item.name}}
  </option>
</select></td>
<td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
<td style="background-color:#ececec"><select style="background-color:#ececec ; Border: none; width: auto">
  <option *ngFor="let Item of Items" value= {{Item.name}}>
    {{Item.name}}
  </option>
</select></td>
  <td style="background-color:#ececec">{{Item.name}}</td>
   <td style="background-color:#ececec">{{Item.name}}</td>
   <td style="background-color:#ececec">{{Item.name}}</td>
</tr>
</table>
    
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
  imports: [ BrowserModule],
  
  declarations: [ App ],
  bootstrap: [ App ]
})
export class AppModule {}