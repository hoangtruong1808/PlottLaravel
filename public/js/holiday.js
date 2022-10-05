let arrHolidayJa = [];
let arrHolidayVi = {'start':'1990-01-01'};
let danger = {type: 'danger'};
let success = {type: 'success'};
let arrDataHoliday =[];
let id;
let green = 'green';
let orange = 'orange';
let changeLanguage ='en';
let list = 'List';
let month = 'Month';
let today = 'Today';
let day = 'Day';
let addEvent = 'Add Transaction'
if(language == 'ja'){
    changeLanguage = 'ja';
    list = 'リスト';
    month = '月';
    today = '今日';
    day = '日';
}else if(language == 'vi'){
    changeLanguage = 'vi';
    list = 'Danh sách';
    month = 'Tháng';
    today = 'Hôm nay';
    day = 'Ngày';
}
// let content = 'prev,today,next addHoliday';
let content = 'prev,today,next';
const REGIME = 1;
const ROLE = 0;
let content_right = 'addHoliday';
if(userRoles !==ROLE){
    content_right = '';
}
let initialLocaleCode = changeLanguage;
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

var KTCalendarBasic = function() {
    return {
        //main function to initiate the module
        init: function() {
            var calendarEl = document.getElementById('kt_calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                isRTL: KTUtil.isRTL(),
                plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list', 'googleCalendar' ,'dayGrid'],
                header: {
                    left: content,
                    center: 'title',
                    right: content_right
                    // ,dayGridDay'
                },
                customButtons: {
                    addHoliday: {
                        text: arrLanguage['add_holiday'],
                        click: function (data) {
                            $('#add-holiday').modal('show');
                            let today = new Date();
                            let date =  ('0' + today.getDate()).slice(-2)+ '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + today.getFullYear();
                            $('#holiday-range').attr('value',date + ' - ' + date);
                            $('#holiday-range').daterangepicker({
                                minDate: new Date(),
                                startDate: date,
                                endDate: date,
                                locale: {
                                    cancelLabel: arrDatas['clear'],
                                    format: 'DD/MM/YYYY',
                                    applyLabel:arrDatas['save'],
                                }
                            });
                        }
                    },
                    // today:{
                    //     text: today,
                    //     click:function (){
                    //         calendar.today();
                    //     }
                    // },
                    next:{
                        click: function(){
                            calendar.removeAllEvents();
                            calendar.next();
                            removeClickableDate();

                        }
                    },
                    prev:{
                        click: function(){
                            calendar.removeAllEvents();
                            calendar.prev();
                            removeClickableDate();

                        }
                    },
                    today:{
                        click:function (){
                            calendar.removeAllEvents();
                            calendar.today();
                            removeClickableDate();
                        },
                        text: today,
                    },
                },
                locale: initialLocaleCode,
                displayEventTime: false, // don't show the time column in list view
                height: 800,
                contentHeight: 780,
                aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio
                defaultView: 'dayGridMonth',
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                views: {
                    dayGridMonth: { buttonText: month },
                    // listMonth: { buttonText: list },
                    dayGrid: { buttonText: day },
                    timeGrid: {
                        eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
                    }
                },

                // THIS KEY WON'T WORK IN PRODUCTION!!!
                // To make your own Google API key, follow the directions here:
                // http://fullcalendar.io/docs/google_calendar/
                googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',

                // US Holidays
                eventSources: [
                    {
                        url: 'ja.japanese.official#holiday@group.v.calendar.google.com',
                        color: 'red',
                        success:function (data){

                            arrHolidayJa = [];
                            arrHolidayJa = data;
                            // vietNam = data;
                        }
                    },
                    {
                        url:'vi.vietnamese.official#holiday@group.v.calendar.google.com',
                        success:function (data){
                            arrHolidayVi = [];
                            arrHolidayVi = data;
                        }
                    },
                    {
                        url:'/holiday/get-all-json',
                        success:function (data){
                            arrDataHoliday = [];
                            arrDataHoliday = data;
                        }
                    },

                ],
                // event.jsEvent.preventDefault();
                eventClick: function(event) {
                    id = event.event.id;
                    let currentDate = calendar.getDate();
                    let eventDate = event.event.start;
                    let region_type = 0;
                    let date1 = new Date(currentDate);
                    let date2 = new Date(eventDate);
                    date1.setDate(date1.getDate() -1);
                    if(event.event.extendedProps.roles == 0){
                        $('#edit-holiday').modal('show');
                        $('#change-submit-holiday').prop('disabled',false);
                        $('#delete-submit-holiday').prop('disabled',false);
                        let start = formatDate(event.event.start);
                        // console.log(event);
                        $('.change-null-title').hide();
                        attrValue('change-holiday','value',start);
                        attrValue('change-title-holiday','value',event.event.title);
                        // attrValue('change-note-holiday','value',event.event._def.extendedProps.description);
                        // attrValue('change-note-holiday','tex',event.event._def.extendedProps.description);

                        if(event.event._def.extendedProps.vietnamese_holiday != null && event.event._def.extendedProps.japanese_holiday == null){
                            region_type = 1;
                        }else if(event.event._def.extendedProps.vietnamese_holiday == null && event.event._def.extendedProps.japanese_holiday != null){
                            region_type = 2;
                        }
                        $("#change-region-select").val(region_type).change();
                        $('#change-note-holiday').text(event.event._def.extendedProps.description);
                        $('#change-holiday_type').prop('checked',event.event._def.extendedProps.holiday_type == '0');
                        // KTBootstrapDatepicker.init();
                        $("#change-holiday").daterangepicker({
                           singleDatePicker: true,
                           // showDropdowns: true,
                            autoApply: true,
                           minDate: new Date(),
                            startDate: start,
                            endDate: start,
                            locale: {
                                // cancelLabel: arrDatas['clear'],
                                format: 'DD/MM/YYYY',
                                // applyLabel:arrDatas['save'],
                            }
                        });
                        if(date1 > date2){
                            $('#delete-submit-holiday').css('display','none');
                            $('#change-submit-holiday').css('display','none');
                        }else{
                            $('#delete-submit-holiday').css('display','block');
                            $('#change-submit-holiday').css('display','block');
                        }
                    }else{
                        event.jsEvent.preventDefault();
                    }
                },
                dateClick:function (event){
                    $('.invalid-feedback').hide();
                    // event.revert();
                    if(userRoles == 0){
                        // let currentDate = calendar.getDate();
                        let currentDate = new Date();
                        let eventDate = event.dateStr
                        // let date1 = new Date(currentDate);
                        let date1 = moment(currentDate).format('YYYY-MM-DD');
                        // date1.setDate(date1.getDate() -1);
                        // let date2 = new Date(eventDate);
                        let date2 = moment(eventDate).format('YYYY-MM-DD');
                        // console.log(currentDate,date1,date2);
                        if(date1 <= date2){
                            $('#add-holiday').modal('show');
                            let dateStr = formatDate(event.dateStr);
                            $('#holiday-range').attr('value',dateStr + ' - ' + dateStr);
                            $('#holiday-range').daterangepicker({
                                minDate: new Date(),
                                startDate: dateStr,
                                endDate: dateStr,
                                locale: {
                                    cancelLabel: arrDatas['clear'],
                                    format: 'DD/MM/YYYY',
                                    applyLabel:arrDatas['save'],
                                }
                            });
                        }
                    }

                },
                loading: function(isLoading) {
                    KTApp.block('#kt_calendar');
                    if(!isLoading){
                        KTApp.unblock('#kt_calendar');
                    }
                },
                eventRender: function(info) {
                    var element = $(info.el);
                    if (info.event.title && info.event) {
                        if (element.hasClass('fc-day-grid-event')) {
                            element.data('content', info.event.title);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        } else if (element.hasClass('fc-time-grid-event')) {
                            element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        } else if (element.find('.fc-list-item-title').length !== 0) {
                            element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        }
                    }
                }
            });

            calendar.render();
            removeClickableDate();
            //Function attrValue
            function attrValue(id,name,value){
                $('#'+id).attr(name,value);
            }
            $('#button-add-holiday').click(function (){
                $('#add-holiday').modal('show');
            });
            $('#deleteHoliday').click(function (){
                $('#deleteHoliday').modal('show');
            });

            $('#change-submit-holiday').click(function (){
                $(this).prop('disabled', true);
                let valueTypeHoliday;
                valueTypeHoliday = $('#change-holiday_type').is(':checked') ? '0': '1';
                let region_type = $("#change-region-select").val();
                if($('#change-title-holiday').val() !=='' || $('#change-holiday').val() !== '' && (valueTypeHoliday == '1' || valueTypeHoliday == '0')){
                    $.ajax({
                        url : baseURL+"/holiday/edit/id/"+id,
                        type: "post",
                        data: {
                            title: $('#change-title-holiday').val(),
                            description: $('#change-note-holiday').val(),
                            holiday: $('#change-holiday').val(),
                            'holiday_type': valueTypeHoliday,
                            region_type: region_type,
                        },
                        success:function(data){
                            let jsonData = $.parseJSON(data);
                            // console.log(jsonData);
                           if(jsonData['success']){
                               let id_edit = calendar.getEventById(jsonData['id_holiday']);
                               id_edit.remove();
                               let color =jsonData['color'];
                               let holiday_type = jsonData['holiday_type'] == 0 ? '0':'1';

                               // holiday_type = '';
                               $('#change-holiday-type').prop('checked',jsonData['holiday_type'] == holiday_type);
                               calendar.addEventSource([{
                                   'id': jsonData['id_holiday'],
                                   'title': jsonData['title'],
                                   'start': jsonData['date_holiday'],
                                   'description':jsonData['description'],
                                   'color': color,
                                   'roles': '0',
                                   'holiday_type': holiday_type,
                                   'vietnamese_holiday' : jsonData['vietnamese_holiday'],
                                   'japanese_holiday' : jsonData['japanese_holiday'],
                               }]);
                               $('#change-submit-holiday').prop('disabled', true);
                               $.notify(arrNotification['success_update'],success)
                           }else{
                               $.notify(arrNotification['error_update'],danger);
                               $('#change-submit-holiday').prop('disabled', true);
                           }
                        },
                        complete:function (){
                            $('#edit-holiday').modal('hide');
                        }
                    });
                }else{
                    $('.change-null-title').hide();
                    $('#change-submit-holiday').prop('disabled', true);
                }

            });

            $('#delete-submit-holiday').click(function(){
                $('#deleteHoliday').modal('show');
                $('#edit-holiday').modal('hide');
                $('#submitDelete').prop('disabled',false);
            });
            $('#cancelDelete').click(function(){
                $('#deleteHoliday').modal('hide');
                $('#edit-holiday').modal('show');
            });
            $('#submitDelete').click(function (){
                $('#submitDelete').prop('disabled', true);
                $.ajax({
                    url: baseURL + "holiday/delete/id/"+id,
                    type: "post",
                    success: function (data){
                        let jsonData = $.parseJSON(data);
                        if(jsonData['Success']){
                            $('#deleteHoliday').modal('hide');
                            $.notify(arrNotification['success_delete'],success);
                            calendar.getEventById(id).remove();
                        }else{
                            $('#deleteHoliday').modal('hide');
                            $.notify(arrNotification['error_delete'],danger);

                        }
                    },
                    error: function (error){
                        $('#deleteHoliday').modal('hide');
                        $.notify(arrNotification['error_delete'],danger);
                    },
                });
            });
            $('#submit-holiday').click(function(){
                $(this).prop('disabled', true);
                $.merge(arrHolidayVi,arrHolidayJa);
                let holidayArr= {'start': '1990-01-01'};
                let valueTypeHoliday;
                valueTypeHoliday = $('#holiday_type').is(':checked') ? '0': '1';
                let region_type = $("#region-select").val();
                if($('#holiday-range').val()!== '' && $('#title-holiday').val()!=='' && (valueTypeHoliday == '1' || valueTypeHoliday == '0')){
                    $.ajax({
                        url : baseURL+"/holiday/add/",
                        type: "post",
                        data: {
                            title: $('#title-holiday').val(),
                            description: $('#note-holiday').val(),
                            holidayArr,
                            'holiday-range': $('#holiday-range').val(),
                            'holiday_type': valueTypeHoliday,
                            'region_type' : region_type,
                        },
                        success:function(data){
                            let jsonData = $.parseJSON(data);
                            if(jsonData['success']){
                                // calendar.removeAllEventSources(arrDataHoliday);
                                for (let i = 0 ; i< jsonData['holiday-data'].length; i++){
                                    let idEvent = calendar.getEventById(jsonData['holiday-data'][i]['id_holiday']);
                                    if(idEvent){
                                        continue;
                                    }
                                    let color = jsonData['holiday-data'][i]['color'];
                                    let holiday_type = jsonData['holiday-data'][i]['holiday_type'] == 0 ? '0':'1';
                                    // color = jsonData['holiday-data'][i]['holiday_type'] == 0 ? green:orange;
                                    // holiday_type = jsonData['holiday-data'][i]['holiday_type'] == 0 ? '0':'1';
                                    $('#change-holiday-type').prop('checked',jsonData['holiday-data'][i]['holiday_type'] == holiday_type);
                                    calendar.addEventSource([{
                                        'id': jsonData['holiday-data'][i]['id_holiday'],
                                        'title': jsonData['holiday-data'][i]['title'],
                                        'start': jsonData['holiday-data'][i]['date_holiday'],
                                        'description':jsonData['holiday-data'][i]['description'],
                                        'color': color,
                                        'roles': '0',
                                        'holiday_type': holiday_type,
                                    }]);
                                }
                                $.notify(arrNotification['success_add'], success);
                            }else{
                                $.notify(arrNotification['error_add'], danger);
                                $('#add-holiday').modal('hide');
                                $('#submit-holiday').prop('disabled', true);
                            }
                        },
                        error:function (error){
                            $('#add-holiday').modal('hide');
                            $.notify(arrNotification['error_add'], danger);
                        },
                        complete:function (){
                            $('#add-holiday').modal('hide');
                            $('#submit-holiday').prop('disabled', true);
                        }
                    });
                }else{
                    $.notify(arrNotification['error_add'], danger);
                    $('#submit-holiday').prop('disabled', false);
                }
            });
            $('#add-holiday').on('hidden.bs.modal', function () {
                $('#add-holiday form')[0].reset();
            });
            $('#edit-holiday').on('hidden.bs.modal', function () {
                $('#edit-holiday form')[0].reset();
            });
        }
    };
}();


