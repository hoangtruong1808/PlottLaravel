var baseURL = '/statistics/';

var getToDayMonth = document.querySelector('input[type="month"]');
MyDate = new Date();
let test = MyDate.getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2);
getToDayMonth.value = test;
var getTodayDefault = MyDate.getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
$('#datepickerFrom').val(getTodayDefault);
$('#datepickerTo').val(getTodayDefault);

//load current year data
var thisYear = new Date().getFullYear();

//onload default
window.onload = setTimeout(loadMonth(), 2000);

window.onload = setTimeout(loadMonthUser(), 2000);

//Choose which function will be use
$("#selectStat").on("change", function () {
    // console.log($(this).val());
    $('.test').addClass("hidden");
    $('.empty-table').addClass("hidden");
    if ($(this).val() == 'FromTo') {
        $(".type-multiple-choice").val(null).trigger('change');
        $('#pickFromTo').removeClass("hidden");
        $('.dateMonth').addClass("hidden");
        $('.export').addClass("hidden");
        $('.dateYear').addClass("hidden");
    } else if ($(this).val() == 'Month') {
        $(".type-multiple-choice").val(null).trigger('change');
        $('.dateMonth').removeClass("hidden");
        $('#pickFromTo').addClass("hidden");
        $('.export').addClass("hidden");
        $('.dateYear').addClass("hidden");
        loadMonth();
        loadMonthUser();
    } else if ($(this).val() == 'Year') {
        $(".type-multiple-choice").val(null).trigger('change');
        $('.dateYear').removeClass("hidden");
        $('.dateMonth').addClass("hidden");
        $('#pickFromTo').addClass("hidden");
        $('.export').addClass("hidden");
        if($("#datepickerYear").length >0){
            if($("#datepickerYear option[value='" + thisYear +"']").length > 0){
                $("#datepickerYear").val(thisYear).selected;
            }else{
                $("#datepickerYear option:last-child").val().selected;
            }
            loadYear();
        }
        if($("#userDatepickerYear").length > 0){
            if($("#userDatepickerYear option[value='" + thisYear +"']").length > 0){
                $("#userDatepickerYear").val(thisYear).selected;
            }else{
                $("#userDatepickerYear option:last-child").val().selected;
            }
            loadYearUser();
        }
    } else {
        $('#pickFromTo').addClass("hidden");
        $('.dateMonth').addClass("hidden");
        $('.export').addClass("hidden");
    }
});

//format number to x,xxx,xxx
// function formatNum(numberTrans) {
//     var numberTrans = String(numberTrans);
//     numberTrans = numberTrans.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return numberTrans;
// }

//formate date to dd/mm/yyyy
function formatDate(date){
    dateFormat = new Date(date);
    dd = dateFormat.getDate();
    mm = dateFormat.getMonth()+1;
    yyyy = dateFormat.getFullYear();
    if(dd<10){
        dd = '0' + dd;
    }

    if(mm < 10){
        mm = '0' + mm;
    }

    return dateFormat = dd + '/' + mm + '/' + yyyy;
}

