/*
Purpose: Responsible to redirect to previous history page
*/
var SlideFlag = false;

function Goback() {
    //if it was the first page
    if (history.length === 1) {
        window.location = kwStartUpPage;
    } else {
        //alert(document.referrer);
        history.back();
    }
}

function Logout() {
    window.location = kwStartUpPage;
}

function ConvetDateFormat(inputDate, format) {
    if (inputDate) {
        var date = new Date(inputDate);
        console.log("IP:" + inputDate);
        switch (format) {
            case kwDateFormateDateMonthYear:
                return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
            case kwDateFormateHourMinA:
                return (inputDate.match(/[0-9]{4}\s(.*)/)[1].replace(/:[0-9]{2}\s/, " "));
            case kwDateFormateHourMinP:
                return (inputDate.match(/-[0-9]{2}\s(.*)/)[1].replace(/:[0-9]{2}\s/, " "));
            case kwDateFormateDayMonthDate:
                return (Days[date.getDay()] + " " + Months[date.getMonth()] + " " + date.getDate());
            case kwDateFormateDayMonthDateYear:
                return (Days[date.getDay()] + " " + Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
            case kwDateFormateMonthDate:
                var ipDate = inputDate;
                ipDate = ipDate.replace(/-/g, '/');
                var date = new Date(ipDate);
                console.log(ipDate);
                return (Months[date.getMonth()] + " " + date.getDate());
            case kwDateFormateMonthDateYearTime:
                return (Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + inputDate.match(/[0-9]{4}\s(.*)/)[1].replace(/:[0-9]{2}\s/, " "));
            case kwDateFormateMonthDateYear:
                var ipDate = inputDate;
                ipDate = ipDate.replace(/-/g, '/');
                var date = new Date(ipDate);
                console.log(ipDate);
                return (Months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
            default:
                return "";
        }
    }
}

function GetStatusfromOldStatus(inputstatus) {
    if (inputstatus) {
        if (inputstatus.toLowerCase() === 'y')
            return 'Approved';
        else
            return 'Pending';
    }
}

// Transforms the schedule object to include the GroupByField element in line
function transformSchedule(schedules) {
    var elements = [];
    for (var iCnt = 0; iCnt < schedules.length; iCnt++) {
        // Formatting date time for header-date, FromDate and ToDate
        date = schedules[iCnt].FromDate;
        schedules[iCnt].GroupByFieldName = ConvetDateFormat(schedules[iCnt].FromDate, kwDateFormateDayMonthDate);
        schedules[iCnt].FromDate = ConvetDateFormat(schedules[iCnt].FromDate, kwDateFormateHourMinA);
        schedules[iCnt].ToDate = ConvetDateFormat(schedules[iCnt].ToDate, kwDateFormateHourMinA);
        // Single schedule row object created
        var obj = {
            GroupByFieldName: schedules[iCnt].GroupByFieldName, FromDate: schedules[iCnt].FromDate,
            ToDate: schedules[iCnt].ToDate, PatientFirstName: schedules[iCnt].PatientFirstName, PatientInitial: schedules[iCnt].PatientInitial,
            PatientLastName: schedules[iCnt].PatientLastName, Location: schedules[iCnt].Location, AppointmentId: schedules[iCnt].AppointmentId,
            Notes: schedules[iCnt].Notes, PhysicianId: schedules[iCnt].PhysicianId, PhysicianName: schedules[iCnt].PhysicianName,
            Reminder: schedules[iCnt].Reminder, TypeOfAppointment: schedules[iCnt].TypeOfAppointment, PatientId: schedules[iCnt].PatientId,
            showdate:date
        };
        elements.push(obj);
    }
    return elements;
}

// Removes the GroupByHeader from unwanted elements and helps ordering
function orderSchedule(newGrouping) {
    newGrouping = function (group_list, group_by, index) {
        if (index > 0) {
            prev = index - 1;
            if (group_list[prev][group_by] !== group_list[index][group_by]) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };

    return newGrouping;
}

function transformImpressionPlan(impression_plans) {
    for (var iCnt = 0; iCnt < impression_plans.length; iCnt++) {
        impression_plans[iCnt].HiddenDate = new Date(impression_plans[iCnt].Date);
        impression_plans[iCnt].Date = ConvetDateFormat(impression_plans[iCnt].Date, kwDateFormateMonthDate);
        impression_plans[iCnt].Status = GetStatusfromOldStatus(impression_plans[iCnt].Status);
    }
    return impression_plans;
}



function transformImpressionPlanDetails(impression_plan) {
    impression_plan.Date = ConvetDateFormat(impression_plan.Date, kwDateFormateMonthDateYear);
    return impression_plan;
}

function transformDocuments(documentList) {
    for (iCnt = 0; iCnt < documentList.length; iCnt++) {
        documentList[iCnt].Date = documentList[iCnt].Value[0].DocuementDate;
        documentList[iCnt].Date = ConvetDateFormat(documentList[iCnt].Date, kwDateFormateMonthDate);
        documentList[iCnt].PhysicianName = GetUserName();
        documentList[iCnt].Count = documentList[iCnt].Value.length;
        var approvedFlag = true;
        var uploadedFlag = true;
        for (jCnt = 0; jCnt < documentList[iCnt].Value.length; jCnt++) {
            documentList[iCnt].Value[jCnt].PhysicianId = GetUserId();
            documentList[iCnt].Value[jCnt].PhysicianName = GetUserName();
            if (documentList[iCnt].Value[jCnt].DocuementStatus != "Approved") {
                approvedFlag = false;
            }
            if (documentList[iCnt].Value[jCnt].DocuementStatus != "Uploaded" && documentList[iCnt].Value[jCnt].DocuementStatus != "Approved") {
                uploadedFlag = false;
            }
        }
        if (approvedFlag == true) {
            documentList[iCnt].Status = "Approved";
        }
        else if (uploadedFlag == true) {
            documentList[iCnt].Status = "Uploaded";
        }
        else {
            documentList[iCnt].Status = "Pending";
        }
    }
    return documentList;
}

function transformDocumentDetails(document) {
    var time = ConvetDateFormat(document.DocuementDate, kwDateFormateHourMinP);
    document.DocuementDate = ConvetDateFormat(document.DocuementDate, kwDateFormateMonthDateYear) + " at " + time;
    console.log("AAA");
    return document;
}

function GetAppointmentType(aptType) {
    switch (aptType)
    {
        case 2: return "On Treatment Visit";
        default: return "";
    }
}

function CalculateAge(dateOfBirth) {
    var today = new Date();
    var dateOfBirth = new Date(dateOfBirth);
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();

    var birthyear = dateOfBirth.getFullYear();
    var birthmonth = dateOfBirth.getMonth();
    var birthday = dateOfBirth.getDate();

    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;


    return parseInt(age) - 1;


}
function HandlePatientClick(htmlLi) {
    var patientId = $(htmlLi).find(".hdnPatientId").attr('id');
    SetPatientData(patientId, '', '');
    location.href = 'PatientInfo.html';
}

function HandleViewPatientClick(patientId) {
    SetPatientData(patientId, '', '');
}

function HandleSliderViewPatientClick(htmlLi) {
    SlideFlag = false;
    var patientId = $(htmlLi).find(".hdnVPatientId").attr('id');
    SetPatientData(patientId, '', '');
    location.href = 'PatientInfo.html';
}

function HandleJournalNoteClick(htmlLi) {
    var NoteId = $(htmlLi).find(".hdnNoteId").attr('id');
    SetNoteData(NoteId);
    location.href = 'View_note.html';
}

function HandleComplaintHistoryClick(htmlLi) {
    var VisitId = $(htmlLi).find(".hdnVisitId").attr('id');
    SetComplaintHistoryDataData(VisitId);
    var GroupId = $(htmlLi).find(".hdnGroupId").attr('id');
    SetGroupData(GroupId);
    location.href = 'Complaint_details.html';
}

function HandleImpressionPlanClick(htmlDiv) {
    var VisitId = $(htmlDiv).find(".hdnVisitId").attr('id');
    SetVisitData(VisitId);
    var GroupId = $(htmlDiv).find(".hdnGroupId").attr('id');
    SetGroupData(GroupId);
    location.href = 'Impression_plan_details.html';
}

function HandleDocumentClick(htmlDiv) {
    var DocumentId = $(htmlDiv).find(".hdnDocumentId").attr('id');
    SetDocumentData(DocumentId);
    location.href = 'Document_details.html';
}

function HandleScheduleClick(htmlLi) {
    if (SlideFlag == false) {
        var appointmentId = $(htmlLi).find(".hdnappointmentid").attr('id');
        SetAppointmentDataData(appointmentId);
        location.href = 'Appointment_Details.html';
    }
    SlideFlag = false;
}

function ShowAjaxLoader() {
    $("#ajax-loader").show();
}
function HideAjaxLoader() {
    $('#ajax-loader').fadeOut();
    //$("#ajax-loader").hide();
}

function transformMonthAbbreviation(shortDate) {
    var month = shortDate.substring(0, 3);
    if (month == "Sep") {
        month = "Sept";
    }
    else if (month == "Jun") {
        month = "June";
    }
    else if (month == "Jul") {
        month = "July";
    }
    shortDate = month + shortDate.substring(3);

    return shortDate;
}

function UpcomingAppointmentsImagePath(category) {
    var imgPath = "";
    switch (category) {
        case "Labs": imgPath += "flask-icon.png";
            break;
        case "Test": imgPath += "flask-icon.png";
            break;
        case "OTV": imgPath += "eye-icon.png";
            break;
        default: imgPath += "fan-icon.png";
            break;         
    }
    return imgPath
}