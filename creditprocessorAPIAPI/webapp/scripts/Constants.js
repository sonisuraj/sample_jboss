﻿//var serverURL = "http://localhost:1167/RestService.svc/";//
//var serverURL = "http://54.200.156.25/PhysicianMobileApp/RestService.svc/";
var serverURL = "http://172.31.3.12/PhysicianMobileApp/RestService.svc/";
var GetRecentPatients = serverURL + "Physician/{0}/{1}/RecentPatients";
var GetSchedulesUrl = serverURL + "Physician/{0}/{1}/Appointments";
var GetScheduleDetailsUrl = serverURL + "Physician/{0}/{1}/Appointments/AppointmentId/{2}";
var GetDataURL = serverURL + "Physician/GetData";
var loginDataURL = serverURL + "login";
var insertImpressionPlan = serverURL + "Physician/ImpressionPlan";
var GetPatientsDetailsUrl = serverURL + "Physician/{0}/Patients/{1}";
var GetJournal = serverURL + "Physician/{0}/JournalPatient/{1}";
var GetComplaintHisory = serverURL + "Physician/{0}/CoplaintPatient/{1}";
var GetComplaintHisoryDetails = serverURL + "Physician/{0}/CoplaintPatient/{1}/ComplaintHistoryId/{2}/{3}";
var GetJournalViewNote = serverURL + "Physician/{0}/JournalPatient/{1}/NoteId/{2}";
var GetQuickNoteTypeUrl = serverURL + "Physician/QuickNoteType";
var InsertJournalUrl = serverURL + "Physician/Journal";
var GetDocumentsUrl = serverURL + "Physician/{0}/Patients/{1}/Documents";
var InsertComplaintHistorylUrl = serverURL + "Physician/ComplaintHistory";
var APIKEY = "VBHqrownP2eXKqzb3fVE";
var GetImpressionPlansUrl = serverURL + "Patients/{0}/ImpressionPlans";
var GetImpressionPlanDetailsUrl = serverURL + "Patients/{0}/ImpressionPlans/{1}/{2}";
var GetDocumentsUrl = serverURL + "Physician/{0}/Patients/{1}/Documents";
var GetDocumentDetailsUrl = serverURL + "Physician/{0}/Patients/{1}/Documents/{2}";

/*Constant Keywords with prefix kw*/
var kwStartUpPage = "../index.html";
var kwLoginName = "LoginName";
var kwPassword = "Password";
var kwApi_Key = 'api_key';
var kwAuthKey = "authKey";
var kwUserId = "UserId";
var kwInstituteId = "InstituteId";
var kwDeviceReady = "deviceready";
var kwLastRequestCall = "LastRequestCall";
var kwOncologyDepartment = "OncologyDepartment";
var kwUserName = "UserName";
var kwPatientId = "PatientId";
var kwNoteId = "NoteId";
var kwVisitId = "VisitId";
var kwGroupId = "GroupId";
var kwAppointmentId = "AppointmentId";
var kwDocumentId = "Document";
var kwPatientName = "PatientName";
var kwPatientUrl = "PatientUrl";
var kwDateFormateDayMonthDate = "E MMN d";
var kwDateFormateHourMinA = "H:mm a";
var kwDateFormateHourMinP = "H:mm p"
var kwDateFormateDateMonthYear = "dd-mm-YYYY";
var kwDateFormateDayMonthDateYear = "E MMN d, YYYY";
var kwDateFormateMonthDateYear = "MMM d, YYYY";
var kwDateFormateMonthDate = "MMM d";
var kwDateFormateMonthDateYearTime = "MMM d,YYYY H:mm a";
var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