function formatHoliday(holidayVi, holidayJa, holidayCustom){
    let result =[];
    if(holidayVi != null){
        $.each(holidayVi, function(key, value){
            result.push({
                'description': value['description'],
                'title' : value['title'],
                'start' : value['start'],
                'color' : '#3788d8',
            });
        })
    }
    if(holidayJa != null){
        $.each(holidayJa, function(key, value){
            result.push({
                'description': value['description'],
                'title' : value['title'],
                'start' : value['start'],
                'color' : 'red',
            });
        })
    }
    if(holidayCustom != null){
        $.each(holidayCustom, function(key, value){
            result.push({
                'description': value['description'],
                'title' : value['title'],
                'start' : value['start'],
                'color' : value['color'],
            });
        })
    }
    return result;
}
// $(".fc-prev-button .fc-next-button")

//Datatables
function showDatatablesHoliday(className, data_format){
    if ($.fn.DataTable.isDataTable(this.className)) {
        $(this.className).DataTable().destroy();
    }
    // console.log(className, data_format);
    table =  $(this.className).DataTable({
        data: data_format,
        columns: [
            {data: "start"},
            {data: null},
            {data: "description"},
            // {data: null},
        ],
        language: {
            lengthMenu: arrLanguage['show']+" _MENU_ "+arrLanguage['holiday'],
            search: arrLanguage['search'],
            emptyTable: arrLanguage['no_data'],
            info: info,
            infoFiltered: infoFiltered,
            infoEmpty: info_empty,
            zeroRecords: arrLanguage['no_data'],
        },
        columnDefs: [
            {
                target: 0,
                render: function(data, type, row){
                    // console.log("Sadasdasd");
                    return formatDate(data);
                }
            },

        ],
        "drawCallback": function (settings){
            // console.log("brooo");
            $(".btn-noti").tooltip();
        },
        responsive: true,
        paging: true,
    });
}

