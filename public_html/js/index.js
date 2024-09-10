/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90932042|-31949219672915182|90962310";

$('#sturollnum').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getStudentRNumAsJsonObj(){
    var sturollnum = $('#sturollnum').val();
    var jsonStr = {
        rollnum:sturollnum
    };
    return JSON.stringify(jsonStr);    
}


function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#stuname').val(record.name);
    $('#stuclass').val(record.class);
    $('#stubirthdate').val(record.stubirthdate);
    $('#stuaddress').val(record.stuaddress);
    $('#stuenrolldate').val(record.stuenrolldate);  
}

//sturollnum, stuname,stuclass,stubirthdate,stuaddress,stuenrolldate
function resetForm() {
    $('#sturollnum').val("");
    $('#stuname').val("");
    $('#stuclass').val("");
    $('#stubirthdate').val('');
    $('#stuaddress').val('');
    $('#stuenrolldate').val("");
    $('#sturollnum').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#sturollnum').focus();
}

function validateStudentData() {
    var sturollnum, stuname, stuclass, stubirthdate, stuaddress, stuenrolldate;

    sturollnum = $('#sturollnum').val();
    stuname = $('#stuname').val();
    stuclass = $('#stuclass').val();
    stubirthdate = $('#stubirthdate').val();
    stuaddress = $('#stuaddress').val();
    stuenrolldate = $('#stuenrolldate').val();

    if (sturollnum === '') {
        alert("Student Roll Number Missing");
        $("#sturollnum").focus(); //putting focus back to sturollnum, the cursor will go to sturollnum till you enter some stuaddressta
        return "";
    }
    if (stuname === "") {
        alert("Student Name Missing");
        $("#stuname").focus();
        return "";
    }
    if (stuclass === "") {
        alert("Student class Missing");
        $("#stuclass").focus();
        return "";
    }
    if (stubirthdate === "") {
        alert("Student Birth Date Missing");
        $("#stubirthdate").focus();
        return "";
    }
    if (stuaddress === "") {
        alert("Student Address Missing");
        $("#stuaddress").focus();
        return "";
    }
    if (stuenrolldate === "") {
        alert("Student Enrollment Date Missing");
        $("#stuenrolldate").focus();
        return "";
    }

    var jsonStrObj = {
        rollnum: sturollnum,
        name: stuname,
        class: stuclass,
        stubirthdate: stubirthdate,
        stuaddress: stuaddress,
        stuenrolldate: stuenrolldate
    };
    return JSON.stringify(jsonStrObj);
}

function changeData() {
    $('#change').prop("disabled", true);
    jsonChg = validateStudentData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false}); // turn-off multithreading
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#sturollnum').focus();
}

function getStudent() {
    var StudentIdJsonObj = getStudentRNumAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, StudentIdJsonObj);
    jQuery.ajaxSetup({async: false}); // turn-off multithreading
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#stuname').focus();
    }
    else if(resJsonObj.status === 200){
        $('#sturollnum').prop("disabled", true);
        fillData(resJsonObj);
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#stuname').focus();
    }
}

function saveData() {
    var jsonStrObj = validateStudentData();
    if (jsonStrObj === '') {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName); 
    jQuery.ajaxSetup({async: false}); // turn-off multithreading
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#sturollnum').focus();
}