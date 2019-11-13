document.addEventListener(kwDeviceReady, onDeviceReady, false);

function onDeviceReady() {

}

function ClearLocalStorage()
{
    var loginName = GetLoginName();
    var password = GetPassword();
    window.localStorage.clear();
    SetLoginDetails(loginName, password);
}

function GetAuthKey()
{
    var value = window.localStorage.getItem(kwAuthKey);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetUserId() {
    var value = window.localStorage.getItem(kwUserId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetInstituteId() {
    var value = window.localStorage.getItem(kwInstituteId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetOncologyDepartment() {
    var value = window.localStorage.getItem(kwOncologyDepartment);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetUserName() {
    var value = window.localStorage.getItem(kwUserName);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetLoginName() {
    var value = window.localStorage.getItem(kwLoginName);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetPassword() {
    var value = window.localStorage.getItem(kwPassword);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function SetLoginDetails(loginName, password) {
    window.localStorage.setItem(kwLoginName, loginName);
    window.localStorage.setItem(kwPassword, password);
}

function SetAuthKey(value)
{
    window.localStorage.setItem(kwAuthKey, value.AppKey);
    window.localStorage.setItem(kwUserId, value.UserId);
    window.localStorage.setItem(kwInstituteId, value.InstituteId);
    window.localStorage.setItem(kwOncologyDepartment, value.OncologyDepartment);
    window.localStorage.setItem(kwUserName, value.UserName);    
}

function SetPatientData(patientId,name,url)
{
    window.localStorage.setItem(kwPatientId, patientId);
    window.localStorage.setItem(kwPatientName, name);
    window.localStorage.setItem(kwPatientUrl, url);
}

function SetNoteData(noteId) {
    window.localStorage.setItem(kwNoteId, noteId);
}

function SetComplaintHistoryDataData(visitId) {
    window.localStorage.setItem(kwVisitId, visitId);
}

function SetAppointmentDataData(appointmentIdId) {
    window.localStorage.setItem(kwAppointmentId, appointmentIdId);
}

function SetVisitData(visitId) {
    window.localStorage.setItem(kwVisitId, visitId);
}

function SetGroupData(groupId) {
    window.localStorage.setItem(kwGroupId, groupId);
}

function SetDocumentData(documentId) {
    window.localStorage.setItem(kwDocumentId, documentId);
}

function GetNoteId() {
    var value = window.localStorage.getItem(kwNoteId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetVisitd() {
    var value = window.localStorage.getItem(kwVisitId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetGroupId() {
    var value = window.localStorage.getItem(kwGroupId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetAppointmentId() {
    var value = window.localStorage.getItem(kwAppointmentId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetVisitId() {
    var value = window.localStorage.getItem(kwVisitId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetDocumentId() {
    var value = window.localStorage.getItem(kwDocumentId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetPatientId() {
    var value = window.localStorage.getItem(kwPatientId);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetPatientName() {
    var value = window.localStorage.getItem(kwPatientName);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetPatientUrl() {
    var value = window.localStorage.getItem(kwPatientUrl);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function GetLastRequestCall()
{
    var value = window.localStorage.getItem(kwLastRequestCall);
    if (value === undefined || value === null)
        return '';
    else
        return value;
}

function SetLastRequestCall()
{
    window.localStorage.setItem(kwLastRequestCall, new Date().toUTCString());    
}

function IsValidSession()
{
    var currentDate = new Date().toUTCString();
    var lastCallDate = GetLastRequestCall();
    var timediff = (Date.parse(currentDate) - Date.parse(lastCallDate));
    var minDiff = Math.round(timediff / 60000);
    
    if (minDiff >= 15)
        return false;

    return true;
}


