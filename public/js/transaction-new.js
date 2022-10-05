let changeLanguage ='en';
var event_list = [];
let arr_notification = arrNotification;
let list = 'List';
let month = 'Month';
let today = 'Today';
let day = 'Day'
let addEvent = 'Add Transaction';
if(language === 'ja'){
    changeLanguage = 'ja';
    list = 'リスト';
    month = '月';
    today = '今日';
    addEvent = 'トランザクションを追加';
    day = '日';
}else if(language === 'vi'){
    changeLanguage = 'vi';
    list = 'Danh sách';
    month = 'Tháng';
    today = 'Hôm nay';
    addEvent = 'Thêm giao dịch';
    day = 'Ngày';
}
const ROLE = 0;
const USER_ROLE = userRoles;
let content = 'prev,today,next';
let initialLocaleCode = changeLanguage;
let event_id = "";
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('kt_calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'dayGrid'],
        isRTL: KTUtil.isRTL(),
        header: {
            left: content,
            center: 'title',
            right: ''
        },
        customButtons: {
            today: {
                text: today,
                click: function () {
                    calendar.today();
                }
            },
        },
        businessHours: true,
        height: 800,
        contentHeight: 780,
        locale: initialLocaleCode,
        editable: false, // not drop drag event
        eventLimit: 4, // allow "more" link when too many events
        navLinks: false, //not click event (is link)
        eventSources: [
            {
                url: baseURL + "transaction-new/get-data-json",
            },
        ],
        dateClick: function (event) {
            if(USER_ROLE !== ROLE){
                return false;
            }
            let start = event.dateStr;
            $('#modal_transaction').modal('show');
            let transaction_date = $('.transaction_date');
            transaction_date.datepicker('setDate',moment(start).format('DD/MM/YYYY'));
            getDataTransactionType();
            change_regime();
            showPopover();
            checkInput();
            let modal_title_transaction = $('#modal_title_transaction');
            modal_title_transaction.text(translate['transaction_information']);
            event_id = "";
            $('.transaction_amount').typeahead('val', '');
        },
        eventClick: function (event) {
            // if(USER_ROLE !== ROLE){
            //     return false;
            // }
            $('.transaction_amount').typeahead('val', '');
            getDataTransactionType();
            $('#modal_transaction').modal('show');
            event_id = event.event.id;
            let event_title = event.event.title;
            let event_start = event.event.start;
            let color_event = event.event._def.ui.backgroundColor;
            $.ajax({
                url: baseURL + "transaction/info/id/"+event_id,
                type: "get",
                dataType: "json",
                success: function (response){
                    if(USER_ROLE !== ROLE){
                        getDataCondition(response);
                    }else{
                        // getDataTransactionType();
                        showPopover();
                        refreshSelectTransactionType();
                        let modal_title_transaction = $('#modal_title_transaction');
                        let transaction_date = $('.transaction_date');
                        modal_title_transaction.text(event_title);
                        //Set date event
                        transaction_date.datepicker('setDate',moment(event_start).format('DD/MM/YYYY'));
                        //Set transaction type
                        let transaction_type = $('.select_transaction_type');
                        //Set color transaction type
                        let transaction_color =$("input[name='[transaction_color]']");
                        transaction_type.val(response[0]['id_type']).change();
                        transaction_color.val(color_event);
                        //Set regime
                        $('#regime_'+response[0]['regime']).prop('checked',true);
                        //Set user checked
                        change_regime();
                        response[0]['regime'] == 0 ? regime0(response) : regime1(response);
                        //Set amount transaction
                        let transaction_amount = $('.transaction_amount');
                        transaction_amount.val(replaceNumber(response[0]['sum_trans']));
                        //Set plus minus transaction
                        let plus_minus = $('#transaction_plus_minus_'+response[0]['plus_minus']);
                        plus_minus.prop('checked',true);
                        //Set transaction note
                        let transaction_note =$(".transaction_note");
                        transaction_note.val(response[0]['note']);
                    }
                }
            });
            // event.jsEvent.preventDefault();
        },

        loading: function (is_loading) {//waiting loading data
            KTApp.block('#kt_calendar');
            if(!is_loading){
                KTApp.unblock('#kt_calendar');
            }
        },
        eventRender: function (info) {// render data
            let element = $(info.el);
            let check_all_event = $('#check_all_type');
            info.el.style.display = check_all_event.is(':checked') ? 'none' : 'block';
            checkItemEvent(info);
            checkEvent(info);
            if (info.event && info.event.title && info.event.extendedProps && info.event.extendedProps.list_username) {
                let string = info.event.extendedProps.list_username;
                string = string.split(",");
                let length = string.length;
                let htmlContent = `<ul class=\'list-style-type content-tooltip \'>`;
                string.forEach(function (e){
                    htmlContent += `<li class=\'text-wrap-hidden\'>${e}</li>`;
                });
                htmlContent += `</ul>`;
                let sum = formatNum(info.event.extendedProps.sum_trans);
                let sumContent = '';
                if(sum.indexOf(')') == '-1'){
                    sumContent  = `<span class=\'label label-inline  label-light-primary\'>${words['total']}: ${sum} VND</span><span class=\'label label-inline ml-0\'>${words['number_of_member']}: ${length}</span>`;
                }else{
                    sumContent  = `<span class=\'label label-inline  label-light-danger\'>${words['total']}: ${sum} VND</span><span class=\'label label-inline ml-0\'>${words['number_of_member']}: ${length}</span>`;
                }
                if (element.hasClass('fc-day-grid-event')) {
                    element.popover({
                        'title': info.event.title,
                        'trigger':'hover',
                        'placement':'top',
                        'content':sumContent+`<br/><br/>`+htmlContent,
                        'html':true,
                    });
                    KTApp.initPopover(element);
                }
            }else{
                element.prop('hidden',true);
            }
        },
    });
    calendar.render();

    function getDataCondition(response){
        let jsonDetail = response;
        let edit_event =  $('#modal_transaction');
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
    function regime0(data){
        let amount_person = $('.amount_person');
        let into_money = $('.into_money');
        let check_person = $('.check_person');
        let transaction_person_total = $('.transaction_person_total');
        amount_person.prop('disabled',true);
        into_money.text(replaceNumber(data[0]['sum_trans']));
        check_person.prop('checked',false);
        transaction_person_total.text(data.length);
        for(let i = 0 ; i< data.length; i++){
            $('#check_person_'+data[i]['id']).prop('checked',true);
            let amount_person_i = $('#amount_person_'+data[i]['id']);
            amount_person_i.prop('disabled',false);
            amount_person_i.val(replaceNumber(data[i]['sum_detail']));
        }
    }
    function regime1(data){
        let into_money = $('.into_money');
        let check_person = $('.check_person');
        let transaction_person_total = $('.transaction_person_total');
        into_money.text(replaceNumber(data[0]['sum_detail']));
        check_person.prop('checked',false);
        transaction_person_total.text(data.length);
        for(let i = 0 ; i< data.length; i++){
            $('#check_person_'+data[i]['id']).prop('checked',true);
        }
    }

 jQuery(document).ready(function() {
        //Active function remove click number date
        removeClickDate();
        //Active select 2 modal transaction
        $('#modal_transaction').on('shown.bs.modal', function () {
            refreshSelectTransactionType();
            event_id ?"":$('.transaction_amount').trigger('focus');
            let button = $('#submit_modal');
            button.prop('disabled', false);
        });
     $('#transaction_type_modal').on('shown.bs.modal', function () {
         // validate_transaction_type.resetForm(true);
         let button = $('#submit_change_type');
         button.prop('disabled', false);
     });
        //Active date picker
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

        //Active date picker transaction date
        $('.transaction_date').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows,
            format:'dd/mm/yyyy',
            // endDate: formatDate(),
            autoclose: true,
        }).on('changeDate', function(e) {

        });

    });
