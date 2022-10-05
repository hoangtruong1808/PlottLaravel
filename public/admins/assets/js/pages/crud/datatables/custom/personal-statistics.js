let statsURL = baseURL + 'statistics/';

// var getToDayMonth = document.querySelector('input[type="month"]');
MyDate = new Date();
let test = ('0' + (new Date().getMonth() + 1)).slice(-2) +'/' + MyDate.getFullYear();
// getToDayMonth.value = test;
// var getTodayDefault = MyDate.getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
let getTodayDefault = ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
let getThisMonthDefault = ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
let arrows;
if (KTUtil.isRTL()) {
    arrows = {
        leftArrow: '<i class="la la-angle-right"></i>',
        rightArrow: '<i class="la la-angle-left"></i>'
    }
} else {
    arrows = {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
    }
}
let id_table = "#datatable-content";
let id_export_excel = "#exportExcel";

let monthYear;
let dateFrom;
let dateTo;
let getUrl;
let className;
// let getTypes;

//load current year data
let thisYear = new Date().getFullYear();



$(document).ready(function(){
    $.fn.datepicker.dates['ct'] = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: [
            arrData['JAN'],
            arrData['FEB'],
            arrData['MAR'],
            arrData['APR'],
            arrData['MAY'],
            arrData['JUN'],
            arrData['JUL'],
            arrData['AUG'],
            arrData['SEP'],
            arrData['OCT'],
            arrData['NOV'],
            arrData['DEC']
        ],
        monthsShort: [
            arrData['S_JAN'],
            arrData['S_FEB'],
            arrData['S_MAR'],
            arrData['S_APR'],
            arrData['S_MAY'],
            arrData['S_JUN'],
            arrData['S_JUL'],
            arrData['S_AUG'],
            arrData['S_SEP'],
            arrData['S_OCT'],
            arrData['S_NOV'],
            arrData['S_DEC']
        ],
        // today: "Today",
        // clear: "Clear",
        // format: "mm/dd/yyyy",
        titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
        // weekStart: 0
    };

    $('#datepickerMonth').on("focusout", function(e){
        if($(this).val() == ''){
            $(this).val(getThisMonthDefault);
        }
    })

    // Month
    $('#datepickerMonth').datepicker({
        rtl: KTUtil.isRTL(),
        language: 'ct',
        // todayHighlight: true,
        changeMonth: true,
        changeYear: true,
        startView: "months",
        minViewMode: "months",
        orientation: "bottom left",
        templates: arrows,
        format: 'mm/yyyy',
        startDate: moment(first_trans_date)._d,
        endDate: "0m",
        // setDate: "04/2020"
    });

    //select2
    $(".type-multiple-choice").select2({
        data: getTypeFilters,
        placeholder: {
            id: '-1',
            text: arrData['filter_search'],
        },
        language: {
            noResults: function () {
                return arrData['no_data'];
            },
        },
        templateResult : function(states){
            // states.id = states.id_type;
            // states.text = states.name_type;
            // console.log(states.color_type);
            var $state = $(
                '<span style="color:' + states.color_type + '">' + states.text + '</span>'
            );
            return $state;
        },

        templateSelection : function(states){
            // console.log(states);
            $state = $(
                '<span style="color:' + states.color_type + '">' + states.text + '</span>'
            );
            return $state;
        }
    });

    $("#statistics-range").val(getTodayDefault +' - ' + getTodayDefault);
    // $('#datepickerFrom').val(getTodayDefault);
    // $('#datepickerTo').val(getTodayDefault);
    $(".type-filter").html($("#selectStat option:selected").text());
    if($("#datepickerMonth").val() == ''){
        $("#datepickerMonth").val(getThisMonthDefault);
    }
    $(".content-filter").html($("#datepickerMonth").val());
    $(".user-filter").html($("#users option:selected").text());

    setTimeout(loadMonth(), 2000);
    // setTimeout(loadMonthUser(), 2000);

})

