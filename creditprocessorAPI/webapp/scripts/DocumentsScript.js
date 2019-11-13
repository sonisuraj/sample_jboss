function ShowOrHide(elementId) {
    var dropdownId = "dropdownMenu" + elementId;
    var dropdownImageId = "dropdownMenuImage" + elementId;
    var groupCount = document.getElementsByClassName("groupCount").length;
    console.log(groupCount);
    if (document.getElementById(dropdownId).style.display == 'none') {
        document.getElementById(dropdownId).style.display = 'inline';
        document.getElementById(dropdownImageId).src = "../images/documents/less.png";
        for (var iCnt = 0; iCnt < groupCount; iCnt++)
        {
            if (iCnt != elementId)
            {
                document.getElementById("dropdownMenu" + iCnt).style.display = 'none';
                document.getElementById("dropdownMenuImage" + iCnt).src = "../images/documents/more.png";
            }
        }
    }
    else {
        document.getElementById(dropdownId).style.display = 'none';
        document.getElementById(dropdownImageId).src = "../images/documents/more.png";
    }
}