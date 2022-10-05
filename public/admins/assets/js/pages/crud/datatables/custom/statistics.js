statsURL = baseURL + 'statistics/';

MyDate = new Date();
let test = ('0' + (new Date().getMonth() + 1)).slice(-2) +'/' + MyDate.getFullYear();
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

//load current year data
let thisYear = new Date().getFullYear();

let id_table = "#datatable-content";
let id_table_user = "#datatable-user-content";
let id_export_excel = "#exportExcel";

let monthYear;
let dateFrom;
let dateTo;
let getUrl;
let className;
let getTypes;

let testfooter;
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
        // minDate: moment("2022-05")._d,
        // maxDate: moment("2022-12")._d,
        startDate: moment(first_trans_date)._d,
        endDate: "0m",
    });

    $('#datepickerMonth').on("focusout", function(e){
        if($(this).val() == ''){
            $(this).val(getThisMonthDefault);
        }
    })

    //select2
    $('.type-multiple-choice').select2({
        data: getTypeFilters,
        placeholder: {
            id: '-1',
            text: arrData['filter_search'],
        },
        language: {
          noResults: function(){
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

    $('.type-multiple-choice').on('select2:close', function(e) {
        if ($('select[name="states[]"]').val() == 0) {
            if ($("#statistics-Datatable").DataTable().rows().count() == 0) {
                $(id_export_excel).attr("hidden", true);
            } else {
                $(id_export_excel).attr("hidden", false);
            }
        } else {
            $(id_export_excel).attr("hidden", true);
        }
    })

    $("#statistics-range").val(getTodayDefault +' - ' + getTodayDefault);

    $(".type-filter").html($("#selectStat option:selected").text());
    if($("#datepickerMonth").val() == ''){
        $("#datepickerMonth").val(getThisMonthDefault);
    }
    $(".content-filter").html($("#datepickerMonth").val());

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
        $(id_export_excel).attr("hidden",true);
        $('.dateYear').attr("hidden",true);
        $(".type-filter").html($("#selectStat option:selected").text());
        $(".content-filter").html($("#statistics-range").val());
        loadDay();
        // loadDayUser();
    } else if ($(this).val() == 'Month') {
        // $(".type-multiple-choice").val(null).trigger('change');
        $('.dateMonth').removeAttr("hidden");
        $('#pickFromTo').attr("hidden",true);
        $(id_export_excel).attr("hidden",true);
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
        $(id_export_excel).attr("hidden",true);
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
        if($("#userDatepickerYear").length > 0){
            if($("#userDatepickerYear option[value='" + thisYear +"']").length > 0){
                $("#userDatepickerYear").val(thisYear).selected;
            }else{
                $("#userDatepickerYear option:last-child").val().selected;
            }
            // loadYearUser();
        }
    } else {
        $('#pickFromTo').attr("hidden",true);
        $('.dateMonth').attr("hidden",true);
        $(id_export_excel).attr("hidden",true);
    }
});



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

//show datatable
function showdataTable(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(className)) {
        $(className).DataTable().destroy();
    }

    //count data column
    // let cnt = 1;
    let table = $(className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        // $('.test').attr("hidden", true);
                        $(id_export_excel).attr("hidden", true);
                        // $('.empty-table').removeAttr("hidden");
                        // alert("trống");
                        // table.destroy();
                        table.clear();
                        table.draw();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        // $('.test').removeAttr("hidden");
                        $(id_export_excel).removeAttr("hidden");
                        // $('.empty-table').addAttr("hidden");
                        const data_format = {"data": data}
                        callback(data_format);
                        // console.log(data_format);
                    }
                }
            })
        },
        columns: arrTbl,
        colReorder: false,
        "footerCallback": function (row, data, start, end, display) {
            let api = this.api();
            testfooter = api;
            console.log(data, display, start, end);
            if(display === 0){
                api.columns().footer()[0].parentElement.parentElement.setAttribute("hidden", true);
            }else{
                api.columns().footer()[0].parentElement.parentElement.removeAttribute("hidden");
            }
            let intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            let totals = api.column(3, {page: 'current'})
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(3).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));

            let total = api.column(5, {page: 'current'})
                .data()
                .reduce(function (a, b) {
                    return (a) * 1 + (b) * 1;
                }, 0);
            $(api.column(5).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(total));
            // console.log(className);
            // console.log($(className + ' thead th').length);
            for (let i = 6; i < $(className + ' thead th').length; i++) {
                totals = api.column(i, {page: 'current'})
                    .data()
                    .reduce(function (a, b) {
                        return (a) * 1 + (b) * 1;
                    }, 0);
                $(api.column(i).footer()).html($.fn.dataTable.render.number(',', '.', 0, '', '').display(totals));
                // console.log(i);
            }

        },
        dom: 't',
        // dom: '<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"f>>t',
        language: {
            search: arrData['search'],
            emptyTable: arrData['no_data'],
            info: "Tổng: _TOTAL_",
            infoFiltered: "(Tìm thấy _TOTAL_ trên _MAX_ ngày nghỉ)",
            zeroRecords: arrData['no_data'],
        },
        ordering : false,
        columnDefs: [
            {
                targets: 0,
                // orderable: false,
                // searchable: false,
                // render: function(data, type, row){
                //     return '<span>' + cnt++ + '</span>';
                // },
                // className: 'dt-body-center'
            },
            {
                targets: 1,
                // orderable: false,
                type: 'date-eu',
                render: function (data, type, row) {
                    // return moment(new Date(data).toString()).format('DD/MM/YYYY');
                    return formatDate(data);
                }
            },
            {
                targets: 2,
                // orderable: false,
                render: function(data, type, row){
                    // console.log(data);
                    return '<span style="color:' + data.color_type + '">' + data.name_type + '</span>';
                }
            },
            {
                targets: [3, 4, 5],
                render: function (data, type, row) {
                    return formatNum(Math.round(data));
                },
                className: 'num-align'
            },
            // {
            //   targets: 5,
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
                        return '<span style="color: #c5c5c5 !important;">' + formatNum(Math.round(data)) + '</span>';
                    } else return formatNum(Math.round(data));
                },
                className: 'num-align'
            },
        ],
        // order: [[ 1, 'asc' ]],
        scrollY: "450px",
        scrollX: true,
        scrollCollapse: true,
        // responsive: true,
        paging: false,
        // searching: false,
        info: false,
        // searching: {
        //     input : $("#kt_subheader_search_form"),
        //     delay: 400,
        //     key: 'generalSearch'
        // },
        fixedColumns: {
            left: 4
        },

    });
    // table = $("#statistics-Datatable").DataTable();
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

    setTimeout(function(){
        KTApp.unblock(id_table);
    }, 1000);

}