// Choose which function will be use
$("#selectStat").on("change", function () {
    // console.log($(this).val());
    $('.test').attr("hidden");
    $('.empty-table').attr("hidden",true);
    if ($(this).val() == 'FromTo') {
        // $(".type-multiple-choice").val(null).trigger('change');
        $('#pickFromTo').removeAttr("hidden");
        $('.dateMonth').attr("hidden",true);
        $('.export').attr("hidden",true);
        $('.dateYear').attr("hidden",true);
        $(".type-filter").html($("#selectStat option:selected").text());
        $(".content-filter").html($("#statistics-range").val());
        loadDay();
        // loadDayUser();
    } else if ($(this).val() == 'Month') {
        // $(".type-multiple-choice").val(null).trigger('change');
        $('.dateMonth').removeAttr("hidden");
        $('#pickFromTo').attr("hidden",true);
        $('.export').attr("hidden",true);
        $('.dateYear').attr("hidden",true);
        $(".type-filter").html($("#selectStat option:selected").text());
        $(".content-filter").html($("#datepickerMonth").val());
        loadMonth();
        // loadMonthUser();
    } else if ($(this).val() == 'Year') {
        // $(".type-multiple-choice").val(null).trigger('change');
        $('.dateYear').removeAttr("hidden");
        $('.dateMonth').attr("hidden",true);
        $('#pickFromTo').attr("hidden",true);
        $('.export').attr("hidden",true);
        $(".type-filter").html($("#selectStat option:selected").text());
        if($("#datepickerYear").length >0){
            if($("#datepickerYear option[value='" + thisYear +"']").length > 0){
                $("#datepickerYear").val(thisYear).selected;
            }else{
                $("#datepickerYear option:last-child").val().selected;
            }
            $(".content-filter").html($("#datepickerYear").val());
            loadYear();
        }
        // if($("#userDatepickerYear").length > 0){
        //     if($("#userDatepickerYear option[value='" + thisYear +"']").length > 0){
        //         $("#userDatepickerYear").val(thisYear).selected;
        //     }else{
        //         $("#userDatepickerYear option:last-child").val().selected;
        //     }
        //     loadYearUser();
        // }
    } else {
        $('#pickFromTo').attr("hidden",true);
        $('.dateMonth').attr("hidden",true);
        $('.export').attr("hidden",true);
    }
});


// //format number to x,xxx,xxx
// function formatNum(numberTrans) {
//     var numberTrans = String(numberTrans);
//     numberTrans = numberTrans.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return numberTrans;
// }
//
// //format date to dd/mm/yyyy
// function formatDate(date){
//     dateFormat = new Date(date);
//     dd = dateFormat.getDate();
//     mm = dateFormat.getMonth()+1;
//     yyyy = dateFormat.getFullYear();
//     if(dd<10){
//         dd = '0' + dd;
//     }
//
//     if(mm < 10){
//         mm = '0' + mm;
//     }
//
//     return dateFormat = dd + '/' + mm + '/' + yyyy;
// }

//get filter
function addFilter(getTypes){
    let url = '';
    let filter ='';
    $.each(getTypes, function (key, value){
        if(filter == ''){
            filter += value;
        }else{
            filter += "+" + value;
        }
    });
    if(filter != ''){
        url += '/filter/' + filter;
    }
    return url;
}

