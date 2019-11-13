//our root app component
import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'


@Component({
  selector: 'my-app',
  template: `
   
<div class="container" ng-controller="landingController">

         <div class="row" style="width: 100%;margin-top:1px; border-bottom: 1px solid black">
             <div class="col-md-3">
               <img src="img/ibmlogo.jpg" style=""/>
             </div>
             <div align="center" class="col-md-6">
               <a  style="color: black; font-size:36px; margin: 1000 cm; ">Source View</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
             </div>
             <div class="col-md-3">
               <img alt="" src="img/loginLogo.png">
                <a  style="color: black; font-size:13px;">Ashley Struat</a>&nbsp;&nbsp;
                <a style="color: black; font-size:13px;">Architect</a>&nbsp;&nbsp;
                <a  style="color: black; font-size:13px;">Read Only</a>
                <img alt="" src="img/menu.png">
             </div>
          </div>
         <br/>

<div class="row" style="border-bottom: 1px solid black">
          <div  class="tab" style="width: 100%;">
          <div class="col-md-1">
            <img alt="" src="img/home.png">
           </div>
            <div  class="col-md-1">
               <a  style ="width: 25%;" >Import</a>
               <img alt="" src="img/dropdown.png">
            </div>
            <div  class="col-md-1">
              <a  style ="width: 25%;">Export</a>
              <img alt="" src="img/dropdown.png">
            </div>
            <div class="col-md-1">
               <a  style ="width: 25%;">Reporting</a>
               <img alt="" src="img/dropdown.png">
            </div>
            <div  class="col-md-1">
               <a  style ="width: 25%;">Administration</a>
               <img alt="" src="img/dropdown.png">
            </div>
            <div class="col-md-4"></div>
            <div  class="col-md-3">
               <div align="center" class="col-md-2" style="background-color: gray; margin-right: 2px">
               Job List
            </div>
            <div align="center" class="col-md-2" style="background-color: gray; margin-left: 2px">
               Planning
            </div>
            </div>
          </div>
          </div>


   <div></div>
   <div class="row" style=" background-color: white">
          <div class="col-md-6" style="height:180px;width:180px;margin-top: 10px; margin-left: 2px; margin-right: 35px; margin-bottom:25px; border: 1px solid black"  *ngFor="let obj of relatedVersions">
               <div style="height:30px;width:180px ; border-bottom: 1px solid black" >
                    <div align="center" class="col-md-6" style="border-right: 1px solid black; height: 30px">
                    In Scope- {{obj.inscope}}
                    </div>
                    <div align="center" class="col-md-6">
                    Summary-{{obj.count}}
                    </div>
               </div>
               <div style="height:120px; width:180px; border-bottom: 1px solid black">
               <div align="center" style="height:90px; width:180px;">
               <img alt="" src="img/message.jpg">
               </div>
               
               <div align="bottom">
                 <div align="center">{{obj.label}}</div>
               </div></div>
               <div align="bottom" style="height:30px;width:180px ;">
                  <div align="center" class="col-md-4 " style="border-right: 1px solid black; height: 30px;" ng-init="logicalDeviceList = 'logicalDeviceList.html'">
                  <a ng-click="newPage()" href="#/logicalDeviceList.html"><img  src="img/list.png"/> List</a>
                  </div>
                  <div align="center" class="col-md-4" style="border-right: 1px solid black; height: 30px;" ng-init="logicalDevices = 'logicalDevices.html'">
                 <a ng-click="newPage()" href="#/logicalDevices.html"> <img  src="img/view.png"/> View</a>
                 <a href="location.href='#/nameOfState'">Cick1111</a>
                  </div>
                  <div align="center" class="col-md-4">
                  <img alt="" src="img/plus.png"/>
                  Add
                  </div>
              </div>
          </div>
</div>
</div>

    
  `,
})
export class App {
  
  public relatedVersions=[
	  {
	      "id": "LogicalDevices",
	      "label": "LogicalDevices",
	      "count": 3,
	      "inscope":3
	    },
	    {
	      "id": "Services",
	      "label": "Services",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "Components",
	      "label": "Components",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "PhysicalDevices",
	      "label": "Physical Devices",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "LogicalNetworks",
	      "label": "Logical network",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "Clusters",
	      "label": "Clusters",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "FileSystem",
	      "label": "File Sysytem",
	      "count": 16,
	      "inscope":3
	    },
	    {
	      "id": "DeviceInterfaces",
	      "label": "Device Interfaces",
	      "count": 16,
	      "inscope":3
	    },
	    {
		      "id": "StakHolders",
		      "label": "Stak Holders",
		      "count": 16,
		      "inscope":3
		},
		{
			  "id": "InterfaceGroups",
	          "label": "Interface Groups",
			  "count": 16,
			  "inscope":3
	    },
	    {
			   "id": "ComponentsComponents",
			   "label": "Components-Components",
			   "count": 16,
			   "inscope":3
		},
		{
			 "id": "Documents",
			 "label": "Documents",
			 "count": 16,
			 "inscope":3
		},
	    {
			 "id": "Events",
			"label": "Events",
	         "count": 16,
			 "inscope":3
		},
	    {
			"id": "TodaysAudit",
			"label": "Todays Audit",
			"count": 16,
			"inscope":3
		 },
		 {
			 "id": "Planning",
			 "label": "Planning",
			 "count": 16,
			"inscope":3
		 },
  ];

     
     }
}

@NgModule({
  imports: [ BrowserModule,FormsModule,RouterModule.forRoot(appRoutes)],
  
  declarations: [ App ],
  bootstrap: [ App ]
})
export class AppModule {}