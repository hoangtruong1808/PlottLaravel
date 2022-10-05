let arrEvent = [];
let arrEventCustom = [];
let holidayArr = [];
let changeLanguage ='en';
let list = 'List';
let month = 'Month';
let today = 'Today';
let myCustomButton = 'Update';
let myCustomButton2 = 'Print';
let danger = {type: 'danger'};
let success = {type: 'success'};
if(language == 'ja'){
    changeLanguage = 'ja';
    list = 'リスト';
    month = '月';
    today = '今日';
    myCustomButton = 'アップデート';
    myCustomButton2 = '印刷';

}else if(language == 'vi'){
    changeLanguage = 'vi';
    list = 'Danh sách';
    month = 'Tháng';
    today = 'Hôm nay';
    myCustomButton = 'Cập nhật lịch';
    myCustomButton2 = 'In lịch';
}
let initialLocaleCode = changeLanguage;
let editTable = true;
let leftContent = 'prev,today,next ';
let rightContent = 'myCustomButton,myCustomButton2';
const ROLE = 0
if(userRoles !== ROLE){
    editTable = false;
    rightContent ='';
    leftContent = '';
}


document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list', 'googleCalendar','bootstrap' ],
        defaultDate: date_event?date_event:new Date(),  //change default date
        customButtons: {
            myCustomButton: {
                text: myCustomButton,
                // icon:'fa-edit',
                click: function (){
                    $('#updateCalendar').modal('show');
                    $('#submitCalendar').prop('disabled', false);
                }
            },
            myCustomButton2: {
                text:myCustomButton2,
                click: function (){
                    let divToPrint=document.getElementById('calendar');
                    let winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";
                    let newWin=window.open('','_blank',winAttr);
                    let writeDoc = newWin.document;
                    let text = '<html><head>';
                    text+='<title>ASEAN PLOTT</title>';
                    // text+= '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.css"/>';
                    // text+='<link href="'+baseURL+'/assets/css/style.bundle.css" rel="stylesheet" type="text/css"/>';
                    text+='<link rel="stylesheet" href="'+baseURL+'/css/tailwind.output.css">';
                    text+='  <link href="'+baseURL+'admins/assets/plugins/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css"/>';
                    text+='<link rel="stylesheet" href="'+baseURL+'/fullcalendar/print.css">';
                    text+= ' </head><body onload="window.print();window.close();">'+divToPrint.outerHTML+'</body></html>';
                    writeDoc.write(text);
                    writeDoc.close();
                    newWin.focus();
                }
            },
            next:{
                click: function(){
                    calendar.next();
                    loadEvent();

                }
            },
            prev:{
                click: function(){
                    calendar.prev();
                    loadEvent();

                }
            },
            today:{
                click:function (){
                    calendar.today();
                    loadEvent();
                },
                text: today,
            },

        },
        header: {
            left: leftContent,
            center: 'title',
            right: rightContent,
        },
        views: {
            dayGridMonth: { buttonText: month },
            // listMonth: { buttonText: list },
            // today: { buttonText: 'avv' }
        },
        // themeSystem: 'bootstrap',
        // firstDay: 1,
        locale: initialLocaleCode,
        displayEventTime: false, // don't show the time column in list view
        businessHours: true,
        height: 800,
        contentHeight: 780,
        aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio
        editable:editTable,
        eventLimit: true, // allow "more" link when too many events
        navLinks: true,
        // http://fullcalendar.io/docs/google_calendar/
        googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
        eventSources: [
            {
                url: 'ja.japanese.official#holiday@group.v.calendar.google.com',
                className: 'hidden',
                display: 'none',
                success: function(data) {
                    let red = 'red';
                    changeNumberColor(data,red);
                },
            },
            {
                url:'vi.vietnamese.official#holiday@group.v.calendar.google.com',
                className: 'hidden',
                display: 'none',
                success: function(data) {
                    let blue = 'blue';
                    changeNumberColor(data,blue);
                    arrEvent = data;
                },
            },
            holidayArr = holiday,
            arr,
        ],
        eventRender: function(info) {
            let element = $(info.el);
            // console.log(info.event.start);
            let image_url = info.event.extendedProps.image_url;
            if (info.event.extendedProps && info.event.extendedProps.description && info.event.extendedProps.image_url) {
                if (element.hasClass('fc-day-grid-event')) {
                    // element.data('boundary','viewport');
                    //this is tooltips of calendar
                    if(moment(info.event.start).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")){
                        if(today_user_event.replace_id != null){
                            element.data('content', today_user_event.replace_id.fullname + " (Trực bù)");
                            $(".fc-today").attr('style', 'background-color: #ff4242 !important');
                            $(".fc-day-top").css('background','none');

                            let temp_arr = image_url.split("/");
                            image_url = image_url.replace(temp_arr[temp_arr.length - 1], today_user_event.replace_id.avatar);
                            // console.log("ehe", info.event.extendedProps.image_url);
                        }else{
                            element.data('content', info.event.extendedProps.description);
                        }

                        // element.data('content', info.event.extendedProps.description);

                    }else{
                        element.data('content', info.event.extendedProps.description);
                    }
                    testinfo = info;




                    element.data('placement', 'top');
                    element.data('trigger','hover');
                    element.find("div.fc-content").prepend("<img class=\"object-cover rounded-full h-80px w-80px\" style=\"margin:0 auto;\" src='" + image_url +"'>");
                    $('.fc-unthemed .fc-day-grid td:not(.fc-axis)').css('padding','0');
                    if(info.event.extendedProps.order == user){
                        let date = info.event.start;
                        date = moment(date).format('YYYY-MM-DD');
                        $("[data-date="+date+"]").css('background','#7CB9E8');
                        $(".fc-day-top").css('background','none');
                    }
                    // $('.fc-unthemed .fc-event .fc-title, .fc-unthemed .fc-event-dot .fc-title').css('color','red');
                    KTApp.initPopover(element);
                    // console.log(element);
                } else if (element.hasClass('fc-time-grid-event')) {
                    element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                } else if (element.find('.fc-list-item-title').length !== 0) {
                    element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                }
            }else{

                element.prop('hidden',true);
            }


        },
        loading: function(isLoading) {
            KTApp.block('#calendar');
            if(!isLoading){
                KTApp.unblock('#calendar');
            }
            $('.fc-more').css('color','white');
        },
        eventDrop: function(event) {
            // returns 1-7 where 1 is Monday and 7 is Sunday
            let dateOldEvent = event.oldEvent.start;
            let dateEvent = event.event.start;
            dateOldEvent = moment(dateOldEvent);
            dateEvent = moment(dateEvent);
            let today = calendar.getDate();
            today = moment().format('DD');
            let monthday = calendar.getDate();
            monthday = moment().format('MM');
            let dateNewEvent = dateOldEvent.format('DD');
            let dateNewEvent2 = dateEvent.format('DD');

            let monthNewEvent = dateOldEvent.format('MM');
            let monthNewEvent2 = dateEvent.format('MM');
            // console.log(today);
            let dateEventstr = dateEvent.format('YYYY-MM-DD');
            let holiday = arrEvent.some(row => row.start == dateEventstr);
            if(userRoles !== 0|| !(dateEvent.month() === dateOldEvent.month()) || dateEvent.isoWeekday() == 6 || dateEvent.isoWeekday() == 7 || holiday || (dateNewEvent < today && monthNewEvent == monthday) || (dateNewEvent2 < today && monthNewEvent2 < monthday)){
                event.revert();
                $.notify(arrNotification['error_update'], danger);
            }else{
                let end = dateEvent.format('YYYY-MM-DD');
                let start = dateOldEvent.format('YYYY-MM-DD');

                $.ajax({
                    url : baseURL+"event/swap",
                    type: "post",
                    data: {
                        start,
                        end,
                    },
                    success: function (data){
                        let jsonData = $.parseJSON(data);
                        if(jsonData[0]['error']){
                            $.notify(arrNotification['error_update'], danger);
                            event.revert();
                        }else{
                            for(let i = 0; i< jsonData.length; i++){
                                let event = calendar.getEventById(jsonData[i]['id']);
                                $('.popover').removeClass();
                                $('.popover-body').text('');
                                event.remove();
                                calendar.addEvent(jsonData[i]);
                                $('[data-toggle="popover"]').popover('hide');
                            }

                            $.notify(arrNotification['success_update'], success);

                            // $('[data-toggle="tooltip"]').tooltip();
                            // KTApp.initPopover(event);
                        }
                    },
                    error: function (data){
                        $.notify(arrNotification['error_update'], danger);
                    },
                });
            }
        },
    });
    calendar.render();
    removeClickableDate();

    function changeNumberColor(data,color){
        for(let i = 0; i < data.length; i++){
            let date = data[i]['start'];
            let title = data[i]['title'];
            $("[data-date="+date+"]").css('color',''+color+'');
            $("[data-date="+date+"]").data('content', title);
            $("[data-date="+date+"]").data('placement', 'top');
            KTApp.initPopover($("[data-date="+date+"]"));
        }
    }

    $(document).ready(function(){
        add();
        changeNumberColor(holidayArr,'green');
        $('a.fc-more').css('display','none');
    });
    function add(){
        let add = '';
        let add2 = '';
        add += "<i style=\"font-weight:600; font-size:1rem;\" class=\"fa fa-edit\"></i>";
        add2 += "<i style=\"font-weight:600; font-size:1rem;\" class=\"fa fa-print\"></i>";
        $(".fc-myCustomButton-button").html(add+"  "+myCustomButton);
        $(".fc-myCustomButton2-button").html(add2+"  "+myCustomButton2 );
    }
    $('#submitCalendar').click(function (){
        if(userRoles !== ROLE){
            $.notify(arrNotification['error_update'], danger);
            $('#updateCalendar').modal('hide');
        }else{
            $(this).prop('disabled', true);
            let cdate = calendar.getDate();
            cdate = moment(cdate).format('YYYY-MM-DD');
            holidayArr = holiday;
            $.merge(arrEvent,arrEventCustom);
            $.merge(arrEvent,holidayArr);
            let eventArr = [];
            // let eventLenght = arrEvent.length;
            for (let i =0; i< arrEvent.length; i++){
                // console.log(arrEvent[i]);
                if(moment(arrEvent[i]['start']).format('YYYY-MM') === moment(cdate).format('YYYY-MM')){
                    eventArr.push(moment(arrEvent[i]['start']).format('YYYY-MM-DD'));

                }
            }

            let user = [];
            let count = $('.chkitem-user');
            let countCheck = $('.chkitem-user').filter(':checked');
            $(count).each(function (){
                let div = $(this).closest('div');
                let input = div.find('input.chkitem-user');
                user.push(
                    {
                        id_user: input.val(),
                        checked: $(this).prop('checked')
                    }
                );
            });
            // console.log(countCheck.length);
            if(countCheck.length < 1){
                $.notify(arrNotification['please_select'], danger);
                $('#updateCalendar').modal('hide');
            }else{
                $.ajax({
                    url : baseURL+"event/update/"+cdate,
                    type: "post",
                    data: {
                        date: cdate,
                        id: user,
                        dateArr: eventArr,
                    },
                    success: function (data){
                        let jsonData = $.parseJSON(data);
                        // console.log(jsonData);
                        if(jsonData[0]['error']){
                            $.notify(arrNotification['error_update'], danger);
                            $(this).prop('disabled', true);
                        }else {
                            $('#updateCalendar').modal('hide');
                            $.notify(arrNotification['success_update'], success);
                            // calendar.removeAllEvents();
                            // calendar.render();
                            calendar.removeAllEvents();
                            for(let i = 0; i <jsonData.length; i++){
                                calendar.addEventSource([{
                                    'id':jsonData[i]['id'],
                                    'start':jsonData[i]['start'],
                                    'image_url': baseURL+'/files/photo/'+jsonData[i]['image_url'],
                                    'color': '#0000',
                                    'border': '#0000',
                                    'description': jsonData[i]['description'],
                                }]);
                            }
                        }
                    },
                    error: function (data){
                        $.notify(arrNotification['error_update'], danger);
                    },
                    complete: function (){
                        $(this).prop('disabled', false);
                        $('#updateCalendar').modal('hide');
                    }
                });
            }
        }

    });

    function loadEvent(){
        add();
        let cdate = calendar.getDate();
        cdate = moment(cdate).format('YYYY-MM-DD');
        // console.log(cdate);
            $.ajax({
                url: baseURL+"event/prev/date/"+cdate,
                type: "post",
                success: function (data){
                    let jsonData = $.parseJSON(data);
                    jsonUserData = jsonData.data_user;
                    jsonData = jsonData.data;
                    // toolTip(jsonData);
                    calendar.removeAllEvents();

                    if(jsonData.length != 0){
                        $('.chkitem-user').prop('checked',false);
                        $('#userCheck').empty();
                        addHTML = '';
                        for(let i = 0; i < jsonUserData.length; i++){
                            addHTML += "<div class=\"flex items-center text-sm list-group-item\">";
                            addHTML+= "<input" +
                                "        id=\"userCheck-" + jsonUserData[i]['id'] + "\"" +
                                "        name=\"userCheck\"" +
                                "        value=\"" + jsonUserData[i]['id'] + "\"" +
                                "        type=\"checkbox\"" +
                                "        class=\"chkitem-user mr-3 text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray\"\n" +
                                "/>";
                            addHTML += "<div class=\"relative hidden w-8 h-8 mr-3 rounded-full md:block\">" +
                                "            <img  class=\"object-cover w-full h-full rounded-full\" src=\"" + baseURL + "/files/photo/" + jsonUserData[i]['avatar'] + "\" alt=\"\" loading=\"lazy\">" +
                                "            <div class=\"absolute inset-0 rounded-full shadow-inner\" aria-hidden=\"true\"></div>" +
                                "      </div>";
                            addHTML += "<div>" +
                                "            <label for=\"userCheck-" + jsonUserData[i]['id'] + "\" >" + jsonUserData[i]['fullname'] + "</label>" +
                                "       </div>";
                            addHTML += "</div>";
                        }
                        $("#userCheck").html(addHTML);

                        if(userRoles !==ROLE){
                            $('input').prop('disabled',true);
                            $('input').css('color','gray');
                            $('#userCheck > div').addClass('disabled',true);
                        }
                    }
                    // $('.checkall-user').prop('checked',)
                    if(jsonData.length > 0){
                        for(let i = 0; i <jsonData.length; i++){
                            $('#userCheck-'+jsonData[i]['id']).prop('checked',true);
                            calendar.addEventSource([{
                                'id':jsonData[i]['id'],
                                'start':jsonData[i]['start'],
                                'image_url': baseURL+'/files/photo/'+jsonData[i]['image_url'],
                                'color': '#0000',
                                'border': '#0000',
                                'description': jsonData[i]['description'],
                                'order': jsonData[i]['order'],
                            }]);

                        }
                    }


                    let color = 'green';
                    changeNumberColor(holidayArr,color);
                    // console.log(calendar.getEvents());
                    let $_checkall = true;
                    $('.chkitem-user').each(function (){
                        if(!$(this).is(':checked')){
                            $_checkall = false;
                        }
                        $('.checkall-user').prop('checked',$_checkall);
                    });
                },
            });
            removeClickableDate();
    }

    //remove click on date
    function removeClickableDate(){
        // Replace all a tags with the type of replacementTag
        console.log("sadasd");
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

    $(document).ready(function(){
        if(userRoles !==ROLE){
            $('input').prop('disabled',true);
            $('input').css('color','gray');
            $('#userCheck > div').addClass('disabled',true);
        }
    });

});