//show datatable user
function showdataTable(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(className)) {
        $(className).DataTable().destroy();
    }
    // cnt = 1;
    // console.log(className, getUrl);
    table = $(className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        $('.export').attr("hidden", true);
                        table.clear();
                        table.draw();
                        // alert("trống");
                        // table.destroy();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        $('.export').removeAttr("hidden");
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
            {data: "note"},
            {data: "sum_detail"},

        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api();

            var intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            totals = api.column(4, {page:"current"})
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(4).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
            // console.log(className);
            // console.log($(className + ' thead th').length);
        },
        dom: 't',
        language: {
            search: arrData['search'],
            emptyTable: arrData['no_data'],
            info: "Tổng: _TOTAL_",
            infoFiltered: "(Tìm thấy _TOTAL_ trên _MAX_ ngày nghỉ)",
            zeroRecords: arrData['no_data'],
        },
        columnDefs: [
            {
                targets: 0,
                orderable: false,
                searchable: false,
                // render: function(data, type, row){
                //     return '<span>' + cnt++ + '</span>';
                // },
                className: 'text-center'
            },
            {
                targets: 1,
                type: 'date-eu',
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
                    return "<pre>" + data + "</pre>";
                }
            },
            {
                targets: 4,
                render: function (data, type, row) {
                    return formatNum(Math.round(data));
                },
                className: 'num-align'
            },


        ],
        colReorder: false,
        order: [[ 1, 'asc' ]],
        // ordering : false,
        scrollY: "450px",
        scrollX:        true,
        scrollCollapse: true,
        responsive: true,
        paging: false,
        searching: false,
        info: false,
        // autoWidth: true

    });

    $('#kt_subheader_search_form').keyup(function (){
        if($(this).val() != ''){
            $(id_export_excel).attr("hidden", true);
        }else{
            $(id_export_excel).removeAttr("hidden");
        }
        KTApp.block(id_table);
        setTimeout(
            function(){
                table.search($("#kt_subheader_search_form").val()).draw();
                KTApp.unblock(id_table);
                },
            1000
        )
    })

    //numbering row items
    table.on( 'draw.dt', function () {
        var PageInfo = $(className).DataTable().page.info();
        table.column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        } );
    } );

    
    // $(id_table).removeClass("overlay");
    setTimeout(function(){
        KTApp.unblock(id_table);
    }, 1000);
}

//load day default
//Load default
function loadDay() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), null, null, $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
}

//load default month
function loadMonth() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, null, null, $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
}

function loadYear() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, null, $("#datepickerYear").val(), null , $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
}

// langauge date picker
var language_daterangepicker = {
    "cancelLabel": arrData['clear'],
    "applyLabel": arrData['save'],
    "format": 'DD/MM/YYYY',
    "daysOfWeek": [
        arrData['MON'],
        arrData['TUE'],
        arrData['WED'],
        arrData['THU'],
        arrData['FRI'],
        arrData['SAT'],
        arrData['SUN']
    ],
    "monthNames": [
        arrData['JAN'],
        arrData['FEB'],
        arrData['MAR'],
        arrData['APR'],
        arrData['MAY'],
        arrData['JUN'],
        arrData['JUL'],
        arrData['AUG'],
        arrData['SEP'],
        arrData['OCT'],
        arrData['NOV'],
        arrData['DEC']
    ],
};

// minimum setup
$('#statistics-range').daterangepicker({
    // locate: r,
    buttonClasses: ' btn',
    applyClass: 'btn-primary',
    cancelClass: 'btn-secondary',
    // maxDate: new Date(),
    maxDate: moment().startOf('day'),
    minDate: moment(first_trans_date),
    // startDate: moment().startOf('day'),
    // endDate: moment().startOf('day'),
    autoUpdateInput: false,
    locale: language_daterangepicker
});

$('#statistics-range').on('apply.daterangepicker', function(ev, picker) {
    dateRange = picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY');
    $(".content-filter").html(dateRange);
    $(this).val(dateRange);
    // $(".type-multiple-choice").val(null).trigger('change');
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
});

$('#statistics-range').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

//get list of transaction detail by month datatables
$("#datepickerMonth").on("change", function () {
    // console.log("bruh");
    // $(".type-multiple-choice").val(null).trigger('change');
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
});

//get list of transaction detail by chosen year
$("#datepickerYear").on("change", function () {
    // $(".type-multiple-choice").val(null).trigger('change');
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
});

//user export to excel file
$(id_export_excel).on("click", function (e) {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val(), true);
    url += addFilter(getTypes);

    window.location.href = url;
});

// //choose user to view personal statistics
// $("#users").on("change", function(){
//     $(".user-filter").html($("#users option:selected").text());
//     // $(".type-multiple-choice").val(null).trigger('change');
//     getTypes = $('select[name="states[]"]').val();
//     let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
//     url += addFilter(getTypes);
//
//     className = '#statistics-Datatable';
//     KTApp.block(id_table);
//     showdataTable(className, url);
// });

$('.type-multiple-choice').on("change", function(e){
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL(userID, $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    className = '#statistics-Datatable';
    KTApp.block(id_table);
    showdataTable(className, url);
})

