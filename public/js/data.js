let nameType;
let colorType;
let danger = {type: 'danger'};
let success = {type: 'success'};
let id;
let id_type;
let regime;
let changeLanguage ='en';
let list = 'List';
let month = 'Month';
let today = 'Today';
let day = 'Day'
let addEvent = 'Add Transaction';
if(language == 'ja'){
    changeLanguage = 'ja';
    list = 'リスト';
    month = '月';
    today = '今日';
    addEvent = 'トランザクションを追加';
    day = '日';
}else if(language == 'vi'){
    changeLanguage = 'vi';
    list = 'Danh sách';
    month = 'Tháng';
    today = 'Hôm nay';
    addEvent = 'Thêm giao dịch';
    day = 'Ngày';
}
let initialLocaleCode = changeLanguage;
let editTable = false;
// let content = 'prev,today,next addEvent';
let content = 'prev,today,next';
const REGIME = 1;
const ROLE = 0;
if(userRoles !==ROLE){
    content = 'prev,today,next';
}

document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list', 'googleCalendar' ,'dayGrid'],
        header: {
            left: content,
            center: 'title',
            // right: 'dayGridMonth' //,dayGridDay
            right: '' //,dayGridDay
        },
        customButtons: {
            today:{
                text: today,
                click:function (){
                    calendar.today();
                    loadEvent();
                    // $('.chkitem-type, .checkall-type').prop('checked', true);
                }
            },
            // dayGridDay:{
            //     text: day,
            //     click:function (){
            //         calendar.day();
            //         // loadEvent();
            //         // $('.chkitem-type, .checkall-type').prop('checked', true);
            //     }
            // },
            next:{
                click: function(){
                    calendar.next();
                    loadEvent();
                    // $('.chkitem-type, .checkall-type').prop('checked', true);
                }
            },
            prev:{
                click: function(){
                    calendar.prev();
                    loadEvent();
                    // $('.chkitem-type, .checkall-type').prop('checked', true);
                    // calendar.refetchEvents();
                }
            },
            // addEvent:{
            //     text: addEvent,
            //     click: function(){
            //         let today = new Date();
            //         let date = today.getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
            //         $('#add-event').modal('show');
            //         $('#date').attr('value',date);
            //     }
            // }
        },
        locale: initialLocaleCode,
        displayEventTime: false, // don't show the time column in list view
        businessHours: true,
        height: 800,
        contentHeight: 780,
        aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio
        editable:editTable,
        selectable: true,
        eventLimit: 3, // allow "more" link when too many events
        navLinks: true,
        views: {
            dayGridMonth: { buttonText: month },
            // listMonth: { buttonText: list,
            // },
            dayGrid: { buttonText: day,
            },
            timeGrid: {
                eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
            }
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            successCallback(arr);
        },
        googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',

        // US Holidays
        eventSources: [
            {
                url: 'ja.japanese.official#holiday@group.v.calendar.google.com',
                color: 'red',
                success: function(data) {
                    let red = 'red';
                    changeNumberColor(data,red);
                },

            },
            {
                color: 'blue',
                url:'vi.vietnamese.official#holiday@group.v.calendar.google.com',
                success: function(data) {
                    let blue = 'blue';
                    changeNumberColor(data,blue);
                },
            },

        ],
        // dayRender: function(info) {
        //     console.log(info.date.toISOString());
        //
        // },
        dateClick: function(info) {
            if(userRoles == ROLE){
                $('#add-event').modal('show');
                $('.null-sum,.null-user').hide();
                $('textarea').val('');
                $('#add-event').find('form').trigger('reset');
                let dateStr = info.dateStr;
                $('#date').attr('value',dateStr);
                $('#add-event').find('form').trigger('reset');
                $('#sum_trans').prop('disabled', false);
                $('.regime-1-user').prop('hidden',false);
                $('.regime-0-user').prop('hidden',true);
                $('#submit').prop('disabled', true);
                $('.sum-detail').prop('disabled', true);
                $('#count5,#sums2').text('0');
                let countUserCheck = $('.chkitem3').filter(':checked').length;
                $('#count3,#count').text(countUserCheck);
                // $('textarea').focus().val('sda');
                $('#sum_trans').typeahead('val','');
                $('.notvail-date').hide();
                // $("#date").datepicker({
                //     dateFormat: 'dd/mm/yyyy'
                // });
            }
        },

        eventClick: function (info){
            id = info.event.id;
            let title = info.event.title;
            $('#title').text(title);
            $('.notvail-date2').hide();
            $.ajax({
                url: baseURL + "transaction/info/id/"+id,
                type: "get",
                success: function (detail){
                    if(userRoles == ROLE){
                        $('#edit-event').modal('show');
                        let jsonDetail = $.parseJSON(detail);
                        let numberTrans = Math.abs(jsonDetail[0]['sum_trans']);
                        numberTrans = String(numberTrans);
                        let stringTrans = numberTrans.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        $('#sum_trans2').val(stringTrans);
                        $('#date2').val(jsonDetail[0]['date_trans']);
                        $('#note2').val(jsonDetail[0]['note']);
                        $('#plus_minus2').val(jsonDetail[0]['plus_minus']);
                        $('#type2').val(jsonDetail[0]['id_type']);
                        $('.null-sum2, .null-user2').hide();
                        if(jsonDetail[0]['plus_minus'] == 1){
                            $('#plus_minus2').prop('checked',true);
                            $('#labelPlus2').attr('data-content', arrMode['plus']);
                        }else{
                            $('#plus_minus2').prop('checked',false);
                            $('#labelPlus2').attr('data-content', arrMode['minus']);
                        }
                        regime = jsonDetail[0]['regime'];
                        $('#regime2').prop('disabled',true);
                        if(regime == REGIME){
                            $('#sum_trans2').prop('disabled', false);
                            $('.regime-edit-1').prop('hidden',false);
                            $('.regime-edit-0').prop('hidden',true);
                            $('#submit2').prop('disabled',false);
                            $('#checkAll4').prop('checked', $('.chkitem4').length == jsonDetail.length);
                            for(let i = 0 ; i< jsonDetail.length; i++){
                                $('#user4-'+jsonDetail[i]['id']).prop('checked',true);
                            }
                            $('#count4').text($('.chkitem4').filter(':checked').length);
                            $('#labelRegime2').attr('data-content', arrMode['equal']);
                            let num_detail = formatNum(Math.abs(Math.round(jsonDetail[0]['sum_detail'])));
                            $('#sums').text(num_detail+' VND');
                        }else{
                            // $('#submit2').prop('disabled', true);
                            $('#sum_trans2').prop('disabled', true);
                            $('#labelRegime2').attr('data-content', arrMode['not_equal']);
                            $('#regime2').prop('checked', false);
                            $('.regime-edit-0').prop('hidden',false);
                            $('.regime-edit-1').prop('hidden',true);
                            $('#checkAll2').prop('checked', $('.chkitem2').length == jsonDetail.length);
                            $('.sum-detail2').prop('disabled',true);
                            for(let i = 0 ; i< jsonDetail.length; i++){
                                $('#user2-'+jsonDetail[i]['id']).prop('checked',true);
                                $('#sum-detail2-'+jsonDetail[i]['id']).prop('disabled',false);
                                $('#sum-detail2-'+jsonDetail[i]['id']).on({
                                    keyup: function() {
                                        formatCurrency($(this));
                                    }
                                });
                                let num_detail = formatNum(Math.abs(Math.round(jsonDetail[i]['sum_detail'])));
                                $('#sum-detail2-'+jsonDetail[i]['id']).val(num_detail);
                            }
                            $('#count2').text($('.chkitem2').filter(':checked').length);

                        }
                    }else{
                        let jsonDetail = $.parseJSON(detail);
                        let edit_event =  $('#edit-event');
                        edit_event.find('.modal-header').remove();
                        edit_event.find('form').remove();
                        edit_event.find('.modal-content').empty();
                        let plus = jsonDetail[0]['plus_minus'] == 1 ? arrMode['plus']: arrMode['minus'];
                        let regime = jsonDetail[0]['regime'] == 1 ? arrMode['equal']: arrMode['not_equal'];
                        let addHTML;
                        addHTML = '<div class="modal-header">\n' +
                            '                    <h4 class="modal-title" id="title"></h4>\n' +
                            '                    <button type="button" class="close" data-dismiss="modal">×</button>\n' +
                            '                </div>'+
                            '<div class="card-body ">' +
                            '         <div class="row justify-content-center bgi-size-cover bgi-no-repeat pt-8 px-md-0" style="background-image: url(/assets/media/bg/bg-6.jpg);">\n' +
                            '             <div class="col-md-9">' +
                            '                  <div class="d-flex justify-content-between flex-column flex-md-row">' +
                            '                     <h1 class="display-5 text-white font-weight-boldest mb-8">'+jsonDetail[0]['name_type']+'</h1>' +
                            '                     <div class="d-flex flex-column align-items-md-end px-0">\n' +
                            '                           <span class="text-white d-flex flex-column align-items-md-end opacity-70">\n' +
                            '                               <span>'+regime+'</span>\n' +
                            '                               <span>'+plus+'</span>\n' +
                            '                               <span>'+words['time']+': '+formatDate(jsonDetail[0]['date_trans'])+'</span>\n' +
                            '                           </span>\n' +
                            '                      </div>' +
                            '                   </div>' +
                            '              </div>' +
                            '          </div>' +
                            '          <div class="row justify-content-center">' +
                            '             <div class="col-md-9">' +
                            '                <div class="table-responsive">' +
                            '                   <table class="table">' +
                            '                      <thead>' +
                            '                        <tr>' +
                            '                          <th class="px-0">STT</th>' +
                            '                          <th class="px-0">'+words['participants']+'</th>' +
                            '                          <th class="px-0 text-right">'+words['amount']+'<span class="text-danger">'+" (VND)"+'</span>'+'</th>' +
                            '                        </tr>' +
                            '                      </thead>' +
                            '                      <tbody>';
                        for(let i = 0; i < jsonDetail.length; i++){
                            let full_name = jsonDetail[i]['fullname'];
                            let username = jsonDetail[i]['username'].split("@");
                            let stt = i+1;
                            addHTML += "<tr class=\"list-hover\">" +
                                "          <td class=\"p-0\">"+stt+"</td>" +
                                "          <td class=\"p-0\">"+full_name+"<span class='text-danger'>"+" ("+username[0]+")"+"</span>"+"</td>" +
                                "          <td class=\"p-0 text-right text-danger\">"+formatNum(Math.abs(Math.round(jsonDetail[i]['sum_detail'])))+"</td>" +
                                "       </tr>";
                        }
                        addHTML += '</tbody>' +
                            '                                            </table>' +
                            '                                        </div>' +
                            '                                    </div>' +
                            '                                </div>' +
                            '                                <div class="row justify-content-center bg-gray-100">' +
                            '                        <div class="col-md-9">' +
                            '                            <div class="d-flex justify-content-between flex-column flex-md-row font-size-lg my-2">' +
                            '                                <div class="d-flex flex-column mb-10 mb-md-0">' +
                            '                                    <span class="font-size-lg font-weight-bolder mb-1 text-uppercase">'+words['number_participants']+'</span>' +
                            '                                    <span class="font-size-h2 font-weight-boldest text-danger mb-1 text-right">'+jsonDetail[0]['total']+'</span>' +
                            '                                   </div>' +
                            '                                <div class="d-flex flex-column text-md-right">' +
                            '                                    <span class="font-size-lg font-weight-bolder mb-1 text-uppercase">'+words['total']+'<span class="text-danger">'+" (VND)"+'</span>'+'</span>' +
                            '                                    <span class="font-size-h2 font-weight-boldest text-danger mb-1">'+formatNum(Math.abs(Math.round(jsonDetail[0]['sum_trans'])))+'</span>' +
                            '                                </div>' +
                            '                            </div>' +
                            '                        </div>' +
                            '                    </div>' +
                            '                            </div>' +
                            '                            <div>' +
                            // '                                <button type="button" class="btn btn-dark" data-dismiss="modal">'+words['back']+'</button>' +
                            '                            </div>';
                        edit_event.find('.modal-content').html(addHTML);
                        edit_event.modal('show');
                    }
                }
            });

        },
        loading: function(isLoading) {
            KTApp.block('#kt_calendar');
            if(!isLoading){
                KTApp.unblock('#kt_calendar');
            }
        },
        eventRender: function (info){
            let element = $(info.el);
            info.el.style.display = $('.checkall-type').is(':checked')? "none":"block";
            checkItemEvent(info);
            checkEvent(info);

            if (info.event && info.event.title && info.event.extendedProps && info.event.extendedProps.list_username) {
                let string = info.event.extendedProps.list_username;
                string = string.split(",");
                let length = string.length;
                let htmlContent = `<ul class=\'list-style-type content-tooltip ml-6\'>`;
                    string.forEach(function (e){
                    htmlContent += `<li class=\'text-wrap-hidden\'>${e}</li>`;
                });
                htmlContent += `</ul>`;
                let sum = formatNum(info.event.extendedProps.sum_trans);
                let sumContent = '';
                if(sum.indexOf('-') == '-1'){
                    sumContent  = `<span class=\'label label-inline  label-light-primary\'>${words['total']}: ${sum} VND</span><span class=\'label label-inline ml-0\'>${words['number_of_member']}: ${length}</span>`;
                }else{
                    sumContent  = `<span class=\'label label-inline  label-light-danger\'>${words['total']}: (${sum}) VND</span><span class=\'label label-inline ml-0\'>${words['number_of_member']}: ${length}</span>`;
                }
                // let htmlContent = $('<div></div>')

                // string = string.replace(/,/g, ",      ");
                if (element.hasClass('fc-day-grid-event')) {
                    element.popover({
                        'title': info.event.title,
                        'trigger':'hover',
                        'placement':'top',
                        'content':sumContent+`<br/><br/>`+htmlContent,
                        'html':true,
                    });
                    KTApp.initPopover(element);
                } else if (element.hasClass('fc-time-grid-event')) {
                    element.find('.fc-title').append('<div class="fc-description">' + info.event.title + '</div>');
                } else if (element.find('.fc-list-item-title').length !== 0) {
                    element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.title + '</div>');
                }
            }else{
                element.prop('hidden',true);
            }
            // $('.popover-header').css('color','red');
        },
    });
    calendar.render();
    removeClickableDate();

    //button add transaction
   $('#button-add-transaction').click(function (){
       let today = new Date();
       let date = today.getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
       $('#add-event').modal('show');
       $('#date').attr('value',date);
       $('#count5,#sums2').text('0');
       let countUserCheck = $('.chkitem3').filter(':checked').length;
       $('#count3,#count').text(countUserCheck);
       // $('textarea').focus().val('sda');
       $('#sum_trans').typeahead('val','');
       $('.notvail-date').hide();
   });
   //button reset modal add transaction
    $('#reset').click(function (){
        $('#submit').prop('disabled', true);
    })

    $('#add-event').on('shown.bs.modal', function () {
        $('#sum_trans').trigger('focus');
    })
    function changeNumberColor(data,color){
        for(let i = 0; i < data.length; i++){
            let date = data[i]['start'];
            let title = data[i]['title'];
            $("[data-date="+date+"]").find('a').css('color',''+color+'');
            $("[data-date="+date+"]").data('content', title);
            $("[data-date="+date+"]").data('placement', 'top');
            KTApp.initPopover($("[data-date="+date+"]"));
        }
    }

    // $(document).ready(function(){
    //     changeNumberColor(holidayArr,'green');
    // });
    //
    function checkEvent(info){
        $('.chkitem-type').change(function(){
            checkItemEvent(info);
        });
        $('.checkall-type').change(function(){
            if(!$(this).prop('checked')){
                info.el.style.display = 'none';
            }else{
                info.el.style.display = 'block';
            }
        });
    }
    function checkItemEvent(info){
        $('.chkitem-type').each(function(){
            if($(this).prop('checked')){
                if($(this).val() == info.event.extendedProps.id_type){
                    info.el.style.display = 'block';
                }
            }else{
                if($(this).val() == info.event.extendedProps.id_type){
                    info.el.style.display = 'none';
                }
            }
        });
    }

    $('#submitType').click(function (){
        $(this).prop('disabled', true);
        $.ajax({
            url: baseURL+ "transaction/addtype/",
            type: "post",
            data: {
                color_type: $('#colorPicker').val(),
                name_type: $('#name_type').val()
            },
            success: function (datatype){
                let jsonData = $.parseJSON(datatype);
                if((jsonData[0]['null'])){
                    $(".null").show();
                }
                else if((jsonData[0]['errors'])){
                    $(".exist").show();
                }else if((jsonData[0]['error'])){
                    $.notify(arrNotification['error_add'],danger);
                }
                else{
                    $('#add-type').modal('hide');
                    $('#add-event').modal('show');
                    $.notify(arrNotification['success_add'],success);

                    $('#type').prepend(
                        `
                     <option id="type-option-${jsonData[0]['id_Type']}" value="${jsonData[0]['id_Type']}">${jsonData[0]['nameType']}</option>
                     `
                    );
                    $('#type2').prepend(
                        `
                     <option id="type-option${jsonData[0]['id_Type']}" value="${jsonData[0]['id_Type']}">${jsonData[0]['nameType']}</option>
                     `
                    );
                    $('#color_type').val(jsonData[0]['colorType']);
                    $('#type').val(jsonData[0]['id_Type']);
                    $('#typeCheck').append(
                        ` 
                            <label style="margin-bottom:0px" class="items-center list-group-item list-transaction">
                                <div  class="list-transaction-item " >
                                        <input
                                                checked
                                                data-color="${jsonData[0]['colorType']}"
                                                style="color: ${jsonData[0]['colorType']}"
                                                id="typeCheck${jsonData[0]['id_Type']}"
                                                name="typeCheck"
                                                value="${jsonData[0]['id_Type']}"
                                                type="checkbox"
                                                class="chkitem-type text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none focus:shadow-outline-purple"
                                        />
                                        <span class="ml-2" id="span-name-type${jsonData[0]['id_Type']}">${jsonData[0]['nameType']}</span>

                                    
                                       <div  class="float-right">
                                           <button type="button" class="button-change" data-toggle="tooltip" data-placement="top" title="${words['edit']}"><i  class=" ml-2 la la-edit" style="color: black"></i></button>
                                           <button type="button"  class="button-delete-trans" data-toggle="tooltip" data-placement="top" title="${words['delete']}"><i class="ml-2 la la-trash" style="color: black"></i></button>

                                       </div>
                                       
                                </div>
                            </label>
                        `
                    );

                }
            },
            complete: function (){
                $('#submitType').prop('disabled', false);
                $('#add-type').find('form').trigger('reset');
            }
        });
    });
    let patternDate = '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$';
    function checkDate(date){
        let substrRegex;
        substrRegex = new RegExp(patternDate);
        return substrRegex.test(date);
    }

    $('#submit').click(function (){
        $(this).prop('disabled', true);
        let detail = [];
        let count;
        let sum_tran = 0;
        let plus_minus = 1;
        let regimes;
        if( !$('#regime').is(':checked')){
            regimes = 0;
            count = $('.chkitem').filter(':checked');
            $(count).each(function(){
                let tr = $(this).closest('tr');
                let inputDetail = 0;
                let inputUser = tr.find('input.chkitem');
                inputDetail = tr.find('input.sum-detail');
                inputDetail = inputDetail.val().replace(/,/g, '');
                inputDetail = parseFloat(inputDetail);
                inputDetail = Math.round(inputDetail*1000)/1000;
                (isNaN(inputDetail))? inputDetail = 0:'';
                detail.push(
                    {
                        user: inputUser.val(),
                        sum_detail: inputDetail
                    }
                );
                sum_tran += inputDetail;
            });
            $('#sum_trans').val(sum_tran);
            // console.log(detail);
        }else{
            regimes = 1;
            count = $('.chkitem3').filter(':checked');
            $(count).each(function(){
                let div = $(this).closest('div');
                let inputDetail = 0;
                let inputUser = div.find('input.chkitem3');
                let strSum = $("#sum_trans").val().replace(/,/g, '');
                // (strSum.length) > 1 ? 'a': 'a';
                inputDetail = Math.round((strSum)/(count.length) * 1000) / 1000;
                detail.push(
                    {
                        user: inputUser.val(),
                        sum_detail: inputDetail
                    }
                );

            });
        }
        let date = $('#date').val();
        let dateValid = checkDate(date);
        if($('#plus_minus').is(':checked')){
            plus_minus = 1;
        }else{
            plus_minus = 0;
        }
        sum_tran = $("#sum_trans").val().replace(/,/g, '');
        if(sum_tran.length <1 || sum_tran ==0){
            $('.null-sum').show();
            $('#submit').prop('disabled', false);
        }else if(count.length < 1){
            $('.null-user').show();
            $('#submit').prop('disabled', false);
        }else if($('#type').val() == '' ||$('#type').val() == null){
            $('.null-type').show();
            $('#submit').prop('disabled', false);
        }else if(dateValid == false){
            $('#submit').prop('disabled', false);
            $('.notvail-date').show();
        }
        else{
            $(this).prop('disabled', true);
            $.ajax({
                url : baseURL+"transaction/add",
                type: "post",
                data: {
                    date: $('#date').val(),
                    sum_tran: sum_tran,
                    type: $('#type').val(),
                    note: $('#note').val(),
                    plus_minus: plus_minus,
                    regime: regimes,
                    detail: detail
                },
                success: function (data){
                    let jsonData = $.parseJSON(data);
                    if(jsonData[0]['error']){
                        $.notify(arrNotification['error_add'], danger);
                    }else{
                        $('#submit').prop('disabled', true);
                        $.notify(arrNotification['success_add'], success);
                        // console.log(jsonData);
                        calendar.addEventSource([{
                            'id': jsonData[(jsonData.length-1)]['id'],
                            'title': jsonData[(jsonData.length-1)]['title'],
                            'start': jsonData[(jsonData.length-1)]['start'],
                            'color': jsonData[(jsonData.length-1)]['color'],
                            'id_type': jsonData[(jsonData.length-1)]['id_type'],
                            'list_username': jsonData[(jsonData.length-1)]['list_username'],
                            'sum_trans':jsonData[(jsonData.length-1)]['sum_trans'],
                        }]);
                        $('.fc-event-title').attr('data-idType',jsonData[(jsonData.length-1)]['id_type']);
                    }
                },
                error: function (data){
                    $('#add-event').modal('hide');
                    $.notify(arrNotification['error_add'], danger);

                },
                complete: function (){
                    // calendar.refetchEvents();
                    // $('#submit').prop('disabled', false);
                    $('#add-event').modal('hide');
                    $('.regime-0-user').prop('hidden',true);
                    $('.regime-1-user').prop('hidden',false);
                    // $('#add-event').find('form').trigger('reset');

                }
            });
        }
    });

    $('#submit2').click(function (){
        $(this).prop('disabled', true);
        let count;
        let detail = [];
        let sum_tran2 = 0;
        let plus_minus2 = 1;
        if (regime == REGIME){
            count = $('.chkitem4').filter(':checked');
            $(count).each(function(){
                let div = $(this).closest('div');
                let inputDetail = 0;
                let inputUser = div.find('input.chkitem4');
                let strSum = $("#sum_trans2").val().replace(/,/g, '');
                // (strSum.length) > 1 ? 'a': 'a';
                inputDetail = Math.round((strSum)/(count.length) * 1000) / 1000;
                detail.push(
                    {
                        user2: inputUser.val(),
                        sum_detail2: inputDetail
                    }
                );

            });
        }else{
            count = $('.chkitem2').filter(':checked');
            count.each(function (){
                let tr = $(this).closest('tr');
                let inputDetail = 0;
                let inputUser = tr.find('input.chkitem2');
                inputDetail = tr.find('input.sum-detail2');
                inputDetail = inputDetail.val().replace(/,/g, '');
                inputDetail = parseFloat(inputDetail);
                inputDetail = Math.round(inputDetail*1000)/1000;
                (isNaN(inputDetail))? inputDetail = 0: '';
                inputDetail == 0 ? $('#submit2').prop('disabled',true): $('#submit2').prop('disabled',false);
                detail.push(
                    {
                        user2: inputUser.val(),
                        sum_detail2: inputDetail
                    }
                );
                sum_tran2 += inputDetail;
            });
            $('#sum_trans2').val(sum_tran2);
        }
        if($('#plus_minus2').is(':checked')){
            plus_minus2 = 1;
        }else{
            plus_minus2 = 0;
        }
        sum_tran2 = $("#sum_trans2").val().replace(/,/g, '');
        let date = $('#date2').val();
        let dateValid = checkDate(date);
        if(count.length < 1){
            $('.null-user2').show();
            $('#submit2').prop('disabled', false);
        }else if(sum_tran2.length <1 || sum_tran2 ==0){
            $('#submit2').prop('disabled', false);
            $('.null-sum2').show();
        }else if(dateValid == false){
            $('#submit2').prop('disabled', false);
            $('.notvail-date2').show();
        }
        else{
            $(this).prop('disabled', true);
            $.ajax({
                url: baseURL + "transaction/edit/id/"+id,
                type: "post",
                data: {
                    date: $('#date2').val(),
                    sum_trans2: sum_tran2,
                    type2: $('#type2').val(),
                    note2: $('#note2').val(),
                    plus_minus2: plus_minus2,
                    regime: regime,
                    detail: detail
                },
                success: function (data2){
                    let jsonData2 = $.parseJSON(data2);
                    console.log(jsonData2);
                    if((jsonData2[0]['error'])){
                        $.notify(arrNotification['error_update'], danger);
                    }else{
                        $.notify(arrNotification['success_update'], success);
                        let id_edit = calendar.getEventById(jsonData2[0]['id']);
                        id_edit.remove();
                        calendar.addEventSource([{
                            'id': jsonData2[0]['id'],
                            'title': jsonData2[0]['title'],
                            'start': jsonData2[0]['start'],
                            'color': jsonData2[0]['color'],
                            'id_type': jsonData2[0]['id_type'],
                            'list_username': jsonData2[0]['list_username'],
                            'sum_trans':jsonData2[0]['sum_trans'],
                        }]);
                    }
                },
                error: function (error){
                    $.notify(arrNotification['error_update'], danger);

                },
                complete: function (){
                    $('#submit2').prop('disabled', false);
                    $('#edit-event').modal('hide');
                }
            });
        }
    });

    $('#submit_delete').click(function (){
        $.ajax({
            url: baseURL + "transaction/delete/id/"+id,
            type: "post",
            success: function (data_del){
                let jsonDatadel = $.parseJSON(data_del);
                if((jsonDatadel[0]['error'])){
                    $.notify(arrNotification['error_delete'], danger);
                }else{
                    $.notify(arrNotification['success_delete'], success);
                    calendar.getEventById(id).remove();
                }

            },
            error: function (error){
                $.notify(arrNotification['error_delete'], success);
            }, complete: function (){
                $('#submit2').prop('disabled', false);
                $('#delete-event').modal('hide');
            },
        });
    });

    let arrMatches = [];
    let isSubmitChangType = true;
    //Button change type
    $('.typeCheck').on('click','.button-change',function (e){
        // e.stopPropagation();
        isSubmitChangType = true;
        $('#submit-changeType').prop('disabled',false);
        let nameType = $(this).parents('.list-transaction-item').find('span').text();
        let colorType = $(this).parents('.list-transaction-item').find('input').data('color');
        $('#change_nameType').val(nameType);
        $('#change_colorType').val(colorType);
        $('#change-type').modal('show');
        $('.invalid-feedback').hide();
        $(this).parent().parent().parent().siblings('label').each(function (){
            arrMatches.push($(this).find('div').find('span').text());
        });
        // e.stopPropagation();
    });
    //Button delete type
    $('.typeCheck').on('click','.button-delete-trans',function (info){
        $('#delete-typeTrans').modal('show');
    });

    $('#change_nameType').on('keyup',function(event){
        if($(this).val() == ''){
            $('.null2').show();
            $('#submit-changeType').prop('disabled',true);
        }else{
            $('.null2').hide();
            if(jQuery.inArray($(this).val(), arrMatches) !== -1){
                $('#submit-changeType').prop('disabled',true);
                $('.exist2').show();
                isSubmitChangType = false;
            }else {
                $('#submit-changeType').prop('disabled',false);
                $('.exist2').hide();
                isSubmitChangType = true;
            }
        }
    });

    $('#submit-changeType').click(function (){
        $('#submit-changeType').prop('disabled',true);
        if($('#change_nameType').val() == '' || isSubmitChangType == false){
            $('#change-type').modal('hide');
            $.notify(arrNotification['error_update'], danger);
            $('#submit-changeType').prop('disabled',false);
        }else{
            $.ajax({
                url: baseURL + "transaction/changetype/",
                type: 'post',
                dataType: "json",
                data: {
                    'color_type': $('#change_colorType').val(),
                    'id_type': id_Type,
                    'name_type': $('#change_nameType').val(),
                },
                success: function(jsonData){
                    if(jsonData['error']){
                        $.notify(arrNotification['error_update'], danger);
                    }else if(jsonData['success']) {
                        $('#change-type').modal('hide');
                        $.notify(arrNotification['success_update'], success);
                        let colorType;
                        colorType = jsonData['colorType'];
                        let id = jsonData['idType']
                        let elementColorUpdate = $(`.chkitem-type[data-id="${id}"]`);
                        if(elementColorUpdate){
                            elementColorUpdate.data('color',jsonData['colorType']);
                            elementColorUpdate.parent('.actives').parent().css({'background':colorType});
                        }
                        // $(this).parent().attr('data-color',jsonData['colorType']);
                        $('#color_type, #change_colorType').val(colorType);
                        $('#type-option-'+jsonData['idType']).text(jsonData['nameType']);
                        $('#type-option'+jsonData['idType']).text(jsonData['nameType']);
                        $('#span-name-type'+jsonData['idType']).text(jsonData['nameType']);
                        $('#typeCheck'+jsonData['idType']).css('color',colorType);
                        $('#typeCheck'+jsonData['idType']).attr('data-color',colorType);


                        let events = calendar.getEvents();
                        events.forEach(function (e){
                            if(e._def.extendedProps && e._def.extendedProps.id_type){
                                if(e._def.extendedProps.id_type == jsonData['idType']){
                                    e.setProp('title',jsonData['nameType']);
                                    e.setProp('color',jsonData['colorType']);
                                }
                            }
                        });

                    }else if(jsonData['exist']){
                        $('.exist2').show();
                        $('#submit-changeType').prop('disabled',false);
                    }
                },
                error: function (error){
                    $.notify(arrNotification['error_update'], danger);
                },
                complete: function (){
                    $('#submit-changeType').prop('disabled',false);
                }
            });
        }
    });

    $('.typeCheck').on('click','.list-transaction-item',function (e){
        $('#button-change,#button-delete-trans').prop('disabled', false);
        $('#bt-change, #bt-delete').removeClass('disabled');
        if (!$(this).hasClass('actives')) {
            if($(this).find('input').is(':checked')){
                id_Type = $(this).find('input').val();
                const nameType = $(this).find('span').text();
                // const colorType = $(this).find('input').data('color');
                if($(this).data('color')){
                    colorType  = $(this).data('color');
                }else{
                    colorType  = $(this).find('input').data('color');
                }
                const a = $(this).parent();
                $(a).css({'background': colorType});
                $(a).find('div').find('i').css('color','white');
                $(a).find('div').find('span').css('color','white');
                $(a).css({'color':'white'});
                $(this).addClass('actives');
            }else{
                id_Type = $(this).find('input').val();
            }
        } else{
            $(this).find('div').find('i').css('color','black');
            $(this).children('span').css('color','black');
            $(this).parent().css({'background':''});
            $(this).css({'background':'','color':'black'});
            $(this).removeClass('actives');
        }

        // let checkStatus = $(this).find('input').is(':checked')
        // $(this).find('input').prop('checked', !checkStatus);
        return true;


    });
    //Check itemType
    $(document).on('click','.checkall-type', function(){
        let $_this = $(this);
        if($(this).is(':checked')){
            $('.typeCheck > label > div').not('.actives').each(function(){
                id_Type = $(this).find('input').val();
                const nameType = $(this).find('span').text();
                // const colorType = $(this).find('input').data('color');
                if($(this).data('color')){
                    colorType  = $(this).data('color');
                }else{
                    colorType  = $(this).find('input').data('color');
                }
                const a = $(this).parent();
                $(a).css({'background': colorType});
                $(a).find('div').find('i').css('color','white');
                $(a).find('div').find('span').css('color','white');
                $(a).css({'color':'white'});
                $(this).addClass('actives');
            });

        }else{
            id_Type = $(this).find('input').val();
            $('.typeCheck > label > div.actives').each(function(){
                $(this).parent().css({'background':'','color':'black'});
                $(this).find('span').css({'color':'black'});
                $(this).find('div').find('i').css({'color':'black'});
                $(this).removeClass('actives');
            });
        }
        $('.chkitem-type').prop('checked', $_this.prop('checked'));

    });
    $(document).on('change', '.chkitem-type', function(){
        let $_checkedall = true;
        $('.chkitem-type').each(function(){
            if(!$(this).is(':checked')){
                $_checkedall = false;
            }
            $('.checkall-type').prop('checked', $_checkedall);
        });

    });

    // $(function(){
    //     var $win = $(window);
    //     var $box = $(".typeCheck");
    //     $win.on("click.Bst", function(event){
    //         if ($box.has(event.target).length == 0){
    //             $('.actives').parent().css({'background':'','color':'black'});
    //             $('.actives').css({'background':'','color':'black'});
    //             $('#bt-change, #bt-delete').css({'background':'','color':'black'});
    //             $('.la-edit, .la-trash').css({'background':'','color':'black'});
    //             $('.actives').find('span').css('color','black');
    //             $('.typeCheck > label> div').removeClass('actives');
    //         }
    //     });
    // });
    $('#submit_deleteTypeTrans').click(function (e){
        e.stopPropagation();
        $(this).prop('disabled',true);
            $('#delete-typeTrans').modal('hide');
            $.ajax({
                url: baseURL + "transaction/deletetype/",
                type: 'post',
                data: {
                    'id_type': id_Type,
                },
                success: function (data){
                    $('#submit_deleteTypeTrans').prop('disabled',false);
                    let jsonData = $.parseJSON(data);
                    if(jsonData[0]['error']){
                        $.notify(arrNotification['error_delete'], danger);
                    }else if(jsonData[0]['success']) {
                        $.notify(arrNotification['success_delete'], success);
                        $('#span-name-type'+jsonData[0]['id_type']).parent().parent().remove();
                        $('#type-option-'+jsonData[0]['id_type']).remove();
                        $('#type-option'+jsonData[0]['id_type']).remove();
                        let events = calendar.getEvents();
                        events.forEach(function (e){
                            if(e._def.extendedProps && e._def.extendedProps.id_type){
                                if(e._def.extendedProps.id_type == jsonData[0]['id_type']){
                                    e.remove();
                                }
                            }
                        });
                        // $('#bt-change, #bt-delete').css({'background':'','color':'#7e8299'});
                        // $('.la-edit, .la-trash').css({'background':'','color':'#7e8299'});
                        // $('#button-change,#button-delete-trans').prop('disabled', true);
                        // $('#bt-change, #bt-delete').addClass('disabled');
                        $('#submit_deleteTypeTrans').modal('hide');
                    }
                },
                error: function (error){
                    $.notify(arrNotification['error_delete'], danger);
                },
                complete: function (){
                    $('#submit_deleteTypeTrans').prop('disabled',false);
                    calendar.refetchEvents();
                }
            });

    });

    function loadEvent(){
        let cdate = calendar.getDate();
        cdate = moment(cdate).format('YYYY-MM');
        $.ajax({
            url: baseURL+"transaction/prev/date/"+cdate,
            type: "post",
            success: function (data){

                var jsonData = $.parseJSON(data);
                calendar.removeAllEvents();
                for(let i = 0; i <jsonData.length; i++){
                    calendar.addEventSource([{
                        'id'      :jsonData[i]['id'],
                        'title'   : jsonData[i]['title'],
                        'start'   :jsonData[i]['start'],
                        'color'   :jsonData[i]['color'],
                        'id_type' : jsonData[i]['id_type'],
                        'list_username':jsonData[i]['list_username'],
                        'sum_trans':jsonData[i]['sum_trans'],
                    }]);
                }
                removeClickableDate();
            },
        });
    }

    $('#edit-event').on('hidden.bs.modal', function () {
        $('#edit-event form')[0].reset();
    });
    $('#add-event').on('hidden.bs.modal', function () {
        $('#add-event form').trigger('reset');
        $('textarea').text('');
        $('.null-type').hide();
    });
    function formatNum(numberTrans) {
        numberTrans = String(numberTrans);
        numberTrans = numberTrans.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return numberTrans;
    }
    function formatNumber(n) {
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    function formatCurrency(input) {
        let input_val = input.val();
        if (input_val === "") { return; }
        let original_len = input_val.length;
        let caret_pos = input.prop("selectionStart");
        if (input_val.indexOf(".") >= 0) {
            let decimal_pos = input_val.indexOf(".");
            let left_side = input_val.substring(0, decimal_pos);
            let right_side = input_val.substring(decimal_pos);
            left_side = formatNumber(left_side);
            right_side = formatNumber(right_side);
            right_side = right_side.substring(0, 2);
            input_val = left_side + "." + right_side;
        } else {
            input_val = formatNumber(input_val);
            input_val = input_val;
        }
        input.val(input_val);
        let updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }
    // $(document).ready(function(){
    //     if(userRoles !==ROLE){
    //         $('select, textarea, input.form-control,input.chkitem4, input.checkall4, input.plus_minus2, input.checkall2, input.chkitem2, input.sum_trans2').prop('disabled',true);
    //
    //     }
    // });

    //remove click on date
    function removeClickableDate(){
        // Replace all a tags with the type of replacementTag
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

});
