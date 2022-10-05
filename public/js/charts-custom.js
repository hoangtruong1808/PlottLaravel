//language
// Shared Colors Definition
const primary = '#6993FF';
const success = '#1BC5BD';
const info = '#8950FC';
const warning = '#FFA800';
const danger = '#F64E60';

if(typeof admin == 'undefined'){
    var admin = null;
}
var dataBar;
var dataDonut;
var index;
var dataMixed;
var data_daily_trans;
let data_sum_trans;
var arrData;

var years;
var personal_years;
var user_id;

// //format number to x,xxx,xxx
// function formatNum(numberTrans) {
//     var numberTrans = String(numberTrans);
//     numberTrans = numberTrans.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return numberTrans;
// }

//show chart of transactions based on month
/*url: link get json data
id: class id
mode: mode = null => get all, mode = 1 => get personal (logged in user), mode = 3 => admin role
year : get param year
 */
function showChartsMonth(url, id, mode = null, year = null){
    if(year == null){
        year = moment().format('Y');
    }
    // console.log(url, id , mode);
    const transaction_sum_trans = id;
    if(mode != null && mode != 3){
        url += '/mode/' + mode;
    }
    if(user_id != null && mode != 3){
        url += '/user_id/' + user_id;
    }
    $.when(
        $.ajax({
            url,
            dataType: 'json',
            success: function(data){
                // console.log(data['plus']);
                data_sum_trans = data;
            }
        })
    ).then(function (){
        if(data_sum_trans == null){
            $(id).html('<span class="text-dark-50">\n'
                + arrData['NO_DATA']
                + '</span>');
        }else {
            let options;
            if(data_sum_trans['minus'] == null){
                options = chart_month_one_col_options(data_sum_trans, mode, year);
            }else{
                options = chart_month_full_options(data_sum_trans, mode, year);
            }

            var chart_transaction_sum_trans = new ApexCharts(document.querySelector(transaction_sum_trans), options);
            // chart_transaction_sum_trans.toggleSeries(arrData['TOTALS']);
            chart_transaction_sum_trans.render();
            //
            // $("#aside-menu").on("click", function (){
            //     chart_transaction_sum_trans.render();
            // })
            // chart_transaction_sum_trans.toggleSeries(arrData['TOTALS_GRID']);

        }

    })
}

//show chart of transactions based on daily
function showChartsDaily(url, id, mode = null){
    const transaction_daily_trans = id;
    if(mode != null){
        url += '/mode/' + mode;
    }
    if(user_id != null && mode != 3){
        url += '/user_id/' + user_id;
    }
    $.when(
        $.ajax({
            // url: baseURL + 'mode/get-all-json',
            // url: baseURL + 'index/get-json-daily-trans',
            url,
            dataType: 'json',
            success: function(data){
                // console.log(data);
                data_daily_trans = data;
            }
        })
    ).then(function (){
        if(data_daily_trans == null){
            $(id).html('<span class="text-dark-50">\n'
                + arrData['NO_DATA']
                + '</span>');
        }else{
            let options = {
                series: [{
                    name: arrData['TOTALS_MINUS'],
                    // type: 'column',
                    data: data_daily_trans['plus']
                }, {
                    name: arrData['TOTALS_PLUS'],
                    // type: 'column',
                    data: data_daily_trans['minus']
                },
                    //     {
                    //     name: 'Revenue',
                    //     type: 'line',
                    //     data: [20, 29, 37, 36, 44, 45, 50, 58]
                    // }
                ],
                chart: {
                    height: 350,
                    type: 'area',
                    // stacked: true
                },
                dataLabels: {
                    enabled: false,
                    formatter: function(value){

                        return formatNum(value);
                    }
                },
                stroke: {
                    // width: [1, 1]
                    curve: 'smooth',
                },
                title: {
                    text: data_daily_trans['title'],
                    align: 'center',
                    // offsetX: 110
                },
                xaxis: {
                    categories: data_daily_trans['dates'],
                },
                yaxis: {
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: primary
                    },
                    labels: {
                        style: {
                            colors: primary,
                        },
                        formatter: function(value){
                            return formatNum(value);
                        },
                    },
                    title: {
                        text: "VND",
                        style: {
                            color: primary,
                        }
                    },
                    // tooltip: {
                    //     enabled: true
                    // }
                },
                tooltip: {
                    fixed: {
                        enabled: true,
                        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                        offsetY: 30,
                        offsetX: 60
                    },
                },
                legend: {
                    horizontalAlign: 'center',
                    offsetX: 40
                }
            };

            var chart_transaction_daily_trans = new ApexCharts(document.querySelector(transaction_daily_trans), options);
            chart_transaction_daily_trans.render();
        }
    })
}
test = '<form ... onkeydown="return event.key != \'Enter\';">'
//show chart of users roles on dashboard
function showChartUsers(url, id){
    const users_chart = id;
    $.when(
        $.ajax({
            // url: baseURL + 'user/get-all-json',
            // url: baseURL + 'index/get-json-users',
            url,
            dataType: 'json',
            success: function(data){
                // console.log(data['name']);
                dataDonut = data;
            }
        })
    ).then(function(){
        if(dataDonut == null){
            $(id).html('<span class="text-dark-50">\n'
                + arrData['NO_DATA']
                + '</span>');
        }else {
            let options = {
                labels: dataDonut['name'],
                series: dataDonut['data'],
                chart: {
                    width: 500,
                    // height: 1000,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: arrData['TOTAL'],
                                    color: primary,
                                }
                            },
                        }
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 400
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                colors: [success, danger]
            };

            var chart_users_chart = new ApexCharts(document.querySelector(users_chart), options);
            chart_users_chart.render();
        }
    })
}