//show datatable
function showdataTable(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(this.className)) {
        $(this.className).DataTable().destroy();
    }

    //count data column
    cnt = 1;
    table = $(this.className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        $('.test').addClass("hidden");
                        $('.export').addClass("hidden");
                        $('.empty-table').removeClass("hidden");
                        // alert("trống");
                        table.destroy();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        $('.test').removeClass("hidden");
                        $('.export').removeClass("hidden");
                        $('.empty-table').addClass("hidden");
                        const data_format = {"data": data}
                        callback(data_format);
                        // console.log(data_format);
                    }
                }
            })
        },
        columns: arrTbl,
        colReorder: true,
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api();

            var intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            totals = api.column(3)
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(3).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
            // console.log(className);
            // console.log($(className + ' thead th').length);
            for (let i = 5; i < $(className + ' thead th').length; i++) {
                totals = api.column(i)
                    .data()
                    .reduce(function (a, b) {
                        return (a) * 1 + (b) * 1;
                    }, 0);
                $(api.column(i).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
                // console.log(i);
            }

        },
        ordering : false,
        columnDefs: [
            // {
            //     targets: arrUsers,
            //     className: function(data, type, row){
            //         if(data == 0){
            //             return "dasdasd dt-body-right";
            //         }else return "noooooooooooooo dt-body-right";
            //     }
            //     // className: 'bg-warning'
            // },
            {
                targets: 0,
                render: function(data, type, row){
                    return '<span>' + cnt++ + '</span>';
                },
                className: 'dt-body-center'
            },
            {
                targets: 2,
                render: function(data, type, row){
                    // console.log(data);
                    return '<span style="color:' + data.color_type + '">' + data.name_type + '</span>';
                }
            },
            // {
            //   targets: 4,
            //   render: function(data, type, row){
            //       if(data.regime == 1){
            //           return formatNum(Math.round(data.sum_trans/ data.total));
            //       }
            //       return '';
            //   }
            // },
            {
                targets: arrUsers,
                render: function (data, type, row) {
                    if (data == 0) {
                        return '<span class="text-warning td-body-right">' + formatNum(Math.round(data)) + '</span>';
                    } else{
                        if(data < 0){
                            return "("+ formatNum(Math.round(data)) + ")";
                        }else{
                            return formatNum(Math.round(data));
                        }
                    }
                },
                className: 'dt-body-right hover dt-head-right'
            },
            {
                targets: [3, 4],
                render: function (data, type, row) {
                    if(data < 0){
                        return "("+ formatNum(Math.round(data)) + ")";
                    }else{
                        return formatNum(Math.round(data));
                    }
                },
                className: 'dt-body-right hover dt-head-right'
            },

            {
                targets: 1,
                render: function (data, type, row) {
                    // return moment(new Date(data).toString()).format('DD/MM/YYYY');
                    return formatDate(data);
                }
            },
        ],

        scrollY: "450px",
        scrollX: true,
        scrollCollapse: true,
        responsive: true,
        paging: false,
        // searching: false,
        info: false,
        fixedColumns: {
            left: 4
        },

    });
    // console.log(dataFlg);
    // console.log(table);
    // $.when(table)
}

//show datatable user
function showdataTable2(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(this.className)) {
        $(this.className).DataTable().destroy();
    }
    cnt = 1;
    table = $(this.className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        $('.test').addClass("hidden");
                        $('.export').addClass("hidden");
                        $('.empty-table').removeClass("hidden");
                        // alert("trống");
                        table.destroy();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        $('.test').removeClass('hidden');
                        $('.export').removeClass('hidden');
                        $('.empty-table').addClass("hidden");
                        const data_format = {"data": data}
                        callback(data_format);
                    }
                }
            });
        },
        columns: [
            {data: null},
            {data: "date_trans"},
            {data: null},
            {data: "sum_detail"},
            {data: "note"}
        ],
        colReorder: true,
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api();

            var intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            totals = api.column(3)
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(3).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
            // console.log(className);
            // console.log($(className + ' thead th').length);
        },
        ordering : false,
        columnDefs: [
            {
                targets: 0,
                render: function(data, type, row){
                    return '<span>' + cnt++ + '</span>';
                },
                className: 'dt-body-center'
            },
            {
                targets: 1,
                render: function (data, type, row) {
                    // return moment(new Date(data).toString()).format('DD/MM/YYYY');
                    return formatDate(data);
                }
            },
            {
                targets: 2,
                render: function(data, type, row){
                    return '<span style="color:' + data.color_type + '">' + data.name_type + '</span>';
                }
            },
            {
                targets: 3,
                render: function (data, type, row) {
                    if(data < 0){
                        return "("+ formatNum(Math.round(data)) + ")";
                    }else{
                        return formatNum(Math.round(data));
                    }
                },
                className: 'dt-body-right hover dt-head-right'
            },
            {
                targets: 4,
                render: function (data, type, row) {
                    return "<pre>" + data + "</pre>";
                }
            },
        ],

        scrollY: "450px",
        // scrollX:        true,
        scrollCollapse: true,
        responsive: true,
        paging: false,
        // searching: false,
        info: false

    });

}

//Load default
function loadMonth() {
    monthYear = $('#datepickerMonth').val();
    // getType = $('#selectType').val();
    getUrl = baseURL + 'get-month/month-year/' + monthYear;
    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }
    className = '#testDatatable';
    showdataTable(className, getUrl);
    // showdataTableBACKUP(className, getUrl);
}

function loadMonthUser() {
    monthYear = $('#userDatepickerMonth').val();
    getUrl = baseURL + 'user-month/id/' + userID + '/month-year/' + monthYear;
    // getType = $('#userSelectType').val();
    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }
    // console.log(getUrl);
    className = '#userDatatable';
    showdataTable2(className, getUrl);
}