//Function show popover
    function showPopover(){
        let popover = $('[data-toggle="popover"]')
        popover.popover({
            trigger: 'hover'
        });
    }
// Function remove click date number
    function removeClickDate(){
        // Replace all a tags with the type of replacementTag
        let fc_day_number = $('.fc-day-number');
        fc_day_number.each(function(e) {
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
    function checkInput(){//Check item first
        let check_person = $('.check_person');
        let check_person_length_checked = check_person.filter(':checked').length;
        let transaction_person_total = $('.transaction_person_total');
        let filter_check_person = $('.filter_check_person');
        filter_check_person.val(check_person_length_checked);
        transaction_person_total.text(check_person_length_checked);
        let transaction_note = $('.transaction_note');
        transaction_note.val("");
        //Set plus minus transaction
        let plus_minus = $('#transaction_plus_minus_1');
        plus_minus.prop('checked',true);

    }
//Change regime transaction
    $("input[name='[transaction_regime]']").on('change',function (){
        change_regime();
        showPopover();
    });
    // Function replace
    function replaceNumber(number){
        number = Math.abs(Math.round(number));
        number = String(number);
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
//Function change regime transaction
    function change_regime(){
        let value = $("input[name='[transaction_regime]']:checked").val();
        let transaction_amount = $("input[name='[transaction_amount]']");
        let transaction_regime = $('.transaction_regime');
        let template_1 = $('.transaction_regime_1').html();
        let template_0 = $('.transaction_regime_0').html();
        transaction_regime.children().remove();
        if(value == 0){//Not equal
            transaction_regime.append(template_0);
            transaction_amount.prop('disabled',true);
            transaction_amount.addClass('fc-not-allowed');
            transaction_amount.val(0);
        }else{//Equal
            transaction_regime.append(template_1);
            transaction_amount.prop('disabled',false);
            transaction_amount.removeClass('fc-not-allowed');
            transaction_amount.val("");
            $('.transaction_amount').trigger('focus');
        }
        showPopover();
        checkInput();
    }

//Check all
    $(document).on('change','.check_all', function(){
        let _this = $(this);
        let check_person = $('.check_person');
        let amount_person = $('.amount_person');
        let is_checked;
        let is_disabled;
        let transaction_person_total = $('.transaction_person_total');
        let filter_check_person = $('.filter_check_person');
        let check_person_length = check_person.length;
        is_checked = !!_this.is(':checked');
        is_disabled = !_this.is(':checked');
        check_person.prop('checked',is_checked);
        amount_person.prop('disabled',is_disabled);
        let check_person_length_checked = check_person.filter(':checked').length;
        transaction_person_total.text(is_checked ?check_person_length : check_person_length_checked);
        filter_check_person.val(is_checked ?check_person_length : check_person_length_checked);
        let value_transaction_regime = $("input[name='[transaction_regime]']:checked").val();
        if(value_transaction_regime == 1) { //Equal
            let into_money = $('.into_money');
            let transaction_amount_value = $('.transaction_amount').val();
            into_money.text(calculateAmountEqual(check_person_length_checked,transaction_amount_value));

        }
    });
//Check person
    $(document).on('change', '.check_person', function(){
        let check_person = $('.check_person');
        let check_all = $('.check_all');
        let transaction_person_total = $('.transaction_person_total');
        let filter_check_person = $('.filter_check_person');
        let check_person_length = check_person.length;
        let check_person_length_checked = check_person.filter(':checked').length;
        let is_checked;
        is_checked = check_person_length === check_person_length_checked;
        check_all.prop('checked',is_checked);
        transaction_person_total.text(check_person_length_checked);
        filter_check_person.val(check_person_length_checked);

        let value_transaction_regime = $("input[name='[transaction_regime]']:checked").val();
        let _this_value = $(this).val();
        if(value_transaction_regime == 0){ //Not equal
            let is_amount_person_disabled;
            is_amount_person_disabled = !$(this).is(':checked');
            $('#amount_person_'+_this_value).prop('disabled',is_amount_person_disabled);
        }else{//Equal
            let into_money = $('.into_money');
            let transaction_amount_value = $('.transaction_amount').val();
            into_money.text(calculateAmountEqual(check_person_length_checked,transaction_amount_value));
        }
    });
//Transaction amount on keyup
    $('.transaction_amount').on({
        keyup: function(e) {
            let value_transaction_regime = $("input[name='[transaction_regime]']:checked").val();
            if(value_transaction_regime == 1){
                formatCurrency($(this));
                let _this_value = $(this).val();
                let check_person = $('.check_person');
                let check_person_length_checked = check_person.filter(':checked').length;
                let into_money = $('.into_money');
                into_money.text(calculateAmountEqual(check_person_length_checked,_this_value));
            }else{
                e.stopImmediatePropagation();
                return false;
            }

        }
    });
//Amount person on keydown
    $(document).on('keyup','.amount_person',function (e){
        formatCurrency($(this));
        let check_person = $('.check_person');
        let element = $('.amount_person');
        let amount_person_length_not_disabled = element.not(':disabled').length;
        let check_person_length_checked = check_person.filter(':checked').length;
        let transaction_amount = $('.transaction_amount');
        let into_money = $('.into_money');
        if(amount_person_length_not_disabled == check_person_length_checked){
            let transaction_amount_value = formatNum(calculateAmountNotEqual(element));
            transaction_amount.val(transaction_amount_value);
            into_money.text(transaction_amount_value);
        }else{
            e.stopImmediatePropagation();
            return false;
        }
    });

//Function calculate amount transaction with regime Equal
    function calculateAmountEqual(person_total, amount_transaction) {
        if(person_total <1) return 0;
        amount_transaction = parseValueMoney(amount_transaction);
        amount_transaction = amount_transaction / person_total;
        amount_transaction = isNaN(amount_transaction)? 0: amount_transaction;
        amount_transaction = formatNum(Math.abs(Math.round(amount_transaction)));
        return amount_transaction;
    }
//Function calculate amount transaction with regime Not equal
    function calculateAmountNotEqual(element) {
        let element_not_disabled = element.not(':disabled');
        let result;
        result = result? result : 0;
        element_not_disabled.each(function (){
            let _this_value = $(this).val();
            _this_value = parseValueMoney(_this_value);
            result = result + _this_value;
        });
        return result;
    }
//Function parse value money
    function parseValueMoney(value){
        value = value ? value: "";
        value = value.replace(/,/g, '');
        value = parseFloat(value);
        value = Math.round(value * 1000) / 1000;
        value = isNaN(value)? 0: value;
        return value;
    }
//Function change type
    $(document).on('select2:select','.select_transaction_type', function (e) {
        let _this = $(this);
        let data_color = _this.find(':selected').data('color');
        let transaction_color = $("input[name='[transaction_color]']");
        transaction_color.val(data_color);
        // Do something
    });
//Function call data transaction type
    function getDataTransactionType(){
        $.ajax({
            url : baseURL+"transaction-new/get-transaction-type",
            type: "post",
            data: {
            },
            success: function (data){
                let transaction_type = $('.transaction_type');
                transaction_type.children().remove();
                let html = '';
                html += '<div class="input-group ">\n' +
                    '    <select class="form-control select_transaction_type"  name="[transaction_type]">';
                data.forEach(function(item){
                    html+= '<option value="'+item['id_type']+'" data-color="'+item['color_type']+'">'+item['name_type']+'</option>';
                });
                html+= '</select>\n' +
                    ' <div class="input-group-append">\n' +
                    '    <input type="color" name="[transaction_color]" value="'+data[0]['color_type']+'" style="height: calc(1.5em + 1.3rem + 2px);border: none">\n' +
                    ' </div>\n' +
                    '</div>';
                transaction_type.html(html);
                refreshSelectTransactionType();
            },
        });
    }
//Function refresh select2 transaction type
    function refreshSelectTransactionType(){
        let select_transaction_type = $('.select_transaction_type');
        select_transaction_type.select2({
            placeholder: "Select a state",
            tags: true,
        });
    }

//Validate modal form and submit data
    const validate_transaction = FormValidation.formValidation(
        document.getElementById('transaction_form'),{
            fields: {
                '[transaction_date]': {
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        date: {
                            format: 'DD/MM/YYYY',
                            message: arrErrorMessage['field_not_valid'],
                        },
                        blank: {
                        },
                    }
                },
                '[transaction_amount]':{
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        blank: {
                        },
                    }
                },
                '[transaction_type]':{
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        blank: {
                        },
                    }
                },
                '[transaction_plus_minus]':{
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        blank: {
                        },
                    }
                },
                '[transaction_regime]':{
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        blank: {
                        },
                    }
                },
                '[filter_check_person]':{
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                        blank: {

                        },
                    }
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap({
                    eleInvalidClass: '',
                    eleValidClass: '',
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),

            }
        }
    ).on('core.form.valid', function () {
        let button = $('#submit_modal');
        button.prop('disabled', true);
        let transaction_form = $('#transaction_form');
        let transaction_amount = $("input[name='[transaction_amount]']");
        let transaction_regime = $("input[name='[transaction_regime]']").val();
        transaction_regime == 1 ? transaction_amount.prop('disabled',false):"";
        transaction_amount.val(parseValueMoney(transaction_amount.val()));
        let data = transaction_form.serializeArray();
        let total = $('.check_person').filter(':checked').length;
        let key = 'transaction';
        let formData = new FormData();
        formData.append(key+"[total]", total);
        formData.append(key+"[transaction_id]", event_id);
        if (Array.isArray(data)) {
            data.forEach(({name, value}) => {
                formData.append(`${key}${name}`, value);
            });
        }
        let url = baseURL + 'transaction-new/update-transaction';
        $.ajax({
            url:url,
            type:'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function(response){
            if(response['SUCCESS_UPDATE']){
                $.notify(arr_notification['success_update'], {type: 'success'});
            }else{
                $.notify(arr_notification['error_update'], {type: 'danger'});
            }
            let modal_transaction = $('#modal_transaction');
            modal_transaction.modal('hide');
            calendar.refetchEvents();

        });
    });
    var type_id;
    var type_id_delete;
    //Change type in filter
    $(document).on('click', '.button_change_type',function(){
        let modal_change_type = $('#transaction_type_modal');
        let parents = $(this).parents('.list-transaction-item');
        modal_change_type.modal('show');
        type_id = parents.find('input').val();
        let name_type = parents.find('span').text();
        let color_type = parents.find('input').data('color');
        let change_type_color = $('#change_type_color');
        let change_type_name = $('#change_type_name');
        change_type_color.val(color_type);
        change_type_name.val(name_type);
    });
    // Delete type in filter delete_type_transaction_modal
    $(document).on('click', '.button_delete_type',function(){
        let modal_delete_type = $('#delete_type_transaction_modal');
        let parents = $(this).parents('.list-transaction-item');
        type_id_delete = parents.find('input').val();
        modal_delete_type.modal('show');
    });
    $(document).on('click', '#submit_delete_type_transaction',function (){
        $.ajax({
            url: baseURL + "transaction-new/delete-type",
            type: 'post',
            dataType: "json",
            data: {
                'id_type': type_id_delete,
            },
        }).done(function(response) {
            if (response['SUCCESS_DELETE']) {
                $.notify(arr_notification['success_delete'], {type: 'success'});

            } else {
                $.notify(arr_notification['error_delete'], {type: 'danger'});
            }
            let modal_delete_type = $('#delete_type_transaction_modal');
            modal_delete_type.modal('hide');
            calendar.refetchEvents();
            let data = response['data'];
            appendTypeTransaction(data);
        });
    });
    function appendTypeTransaction(data){
        let check_type = $('.check_type');
        check_type.children().remove();
        let html = '<div class="remove_check_type">';
        data.forEach(function(item) {
            html += '<label role="button" class="items-center list-group-item list-transaction flex">\n' +
                '  <div class="list-transaction-item">\n' +
                '      <input checked="" data-color="'+item['color_type']+'" data-id="'+item['id_type']+'" id="check_item_type_'+item['id_type']+'" name="typeCheck" value="'+item['id_type']+'" type="checkbox" class="check_item_type form-checkbox forcus" style="color: '+item['color_type']+'">\n' +
                '      <span class="ml-2" style="color: '+item['color_type']+'" id="name_type_'+item['id_type']+'">'+item['name_type']+'</span>\n' +
                '\n' +
                ' <div class="float-right">\n' +
                '  <button type="button" class="button_change_type" style="border: none;" data-toggle="popover" data-placement="top" data-content="'+words['edit']+'" data-original-title="" title=""><i class="la la-edit" style="color: black;"></i></button>\n' +
                '  <button type="button" class="button_delete_type" style="border: none;" data-toggle="popover" data-placement="top" data-content="'+words['delete']+'" data-original-title="" title=""><i class=" la la-trash" style="color: black;"></i></button>\n' +
                '  </div>\n' +
                ' </div>\n' +
                '</label>';
        });
        html+= '</div>';
        check_type.html(html);
        showPopover();
    }

    const validate_transaction_type = FormValidation.formValidation(
        document.getElementById('transaction_type_form'),{
            fields: {
                '[type_name]': {
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                    }
                },
                '[type_color]': {
                    validators: {
                        notEmpty:{
                            message: arrErrorMessage['field_required'],
                        },
                    }
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap({
                    eleInvalidClass: '',
                    eleValidClass: '',
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
            }
        }
    ).on('core.form.valid', function () {
        let button = $('#submit_change_type');
        button.prop('disabled', true);
        let form_change_type = $('#transaction_type_form');
        let data = form_change_type.serializeArray();
        let formData = new FormData();
        let key = 'transaction_type';
        formData.append(key+"[type_id]", type_id);
        if (Array.isArray(data)) {
            data.forEach(({name, value}) => {
                formData.append(`${key}${name}`, value);
            });
        }
        let url = baseURL + "transaction-new/update-type";
        $.ajax({
            url:url,
            type:'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function(response){
            if(response['SUCCESS_UPDATE']){
                $.notify(arr_notification['success_update'], {type: 'success'});

            }else{
                $.notify(arr_notification['error_update'], {type: 'danger'});
            }
            let modal_change_type = $('#transaction_type_modal');
            modal_change_type.modal('hide');
            calendar.refetchEvents();
            let data = response['data'];
            appendTypeTransaction(data);
        });
    });
    //Check block or none event
    function checkEvent(info){
        let check_item_type = $('.check_item_type');
        check_item_type.change(function(){
            checkItemEvent(info);
        });
        $('.check_all_type').change(function(){
            if(!$(this).prop('checked')){
                info.el.style.display = 'none';
                check_item_type.prop('checked', false);
            }else{
                info.el.style.display = 'block';
                check_item_type.prop('checked', true);
            }
        });
    }
    function checkItemEvent(info){
        $('.check_item_type').each(function(){
            if($(this).prop('checked')){
                if($(this).val() == info.event.extendedProps.id_type){
                    info.el.style.display = 'block';
                }
            }else{
                if($(this).val() == info.event.extendedProps.id_type){
                    info.el.style.display = 'none';
                }
            }
            let check_item_type = $('.check_item_type');
            let check_all_type = $('.check_all_type');
            let check_item_type_length = check_item_type.length;
            let checked_item_type_length = check_item_type.filter(':checked').length;
            let is_check_all ;
            is_check_all = check_item_type_length == checked_item_type_length;
            check_all_type.prop('checked', is_check_all);
        });
    }

});
var states = [];
// Class definition
var KTTypeahead = function() {
    // Private functions
    var demo1 = function() {
        var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                q = q.replace(/,/g, '');
                let valueTran = q;
                let valueTran2 = q;
                let valueTran3 = q;
                let valueTran4 = q;
                if(q.length < 6){
                    valueTran = q*1000+'';
                    valueTran2 = q*10000+'';
                    valueTran3 = q*100000+'';
                    strs = [
                        valueTran,valueTran2,valueTran3
                    ]
                }else{
                    valueTran4 = q+''
                    valueTran = q*10+'';
                    valueTran2 = q*100+'';
                    // valueTran3 = q*1000+'';
                    strs = [
                        valueTran4,valueTran,valueTran2
                    ]
                }
                var matches, substringRegex;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    if (substrRegex.test(str)) {
                        str = formatNumber(str);
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        };
        let transaction_amount = $('.transaction_amount');
        // let is_disabled = transaction_amount.is(':disabled');
        // if(is_disabled) return  false;
        transaction_amount.typeahead({
            hint: false,
            highlight: true,
            minLength: 1,
        }, {
            name: 'states',
            source: substringMatcher(states),
        })

        transaction_amount.bind('typeahead:select', function(ev, suggestion) {
            let sum = 0;
            let countUser = $('.check_person').filter(':checked').length;
            sum = suggestion.replace(/,/g, '');
            sum = parseFloat(sum);
            sum = Math.round(sum * 1000) / 1000;
            if(countUser > 0){
                sum = sum / countUser;
            }
            sum = isNaN(sum)? 0: sum;
            sum = formatNum(Math.abs(Math.round(sum)));
            $('.into_money').text(sum);
        });
        $('.typeahead').bind('typeahead:change', function(ev, suggestion) {
            suggestion = formatNumber(suggestion);
            $(".transaction_amount").val(suggestion);
        });
    }

    return {
        // public functions
        init: function() {
            demo1();
        }
    };
}();
jQuery(document).ready(function() {
    KTTypeahead.init();
});
// var val;
// $('.transaction_amount').focusout( function(){
//     val = $(this).val();
//     console.log($(this).val());
// })