var KTDatatablesAdvancedColumnRendering = function () {
    var stt = 1;
    var init = function () {

        var table = $('#holiday_datatable');
        if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
        }


        data = formatHoliday(arrHolidayVi, arrHolidayJa, arrDataHoliday);
// begin first table
        table.DataTable({
            data,
            columns: [
                {data: "start"},
                {data: null},
                {data: "description"},
                // {data: null},
            ],
            responsive: true,
            paging: true,
            language: {
                lengthMenu: arrLanguage['show']+" _MENU_ "+arrLanguage['holiday'],
                search: arrLanguage['search'],
                emptyTable: arrLanguage['no_data'],
                info: info,
                infoFiltered: infoFiltered,
                infoEmpty: info_empty,
                zeroRecords: arrLanguage['no_data'],
            },
            columnDefs: [
                {
                    targets: 0,
                    type: 'date-eu',
                    render: function(data, type, row){
                        // console.log(data);
                        return formatDate(data);
                    }
                },
                {
                    targets: 1,
                    render: function (data, type, row){
                        // console.log(data);
                        return '<span style="color: '+ data.color + '">' + data.title + '</span>';
                    }
                }
            ],
            "drawCallback": function (settings){
                // console.log("brooo");
                $(".btn-noti").tooltip();
            }
        });
    };

    return {

//main function to initiate the module
        init: function () {
            init();
        }
    };
}();

//remove click on date
function removeClickableDate(){
    // Replace all a tags with the type of replacementTag
    // console.log("sadasd");
    $('.fc-day-number').each(function() {
        let replacementTag = 'span';
        let outer = this.outerHTML;

        // Replace opening tag
        let regex = new RegExp('<' + this.tagName, 'i');
        let newTag = outer.replace(regex, '<' + replacementTag);

        // Replace closing tag
        regex = new RegExp('</' + this.tagName, 'i');
        newTag = newTag.replace(regex, '</' + replacementTag);

        $(this).replaceWith(newTag);
    });
}

// jQuery(document).ready(function () {
//     KTDatatablesAdvancedColumnRendering.init();
// });


jQuery(document).ready(function() {
    KTCalendarBasic.init();
    // KTDatatablesAdvancedColumnRendering.init();
});