function loadYear() {
    getYear = $('#datepickerYear').val();
    // getType = $('#selectType').val();
    getUrl = baseURL + 'get-year/year/' + getYear;
    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }
    className = '#testDatatable';
    showdataTable(className, getUrl);
}

function loadYearUser() {
    // console.log("tu chay ne");
    getYear = $('#userDatepickerYear').val();
    // console.log(getYear);
    // getType = $('#userSelectType').val();
    getUrl = baseURL + 'user-year/id/' + userID + '/year/' + getYear;

    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }
    className = '#userDatatable';
    showdataTable2(className, getUrl);
}

$("#datepickerTo").attr('min', $("#datepickerFrom").val());

//dateTo is min of dateFrom & hide export button
$("#datepickerFrom").on("change", function () {
    $("#datepickerTo").attr('min', $("#datepickerFrom").val());
    $(".export").addClass("hidden");
});

//hide export button when change date to
$("#datepickerTo").on("change", function(){
    $(".export").addClass("hidden");
})

//get list of transaction detail from date A to date B
$("#checkDate").on("click", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    // console.log("sadasd");
    $(".export").addClass("hidden");
    dateFrom = $("#datepickerFrom").val();
    dateTo = $("#datepickerTo").val();
    // getType = $("#selectType").val();
    getUrl = baseURL + 'get-date/from/' + dateFrom + '/to/' + dateTo;

    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }
    className = '#testDatatable';
    showdataTable(className, getUrl);
});

//get list of transaction detail by month datatables
$("#datepickerMonth").on("change", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    $(".export").addClass("hidden");
    selected = $(this).val();
    // getType = $("#selectType").val();
    getUrl = baseURL + 'get-month/month-year/' + selected;

    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }

    className = '#testDatatable';
    showdataTable(className, getUrl);
    // showdataTableBACKUP(className, getUrl);
});

//get list of transaction detail by chosen year
$("#datepickerYear").on("change", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    $(".export").addClass("hidden");
    selected = $(this).val();
    // getType = $("#selectType").val();
    getUrl = baseURL + 'get-year/year/' + selected;

    // if(getType != ''){
    //     getUrl += '/type/' + getType;
    // }

    className = '#testDatatable';
    showdataTable(className, getUrl);
    // showdataTableBACKUP(className, getUrl);
});

//export to excel file
$("#exportExcel").on("click", function (e) {
    monthYear = $("#datepickerMonth").val();
    dateFrom = $("#datepickerFrom").val();
    dateTo = $("#datepickerTo").val();
    year = $("#datepickerYear").val();
    selected = $("#selectStat option:selected").val();
    // getType = $("#selectType").val();
    url = baseURL;
    $("#exportExcel").css('background-color', '#28A745');

    if (selected == 'Month') {
        url +='export-excel/month-year/' + monthYear;
        // console.log(url);
    } else if (selected == 'FromTo') {
        url +='export-excel/from/' + dateFrom + '/to/' + dateTo;
        // console.log(url);
    } else if (selected == 'Year') {
        url +='export-excel-multi/year/' + year;
    }
    // if(getType != ''){
    //     url+= '/type/' + getType;
    // }
    if(filter != ''){
        url += '/filter/' + filter;
    }
    window.location.href = url;
});

//user export to excel file
$("#userExportExcel").on("click", function (e) {
    monthYear = $("#userDatepickerMonth").val();
    dateFrom = $("#datepickerFrom").val();
    dateTo = $("#datepickerTo").val();
    year = $("#userDatepickerYear").val();
    // getType = $("#userSelectType").val();
    selected = $("#selectStat option:selected").val();
    getTypes = $('select[name="states[]"]').val();
    filter = '';

    $.each(getTypes, function (key, value){
        if(filter == ''){
            filter += value;
        }else{
            filter += "+" + value;
        }
    });
    // console.log();
    if (selected == 'Month') {
        url = baseURL + 'user-export-excel/id/' + userID + '/month-year/' + monthYear;
        // console.log(url);
    } else if (selected == 'FromTo') {
        url = baseURL + 'user-export-excel/id/' + userID + '/from/' + dateFrom + '/to/' + dateTo;
        // console.log(url);
    } else if (selected == 'Year') {
        url = baseURL + 'user-export-excel-multi/id/' + userID + '/year/' + year;
        // console.log(url);
    }
    if(filter != ''){
        url += '/filter/' + filter;
    }
    window.location.href = url;
});