//show chart of user transaction sequence based on month
function showChartUserSequence(url, id){
    const user_chart = id;
    $.when(
        $.ajax({
            url,
            dataType: 'json',
            success: function(data){
                dataDonut = data;
            }
        })
    ).then(function(){
        if(dataDonut == null){
            $(id).html('<span class="text-dark-50">\n'
                + arrData['NO_DATA']
                + '</span>');
        }else {
            let options = {
                labels: dataDonut['name'],
                series: dataDonut['data'],
                chart: {
                    width: 400,
                    // height: 1000,
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: arrData['TOTAL'],
                                    color: '#000000',
                                }
                            },
                        }
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 400
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                // colors: [warning, success, danger]
            };
            var chart_user_chart = new ApexCharts(document.querySelector(user_chart), options);
            chart_user_chart.render();
        }
    })
}

//show chart of user transaction based on

//format daterangepicker
function dateRangeDisplay() {
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('#filter-option input').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

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

    $('input[name="date-range"]').daterangepicker({
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        maxDate: moment().startOf('day'),
        autoUpdateInput: false,
        locale: language_daterangepicker
    });
}

function yearDisplay(id, mode, selected_year = null){
    if(mode == null){
        mode = years;
    }else {
        mode = personal_years;
    }
    if(mode != null){
        html = '<select class="form-control form-control-solid type-multiple-choice"\n' +
            '                                        onchange="changeYear(this);" name="change-year">\n';
        $.each(mode, function(index, value){
            if(selected_year != null && value == selected_year){
                html+= '<option value="' + value + '" selected>' + value + '</option>\n';
            }else{
                html+= '<option value="' + value + '">' + value + '</option>\n';
            }
        })
        html+= '</select>';
        $(id).html(html);
    }
}
//switch chart user / all

