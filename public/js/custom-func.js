//format number to x,xxx,xxx
function formatNum(numberTrans) {
    var numberTransString = String(Math.abs(numberTrans));
    numberTransString = numberTransString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if(numberTrans < 0){
        numberTransString = "(" + numberTransString + ")";
    }
    return numberTransString;
}
function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatCurrency(input) {
    // get input value
    var input_val = input.val() ;
    // don't validate empty input
    if (input_val === "") { return; }
    // original length
    var original_len = input_val.length;
    // initial caret position
    var caret_pos = input.prop("selectionStart");
    // check for decimal

    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");
        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);
        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);
        // join number by .
        input_val = left_side + "." + right_side;
    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        // let input_val_number = input_val.replace(',','');
        // if(input_val_number < 1000 && isCompleteX1000){
        //     input_val = input_val_number*1000 +'';
        // }
        // let valueTran = input_val+'000';
        // valueTran = formatNumber(valueTran);
        // valueSumtran = valueTran;
        input_val = formatNumber(input_val);
        // input_val = input_val;
        // final formatting
        // console.log('ádas');
        // console.log(valueSumtran);
    }
    // if(input_val.length == '1'){
    //     input_val = input_val + '000';
    // }else{
    //     input_val = input_val + '0';
    // }
    // send updated string to input
    // if(isCompleteX1000){
    //     return input.val(input_val);
    // }
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}
//format date from yyyy-mm-dd to dd/mm/yyyy
function formatDate(date){
    let dateFormat = new Date(date);
    let dd = dateFormat.getDate();
    let mm = dateFormat.getMonth()+1;
    let yyyy = dateFormat.getFullYear();
    if(dd<10){
        dd = '0' + dd;
    }

    if(mm < 10){
        mm = '0' + mm;
    }

    return dateFormat = dd + '/' + mm + '/' + yyyy;
}

//format date from dd/mm/yyyy to yyyy-mm-dd
function formatDateReverse(date){
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
}

function formatURL(userID = null, dateRange = null, year = null, month = null, selected = null, export_excel = null){
    // console.log(dateRange);
    let url = statsURL;
    let action;
    let params;
    if(month != null){
        monthYear = month.replace('/','-');
    }
    if(dateRange != '' && dateRange != null){
        dateRange = dateRange.split("-");
        dateFrom = dateRange[0].replaceAll(' ', '');
        dateTo = dateRange[1].replaceAll(' ', '');
    }

    if(selected == 'Month'){
        params = monthYear;
    }else if(selected == 'FromTo'){
        params = dateFrom.replaceAll('/','-') + '/to/' + dateTo.replaceAll('/','-');
    }else if(selected == 'Year'){
        params = year;
    }

    if(userID == ''){
        if(export_excel != null){
            if(selected == 'Month'){
                action = 'export-excel/month-year/';
            }else if(selected == 'FromTo'){
                action = 'export-excel/from/';
            }else if(selected == 'Year'){
                action = 'export-excel-multi/year/';
            }
        }else{
            if(selected == 'Month'){
                action = 'get-month/month-year/';
            }else if(selected == 'FromTo'){
                action = 'get-date/from/';
            }else if(selected == 'Year'){
                action = 'get-year/year/';
            }
        }
    }else{
        userID = "id/" + userID + '/';
        if(export_excel != null){
            if(selected == 'Month'){
                action = 'user-export-excel/' + userID + 'month-year/';
            }else if(selected == 'FromTo'){
                action = 'user-export-excel/' + userID + 'from/';
            }else if(selected == 'Year'){
                action = 'user-export-excel-multi/' + userID + 'year/';
            }
        }else{
            if(selected == 'Month'){
                action = 'user-month/' + userID + 'month-year/';
            }else if(selected == 'FromTo'){
                action = 'user-get-date/' + userID + 'from/';
            }else if(selected == 'Year'){
                action = 'user-year/' + userID + 'year/';
            }
        }
    }
    url += action + params;
    return url;
}

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function (date) {
        date = date.replace(" ", "");

        if (!date) {
            return 0;
        }

        var year;
        var eu_date = date.split(/[\.\-\/]/);

        /*year (optional)*/
        if (eu_date[2]) {
            year = eu_date[2];
        } else {
            year = 0;
        }

        /*month*/
        var month = eu_date[1];
        if (month.length == 1) {
            month = 0 + month;
        }

        /*day*/
        var day = eu_date[0];
        if (day.length == 1) {
            day = 0 + day;
        }

        return (year + month + day) * 1;
    },

    "date-eu-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-eu-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

let patternPhone = "^[0-9]{10}$";
let patternMail = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
// let patternFullname = "(?=^.{4,40}$)^[a-zA-Z-]+\\s[a-zA-Z-]+$";
let patternFullname = "^[^0-9]{4,}(?:[^0-9]+)?(?: [^0-9]+)?$";
let patternUsername = "^[a-zA-Z]{4,}(?:[a-zA-Z0-9]+)?(?:[a-zA-Z0-9]+)?$";
let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
let weakRegex = new RegExp("^[A-Za-z0-9]{1,8}$");
let patternFile = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG)$";

function checkFullname(fullname){
    let substrRegex;
    substrRegex = new RegExp(patternFullname);
    return substrRegex.test(fullname);
}
function checkPhone(phone){
    let substrRegex;
    substrRegex = new RegExp(patternPhone);
    return substrRegex.test(phone);
}
function checkMail(mail){
    let substrRegex;
    substrRegex = new RegExp(patternMail);
    return substrRegex.test(mail);
}
function checkFile(file){
    let substrRegex;
    substrRegex = new RegExp(patternFile);
    return substrRegex.test(file);
}
function checkUsername(username){
    let substrRegex;
    substrRegex = new RegExp(patternUsername);
    return substrRegex.test(username);
}