//user get list of transaction detail by month datatables
$("#userDatepickerMonth").on("change", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    // console.log("changeeeeeeeeeeeee");
    $(".export").addClass("hidden");
    var selected = $(this).val();
    var getUrl = baseURL + 'user-month/id/' + userID + '/month-year/' + selected;

    className = '#userDatatable';
    showdataTable2(className, getUrl);
});

//user get list of transaction detail from date A to date B
$("#userCheckDate").on("click", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    // console.log("asdasdasdas");
    $(".export").addClass("hidden");
    dateFrom = $("#datepickerFrom").val();
    dateTo = $("#datepickerTo").val();
    getType = $("#userSelectType").val();
    getUrl = baseURL + 'user-get-date/id/' + userID + '/from/' + dateFrom + '/to/' + dateTo;

    if(getType != ''){
        getUrl += '/type/' + getType;
    }
    className = '#userDatatable';
    showdataTable2(className, getUrl);
});

//user get list of transaction detail of chosen year
$("#userDatepickerYear").on("change", function () {
    $(".type-multiple-choice").val(null).trigger('change');
    $(".export").addClass("hidden");
    var selected = $(this).val();
    var getUrl = baseURL + 'user-year/id/' + userID + '/year/' + selected;

    className = '#userDatatable';
    showdataTable2(className, getUrl);
});

$("#users").on("change", function(){
    // console.log(userID);
    // console.log("asdasdasdads");
    $(".type-multiple-choice").val(null).trigger('change');
   value = $(this).val();
   month = $('#userDatepickerMonth').val();
   year = $("#userDatepickerYear").val();
   userID = value;
   // console.log(userID);
   className = '#userDatatable';

   if(!$('.dateMonth').hasClass('hidden')){
       getUrl = baseURL + 'user-month/id/' + userID + '/month-year/' + month;
       // console.log(getUrl);
   }else if(!$('.dateYear').hasClass('hidden')){
       getUrl = baseURL + 'user-year/id/' + userID + '/year/' + year;
       // console.log(getUrl);
   }
    // if(getType != ''){
    //     getUrl+= '/type/' + getType;
    // }
    showdataTable2(className, getUrl);
});

//select type to show
// $("#selectType").on("change", function(){
//     $('.export').addClass("hidden");
//     getType = $(this).val();
//     // console.log(getType);
//     month = $("#datepickerMonth").val();
//     year = $("#datepickerYear").val()
//     className = '#testDatatable';
//
//     if(!$('.dateMonth').hasClass('hidden')){
//         getUrl = baseURL + 'get-month/month-year/' + month + '/type/' + getType ;
//         showdataTable(className, getUrl);
//     }else if(!$('.dateYear').hasClass('hidden')){
//         getUrl = baseURL + 'get-year/year/' + year + '/type/' + getType;
//         showdataTable(className, getUrl);
//     }
//
// });

//select type to show for personal user
// $("#userSelectType").on("change", function(){
//     $('.export').addClass("hidden");
//     getType = $(this).val();
//     // console.log(getType);
//     month = $("#userDatepickerMonth").val();
//     year = $("#userDatepickerYear").val()
//
//     if(typeof $("#users").val() !== 'undefined'){
//         userID = $("#users").val();
//     }
//     className = '#userDatatable';
//
//     if(!$('.dateMonth').hasClass('hidden')){
//         getUrl = baseURL + 'user-month/id/' + userID + '/month-year/' + month + '/type/' + getType ;
//         // console.log(getUrl);
//         showdataTable2(className, getUrl);
//     }else if(!$('.dateYear').hasClass('hidden')){
//         getUrl = baseURL + 'user-year/id/' + userID + '/year/' + year + '/type/' + getType;
//         // console.log(getUrl);
//         showdataTable2(className, getUrl);
//     }
//
// });

$('#type-filter').on("click", function(){
    $('.export').addClass("hidden");
    getTypes = $('select[name="states[]"]').val();
    // console.log(getType);
    month = $("#datepickerMonth").val();
    year = $("#datepickerYear").val();
    dateFrom = $("#datepickerFrom").val();
    dateTo = $("#datepickerTo").val();
    className = '#testDatatable';
    filter = '';

    $.each(getTypes, function (key, value){
       if(filter == ''){
           filter += value;
       }else{
           filter += "+" + value;
       }
    });
    // console.log(filter);
    if(!$('.dateMonth').hasClass('hidden')){
        getUrl = baseURL + 'get-month/month-year/' + month + '/filter/' + filter;
    }else if(!$('.dateYear').hasClass('hidden')){
        getUrl = baseURL + 'get-year/year/' + year + '/filter/' + filter;
    }else if(!$('#pickFromTo').hasClass('hidden')){
        getUrl = baseURL + 'get-date/from/' + dateFrom + '/to/' + dateTo + '/filter/' + filter;
    }
    showdataTable(className, getUrl);

})