function switchChart(val){
    $("#transaction-chart").empty();
    // $("#filter-option").empty();
    var changeChart = $("select[name=changeChart]").val();
    if($("select[name=change-year]").length == 0){
        var year = moment().format('Y');
    }else{
        var year = $("select[name=change-year]").val();
    }

    var mode = val.value == 0 ? null : 1;
    mode = admin != null ? admin : mode;

    // if(mode == 1) {
        // $("#filter-option").html('<input type="text" class="form-control form-control-solid" name="date-range" readonly>');
        if (changeChart == 1) {
            // console.log("chay trong day");
            $("#filter-option").empty();
                yearDisplay("#filter-option", mode, year);
                showChartsMonth(baseURL + 'index/get-json-month/year/' + year, "#transaction-chart", mode, year);
        } else {
            // console.log("chay trong nay ne");
            dateRange = $('input[name="date-range"]').val().split(" - ");
            dateFrom = moment(dateRange[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
            dateTo = moment(dateRange[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
            url = baseURL + 'index/get-json-daily-trans/from/' + dateFrom + '/to/' + dateTo;
            showChartsDaily(url, "#transaction-chart", mode);
        }
}

//change chart
function changeChart(val){
    $("#transaction-sum-trans").empty();
    $("#filter-option").empty();
    if($("select[name=change-year]").length == 0){
        var year = moment().format('Y');
    }else{
        var year = $("select[name=change-year]").val();
    }

    if(val.value == '2') {
        $("#filter-option").html('<input type="text" class="form-control form-control-solid" name="date-range" readonly>');

        dateRangeDisplay();
        showChartsDaily(baseURL + 'index/get-json-daily-trans', "#transaction-sum-trans");

        $('input[name="date-range"]').on('apply.daterangepicker', function (ev, picker) {
            dateRange = picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY');
            $(this).val(dateRange);
            dateFrom = picker.startDate.format('YYYY-MM-DD');
            dateTo = picker.endDate.format('YYYY-MM-DD');
            url = baseURL + 'index/get-json-daily-trans/from/' + dateFrom + '/to/' + dateTo;
            $("#transaction-sum-trans").empty();
            showChartsDaily(url, "#transaction-sum-trans");
        })
    }
    else{
        yearDisplay("#filter-option", null, year);
        showChartsMonth(baseURL + 'index/get-json-month', "#transaction-sum-trans", admin);
    }
}

function userChangeChart(val){
    $("#transaction-chart").empty();
    $("#filter-option").empty();
    var mode = $("select[name=switchChart]").val() == 0 ? null : 1;
        mode = admin != null ? admin : mode;
    if($("select[name=change-year]").length == 0){
        var year = moment().format('Y');
    }else{
        var year = $("select[name=change-year]").val();
    }

    if(val.value == '2') {
        $("#filter-option").html('<input type="text" class="form-control form-control-solid" name="date-range" readonly>');

        dateRangeDisplay();
        showChartsDaily(baseURL + 'index/get-json-daily-trans', "#transaction-chart", mode);

        $('input[name="date-range"]').on('apply.daterangepicker', function (ev, picker) {
            dateRange = picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY');
            $(this).val(dateRange);
            dateFrom = picker.startDate.format('YYYY-MM-DD');
            dateTo = picker.endDate.format('YYYY-MM-DD');
            url = baseURL + 'index/get-json-daily-trans/from/' + dateFrom + '/to/' + dateTo;
            $("#transaction-chart").empty();
            showChartsDaily(url, "#transaction-chart", mode);
        })
    }
    else{
        yearDisplay("#filter-option", mode, year);
        showChartsMonth(baseURL + 'index/get-json-month/year/' + year, "#transaction-chart", mode, year);
    }
}

function changeYear(val){
    // console.log(val.value, $("select[name=switchChart]").val());
    var mode = $("select[name=switchChart]").val() == 1 ? 1 : null;
    mode = admin != null ? admin : mode;
    // if($("select[name=switchChart]").val() == 1){
    //     var url = baseURL + 'index/get-json-month/mode/' + mode + '/year/' + val.value;
    // }else{
    //     var url = baseURL + 'index/get-json-month/year/' + val.value;
    // }
    if ($("#transaction-sum-trans").length === 1) {
        var id = "#transaction-sum-trans";
    }
    if ($("#transaction-chart").length === 1){
        var id = "#transaction-chart";
    }
    $(id).empty();
    showChartsMonth(baseURL + 'index/get-json-month/year/' + val.value, id, mode, val.value);
}

function chart_month_full_options(data, mode = null, year = null){
    return {
        series: [
            // {
            //     name: arrData['TOTALS'],
            //     type: 'column',
            //     data: data['total']
            // },
            {
                name: arrData['TOTALS_MINUS'],
                type: 'column',
                data: data['plus'],
            },
            {
                name: arrData['TOTALS_PLUS'],
                type: 'column',
                data: data['minus']
            },
            {
                name:  arrData['TOTALS'],
                type: 'line',
                data: data['total']
            }
        ],
        chart: {
            height: 350,
            width: '99%',
            type: 'line',
            stacked: false,
            toolbar:{
                tools:{
                    download: false,
                    selection: false,
                    // zoom: false,
                    zoomin: false,
                    zoomout: false,
                    // pan: false,
                    // customIcons: [{
                    //     icon: '<img src="https://cdn.chanhtuoi.com/uploads/2020/05/icon-facebook-19-2.jpg.webp" width=20',
                    //     index:4,
                    //     title: 'teheehehhe',
                    //     class: 'custom-icon',
                    //     click: function(chart, options, e){
                    //         console.log(chart, options, e);
                    //     }
                    // }]
                }
            },
            events:{
                // click: function(event, chartContext, config) {
                //     // console.log(mode, id);
                //     // context = chartContext;
                //     // console.log(config.config.series[config.seriesIndex]);
                //     // console.log(config.config.series[config.seriesIndex].name);
                //     // console.log(config.config.series[config.seriesIndex].data[config.dataPointIndex]);
                //     // console.log(config.dataPointIndex, url);
                //     if(mode !=null){
                //         let month = config.dataPointIndex+1;
                //         if(month < 10){
                //             month = '0' + month;
                //         }
                //         // console.log(baseURL + 'user/personal-statistics?month-year=' + month + "-" + year);
                //         window.location.href = baseURL + 'user/personal-statistics?month-year=' + month + "-" + year;
                //     }
                // },
                markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {
                    // console.log(seriesIndex, dataPointIndex, mode);
                    if(mode !=null){
                        let month = dataPointIndex+1;
                        if(month < 10){
                            month = '0' + month;
                        }
                        // console.log(baseURL + 'user/personal-statistics?month-year=' + month + "-" + year);
                        if(mode == 3){
                            window.location.href = baseURL + 'admin/stats-options?month-year=' + month + "-" + year;
                        }else{
                            if(user_id != null){
                                window.location.href = baseURL + 'admin/personal-statistics?user_id=' + user_id + '&month-year=' + month + "-" + year;
                            }else{
                                window.location.href = baseURL + 'user/personal-statistics?month-year=' + month + "-" + year;
                            }
                        }
                    }
                }
            },
            // redrawOnParentResize: true,
        },
        stroke: {
            width: [1, 1, 4],
            curve: 'straight',
        },
        title: {
            text: data['title'],
            align: 'center',
            // offsetX: 110
        },
        xaxis: {
            categories: data['dates'],
        },
        yaxis: {
            title: {
                text: "VND",
                // style: {
                //     color: primary,
                // },
            },
            labels: {
                // style: {
                //     colors: primary,
                // },
                formatter: function (value) {
                    return formatNum(value);
                },
            },
        },
        legend: {
            horizontalAlign: 'center',
            offsetX: 40,
            // customLegendItems: [0,2,1,3]
        },
        // responsive: [{
        //     breakpoint: 900,
        //     // options: {},
        // }],
        colors: [primary, danger, warning],
        // tooltip:{
        //     custom: function({ series, seriesIndex, dataPointIndex, w}){
        //         html = '<div>' + series[seriesIndex][dataPointIndex] + '</div>';
        //         html += '<div>' + w.globals.labels[dataPointIndex] + '</div>';
        //         // $.get(baseURL + 'index/get-json-years-trans', function(data, status){
        //         //     console.log(JSON.parse(data)[0]);
        //         //     test = ('<div>' + JSON.parse(data)[0] + '</div>')
        //         // });
        //         // html = test;
        //
        //         return html;
        //     }
        // }
    };
}

function chart_month_one_col_options(data, mode = null, year = null) {
    return {
        series: [
            // {
            //     name: arrData['TOTALS'],
            //     type: 'column',
            //     data: data['total']
            // },
            {
                name: arrData['TOTALS_MINUS'],
                type: 'column',
                data: data['plus'],
            },
        ],
        chart: {
            height: 350,
            // width: '99%',
            type: 'line',
            stacked: false,
            toolbar: {
                tools: {
                    download: false,
                    selection: false,
                    zoomin: false,
                    zoomout: false,
                }
            },
            events: {
                markerClick: function (event, chartContext, {seriesIndex, dataPointIndex, config}) {
                    // console.log(seriesIndex, dataPointIndex, mode);
                    if (mode != null) {
                        let month = dataPointIndex + 1;
                        if (month < 10) {
                            month = '0' + month;
                        }
                        // console.log(baseURL + 'user/personal-statistics?month-year=' + month + "-" + year);
                        if (mode == 3) {
                            window.location.href = baseURL + 'admin/stats-options?month-year=' + month + "-" + year;
                        } else {
                            if (user_id != null) {
                                window.location.href = baseURL + 'admin/personal-statistics?user_id=' + user_id + '&month-year=' + month + "-" + year;
                            } else {
                                window.location.href = baseURL + 'user/personal-statistics?month-year=' + month + "-" + year;
                            }
                        }
                    }
                }
            },
            // redrawOnParentResize: true,
        },
        stroke: {
            width: [1],
            curve: 'straight',
        },
        title: {
            text: data['title'],
            align: 'center',
        },
        xaxis: {
            categories: data['dates'],
        },
        yaxis: {
            title: {
                text: "VND",
            },
            labels: {
                formatter: function (value) {
                    return formatNum(value);
                },
            },
        },
        legend: {
            horizontalAlign: 'center',
            offsetX: 40,
        },
        colors: [primary],
    };
}