//show datatable for user
function showdataTableUser(className, getUrl) {
    //check if table already have or not
    if ($.fn.DataTable.isDataTable(className)) {
        $(className).DataTable().destroy();
    }
    // let cnt = 1;
    let table = $(className).DataTable({
        ajax: function (data, callback, settings) {
            $.ajax({
                url: getUrl,
                dataType: "json",
                dataSrc: '',
                success: function (data) {
                    if (!$.trim(data)) {
                        $(id_export_excel).attr("hidden", true);
                        table.clear();
                        table.draw();
                        // alert("trống");
                        // table.destroy();
                        // die;
                    } else {
                        // alert("có nè");
                        // console.log(data);
                        $(id_export_excel).removeAttr("hidden");
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
            let api = this.api();

            let intVal = function (i) {
                return typeof 1 === 'string' ?
                    i.replace(/[€,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            //total all
            let totals = api.column(4, {page:"current"})
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
        // ordering : false,
        order: [[ 1, 'asc' ]],
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
        KTApp.block(id_table_user);
        setTimeout(
            function(){
                table.search($("#kt_subheader_search_form").val()).draw();
                KTApp.unblock(id_table_user);
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

    // $("#datatable-content").removeClass("overlay");
    setTimeout(function(){
        KTApp.unblock(id_table_user);
    }, 1000);
}
//load day default
//Load default
function loadDay() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($("#users").val(), $("#statistics-range").val(), null, null, $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    // $(className).removeAttr("hidden");
    // KTApp.block(id_table);
    // showdataTable(className, url);
    if ($("#users").val() == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
}

//Load default
function loadMonth() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($("#users").val(), null, null, $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    // className = '#statistics-Datatable';
    // $(className).removeAttr("hidden");
    // KTApp.block(id_table);
    // showdataTable(className, url);
    if ($("#users").val() == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
}

function loadYear() {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($("#users").val(), null, $("#datepickerYear").val(), null , $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    if ($("#users").val() == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        $(className).removeAttr("hidden");
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
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
    // startDate: '2022/03/20',
    // endDate: '2022/03/30',
    buttonClasses: ' btn',
    applyClass: 'btn-primary',
    cancelClass: 'btn-secondary',
    maxDate: moment().startOf('day'),
    minDate: moment(first_trans_date),
    // startDate: moment().startOf('day'),
    // endDate: moment().startOf('day'),
    autoUpdateInput: false,
    locale: language_daterangepicker
});

$('#statistics-range').on('apply.daterangepicker', function(ev, picker) {
    let dateRange = picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY');
    $(".content-filter").html(dateRange);
    $(this).val(dateRange);
    // $(".type-multiple-choice").val(null).trigger('change');
    // console.log("sadasd");
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();

    let url = formatURL($("#users").val(), $("#statistics-range").val(), null ,null, $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    if ($("#users").val() == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
});

$('#statistics-range').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

//get list of transaction detail by month datatables
$("#datepickerMonth").on("change", function () {
    // $(".type-multiple-choice").val(null).trigger('change');
    $(id_export_excel).attr("hidden", true);
    $(".content-filter").html($(this).val());
    getTypes = $('select[name="states[]"]').val();
    let selected = $("#users").val();
    let url = formatURL($("#users").val(), null, null, $(this).val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    if (selected == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
});

//get list of transaction detail by chosen year
$("#datepickerYear").on("change", function () {
    // $(".type-multiple-choice").val(null).trigger('change');
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    $(".content-filter").html($(this).val());
    let selected = $("#users").val();
    let url = formatURL($("#users").val(), null, $(this).val(), null, $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    if (selected == '') {
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        KTApp.block(id_table);
        showdataTable(className, url);
    } else {
        $(id_table_user).attr("hidden", false);
        $(id_table).attr("hidden", true);
        className = '#statistics-user-Datatable';
        KTApp.block(id_table_user);
        showdataTableUser(className, url);
    }
});

//export to excel file
$(id_export_excel).on("click", function (e) {
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($("#users").val(), $("#statistics-range").val(), $("#datepickerYear").val(), $("#datepickerMonth").val(), $("#selectStat option:selected").val(), true);
    url += addFilter(getTypes);

    window.location.href = url;
});

$('.type-multiple-choice').on("change", function(e){
    $(id_export_excel).attr("hidden", true);
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($("#users").val(), $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    if($("#users").val() == ''){
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        className = '#statistics-Datatable';
        KTApp.block(id_table);
        showdataTable(className, url);
    }else{
        $(id_table).attr("hidden", true);
        $(id_table_user).attr("hidden", false);
        KTApp.block(id_table_user);
        let className = '#statistics-user-Datatable';
        showdataTableUser(className, url);
    }
})

$("#users").on("change", function(){
    if($("#users option:selected").val() != ''){
        $(".user-filter").html($("#users option:selected").text());
    }else{
        $(".user-filter").html('');
    }
    // $(".type-multiple-choice").val(null).trigger('change');
    getTypes = $('select[name="states[]"]').val();
    let url = formatURL($(this).val(), $("#statistics-range").val(), $("#datepickerYear").val(), $('#datepickerMonth').val(), $("#selectStat option:selected").val());
    url += addFilter(getTypes);

    // KTApp.block(id_table);
    if($(this).val() == ''){
        $(id_table_user).attr("hidden", true);
        $(id_table).attr("hidden", false);
        KTApp.block(id_table);
        let className = '#statistics-Datatable';
        showdataTable(className, url);
    }else{
        $(id_table).attr("hidden", true);
        $(id_table_user).attr("hidden", false);
        KTApp.block(id_table_user);
        let className = '#statistics-user-Datatable';
        showdataTableUser(className, url);
    }
});