$('#user-type-filter').on("click", function(){
    console.log("bro");
    $('.export').addClass("hidden");
    getTypes = $('select[name="states[]"]').val();
    // console.log(getType);
    month = $("#userDatepickerMonth").val();
    year = $("#userDatepickerYear").val();
    dateFrom = $("#userDatepickerFrom").val();
    dateTo = $("#userDatepickerTo").val();
    className = '#userDatatable';
    filter = '';

    $.each(getTypes, function (key, value){
        if(filter == ''){
            filter += value;
        }else{
            filter += "+" + value;
        }
    });
    // console.log(filter);
    if(!$('.dateMonth').hasClass('hidden')){
        getUrl = baseURL + 'user-month/id/' + userID + '/month-year/' + month + '/filter/' + filter;
    }else if(!$('.dateYear').hasClass('hidden')){
        getUrl = baseURL + 'user-year/id/' + userID + '/year/' + year + '/filter/' + filter;
    }else if(!$('#pickFromTo').hasClass('hidden')){
        getUrl = baseURL + 'user-get-date/id/' + userID + '/from/' + dateFrom + '/to/' + dateTo + '/filter/' + filter;
    }
    showdataTable2(className, getUrl);

})

//show datatable
function showdataTableBACKUP(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(this.className)) {
        $(this.className).DataTable().destroy();
    }

    //count data column
    cnt = 1;
    table = $(this.className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        $('.test').addClass("hidden");
                        $('.export').addClass("hidden");
                        $('.empty-table').removeClass("hidden");
                        // alert("trống");
                        table.destroy();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        $('.test').removeClass("hidden");
                        $('.export').removeClass("hidden");
                        $('.empty-table').addClass("hidden");
                        const data_format = {"data": data}
                        callback(data_format);
                        // console.log(data_format);
                    }
                }
            })
        },
        columns: arrTbl,
        ordering : false,
        // colReorder: true,
        scrollY: "450px",
        scrollX: true,
        scrollCollapse: true,
        responsive: true,
        paging: false,
        // searching: false,
        info: false,
        fixedColumns: {
            left: 4
        },
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api();

            var intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            totals = api.column(3)
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(3).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
            // console.log(className);
            // console.log($(className + ' thead th').length);
            for (let i = 5; i < $(className + ' thead th').length; i++) {
                totals = api.column(i)
                    .data()
                    .reduce(function (a, b) {
                        return (a) * 1 + (b) * 1;
                    }, 0);
                $(api.column(i).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
                // console.log(i);
            }

        },

        columnDefs: [
            // {
            //     targets: arrUsers,
            //     className: function(data, type, row){
            //         if(data == 0){
            //             return "dasdasd dt-body-right";
            //         }else return "noooooooooooooo dt-body-right";
            //     }
            //     // className: 'bg-warning'
            // },
            {
                targets: 0,
                render: function(data, type, row){
                    return '<span>' + cnt++ + '</span>';
                },
                className: 'dt-body-center'
            },
            {
                targets: 2,
                render: function(data, type, row){
                    // console.log(data);
                    return '<span style="color:' + data.color_type + '">' + data.name_type + '</span>';
                }
            },
            // {
            //   targets: 4,
            //   render: function(data, type, row){
            //       if(data.regime == 1){
            //           return formatNum(Math.round(data.sum_trans/ data.total));
            //       }
            //       return '';
            //   }
            // },
            {
                targets: arrUsers,
                render: function (data, type, row) {
                    if (data == 0) {
                        return '<span class="text-warning td-body-right">' + formatNum(Math.round(data)) + '</span>';
                    } else return formatNum(Math.round(data));
                },
                className: 'dt-body-right hover dt-head-right'
            },
            {
                targets: [3, 4],
                render: function (data, type, row) {
                    return formatNum(Math.round(data));
                },
                className: 'dt-body-right hover dt-head-right'
            },

            {
                targets: 1,
                render: function (data, type, row) {
                    // return moment(new Date(data).toString()).format('DD/MM/YYYY');
                    return formatDate(data);
                }
            },
        ],

    });
    // console.log(dataFlg);
    // console.log(table);
    // $.when(table)
}
