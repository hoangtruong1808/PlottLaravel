let arr = arrData;
let arr_notification = arrNotification;
let role = data_roles;
let employ_id = employee_id;
if(indefinite){
    let vacation_hidden = $('.vacation-hidden');
    vacation_hidden.attr('style', 'display: block !important');
}
function addSelect2(){
    $('.select-province,.select-district,.select-ward').select2({
        placeholder: select["select_address"],
        language: {
            noResults: function () {
                return arr_notification['no_data'];
            },
        },
    });
    $('.select_nationality').select2({
        placeholder: select["select_nationality"],
        language: {
            noResults: function () {
                return arr_notification['no_data'];
            },
        },
    });
    $('.select_gender').select2({
        placeholder: select["select_gender"],
        language: {
            noResults: function () {
                return arr_notification['no_data'];
            },
        },
    });
}
$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    addSelect2();
})
let hash_prev;
let new_str_view = 'get-basic-information';
let get_data_details = 'get-details';
let change = false;
let basic_information = 'basic-information';
$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");
    // console.log(url);
    if (location.hash) {
        let location_hash_temp = location.hash;
        location.hash = employ_id ? location.hash: '#'+basic_information;
        let new_str_view = location.hash.replace('#', 'get-');
        role === '0'?getDataView(new_str_view):getDataView(get_data_details);
        location.hash = location_hash_temp;
        const hash = url.split("#");
        if(role === '0'){
            employ_id ? $('#myTab a[href="#'+hash[1]+'"]').tab("show"): $('#myTab a[href="#'+basic_information+'"]').tab("show");
            url = location.href.replace(/\/#/, "#");
            url = employ_id ? url : url.replace('#'+hash[1], "");
        }else{
            $('#myTab a[href="#details"]').tab("show");
            url = url.replace('#'+hash[1], "");
        }
        history.replaceState(null, null, url);
    }else{
        role === '0'? getDataView(new_str_view):getDataView(get_data_details);
        role === '0' ? $('#myTab a[href="#'+basic_information+'"]').tab("show"): $('#myTab a[href="#details"]').tab("show");
    }
    if(role === '0'){
        if(!employ_id){
            $('.tab-pane-hidden').attr('style', 'display: none !important');
        }else{
            $('.tab-pane-hidden').attr('style', 'display: block !important');
        }
        $('a[data-toggle="tab"]').on("click", function(e) {
            let that = $(this);
           if(change || !employ_id){
               Swal.fire({
                   title: arr['are_you_sure'],
                   icon: "warning",
                   html:employ_id ?`<span class='required'>${arr['please_save']}</span>`: `<span class='required'>${arr['please_update']}</span>`,
                   customClass: 'sweetalert-lg',
                   showCancelButton: true,
                   showConfirmButton: employ_id ?true:false,
                   confirmButtonText: arr['go_on'],
                   cancelButtonText: arr['back'],
               }).then(function(result) {
                   if (result.value) {
                       if(!employ_id){
                           hash_prev.tab('show');
                       }else{
                           that.tab('show');
                       }

                       change = false;
                   }else{
                       change = true;
                       e.preventDefault();
                   }
               });
           }else{
               that.tab('show');
           }
            return false;
        });
        let nav_tabs = $('.nav-tabs a');
        nav_tabs.on('hide.bs.tab', function(event){
            hash_prev = $(event.relatedTarget);  // previous tab
        });
        nav_tabs.on('shown.bs.tab', function(event){
            let hash_active = $(event.target)[0]['hash'];         // active tab
            let newUrl;
            let hash = hash_active;
            if(role === '0'){
                // hash = employ_id? hash: '#'+basic_information;
                if(hash === "#basic-information") {
                    newUrl = url.split("#")[0];
                } else {
                    newUrl = url.split("#")[0] + hash;
                }
            }else{
                if(hash === "#details") {
                    newUrl = url.split("#")[0];
                }
            }
            // newUrl += "/";
            history.replaceState(null, null, newUrl);

            let new_str_view = hash.replace('#', 'get-');
            getDataView(new_str_view);
        });
    }

});
$('.tab-pane-profile input,.tab-pane-profile select').on('change',function (){
    let check = $(this).data('id_check');
    let is_element_input = $('.tab-pane input,.tab-pane select').not(':input[type=hidden]'); //true or false
    if($(this).val()== $(this).data('value')){
        if(check == 1){
            change = false;
            $(this).data('id_check',0);
            return;
        }else{
            is_element_input.each(function(){
                let value = $(this).data('value');
                let val = $(this).val();
                if(value != val){
                    change = true;
                    return false;
                }else{
                    change = false;
                }
            })
        }
    }else{
        is_element_input.data('id_check',0);
        is_element_input.each(function(){
            let value = $(this).data('value');
            let val = $(this).val();
            if(value != val){
                change = true;
                return false;
            }else{
                change = false;
            }
        })
    }

})

$('button[type="submit"]').on('click',function (){
    change = false;
})

function getDataView(new_str_view){
    $.ajax({
        url:baseURL + 'user/'+new_str_view+"/id/"+id,
        type:'post',
        dataType: "json",
        success: function (response){
            employ_id = response['employee_id'];
            switch (response['employee_key']){
                case 'profile':
                    basicInformation(response);
                    break;
                case 'education':
                    education(response);
                    break;
                case 'contract':
                    contract(response);
                    break;
                case 'details':
                    details(response);
                    break;
            }
        },
        complete: function(){
        }
    })
}
$(document).on({
    // ajaxStart: function() {$('body').addClass('.overlay')  },
    ajaxStop: function() { $('body').find('.overlay').removeClass() ; }
});
function parseData(data){
    delete data['employee_key'];
    delete data['employee_id'];
    return Array.from(Object.keys(data), k=>data[k]);
}
function details(data){
    delete data['employee_key'];
    delete data['employee_id'];
    detailsProfile(data['profile']);
    detailsEducation(data['education']);
    detailsContract(data['contract']);
    detailsVacation(data['vacation']);
}
function detailsProfile(data){
    let parent = $('#details');
    let text_danger = 'text-danger';
    let text_primary = 'text-primary';
    let text_dark = 'text-dark opacity-70';
    let no_data = arr['no_data'];
    let basic_information = arr['basic_information'];
    let employee_name = arr['full_name'];
    let gender = arr['gender'];
    let nationality = arr['nationality'];
    let date_birth = arr['date_of_birth'];
    let position = arr['position'];
    let identity = arr['identity'];
    let issued_at = arr['issued_at'];
    let registered_date = arr['registered_date'];
    let permanent = arr['permanent'];
    let temporary = arr['temporary'];
    let email = arr['email'];
    let phone = arr['phone'];
    parent.find('.details_profile').find('.fieldset').remove();
    parent.find('.details_profile').append(
        `
            <fieldset class="scheduler-border border fieldset">
                <legend class="scheduler-border">${basic_information}</legend>
                <div class="d-flex justify-content-between pt-6 list-hover">
                    <div class="d-flex flex-column flex-root">
                        <span class="font-weight-bolder text-uppercase mb-2">${employee_name}</span>
                        <span class="${data['fullname'] ? text_dark: text_danger}">${data['fullname'] ? data['fullname']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${gender}</span>
                        <span class="${data['gender_name'] ? text_dark: text_danger}">${data['gender_name'] ? arr[data['gender_name']]: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${nationality}</span>
                        <span class="${data['nationality_name'] ? text_dark: text_danger}">${data['nationality_name'] ? data['nationality_name']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root text-right">
                        <span class="font-weight-bolder text-uppercase mb-2">${date_birth}</span>
                        <span class="${data['date_of_birth'] ? text_primary: text_danger}">${data['date_of_birth'] ? formatDate(data['date_of_birth']): no_data}</span>
                    </div>
                </div>
                <div class="border-bottom w-100"></div>
                <div class="d-flex justify-content-between pt-6 list-hover">
                    <div class="d-flex flex-column flex-root">
                        <span class="font-weight-bolder text-uppercase mb-2">${position}</span>
                        <span class="${data['position_name'] ? text_dark: text_danger}">${data['position_name'] ? data['position_name']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${identity}</span>
                        <span class="${data['identity_no'] ? text_dark: text_danger}">${data['identity_no'] ? data['identity_no']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${issued_at}</span>
                        <span class="${data['issued_at'] ? text_dark: text_danger}">${data['issued_at'] ? data['issued_at']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root text-right">
                        <span class="font-weight-bolder text-uppercase mb-2">${registered_date}</span>
                        <span class="${data['registered_date'] ? text_primary: text_danger}">${data['registered_date'] ? formatDate(data['registered_date']): no_data}</span>
                    </div>
                </div>
                <div class="border-bottom w-100"></div>
                <div class="d-flex justify-content-between pt-6 list-hover mb-5">
                    <div class="d-flex flex-column flex-root">
                        <span class="font-weight-bolder text-uppercase mb-2">${permanent}</span>
                        <span class="${data['permanent_res'] ? text_dark: text_danger}">${data['permanent_res'] ? data['permanent_res']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${temporary}</span>
                        <span class="${data['temporary_res'] ? text_dark: text_danger}">${data['temporary_res'] ? data['temporary_res']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root ml-8">
                        <span class="font-weight-bolder text-uppercase mb-2">${email}</span>
                        <span class="${data['employee_email'] ? text_dark: text_danger}">${data['employee_email'] ? data['employee_email']: no_data}</span>
                    </div>
                    <div class="d-flex flex-column flex-root text-right">
                        <span class="font-weight-bolder text-uppercase mb-2">${phone}</span>
                        <span class="${data['phone'] ? text_primary: text_danger}">${data['phone'] ? data['phone']: no_data}</span>
                    </div>
                </div>
            </fieldset>
        `
    );
}
function detailsEducation(data){
    let parent = $('#details');
    let html = "";
    let certificate = arr['certificate'];
    let major = arr['major'];
    let joined_date = arr['joined_date'];
    let end_date = arr['end_date'];
    let text_primary = 'text-primary';
    let text_dark = 'text-dark opacity-70';
    if(data){
        data.forEach(function(item){
            html += '<tr class="list-hover">\n' +
                '    <td class="pl-0 pt-0 py-5">\n' +
                '        <div class="symbol symbol-45 symbol-light-success mr-2">\n' +
                '            <span class="symbol-label">\n' +
                '                <span class="svg-icon svg-icon-2x svg-icon-success">\n' +
                '                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
                '                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '                            <rect x="0" y="0" width="24" height="24"></rect>\n' +
                '                            <rect fill="#000000" opacity="0.3" x="13" y="4" width="3" height="16" rx="1.5"></rect>\n' +
                '                            <rect fill="#000000" x="8" y="9" width="3" height="11" rx="1.5"></rect>\n' +
                '                            <rect fill="#000000" x="18" y="11" width="3" height="9" rx="1.5"></rect>\n' +
                '                            <rect fill="#000000" x="3" y="13" width="3" height="7" rx="1.5"></rect>\n' +
                '                        </g>\n' +
                '                    </svg>\n' +
                '                </span>\n' +
                '            </span>\n' +
                '        </div>\n' +
                '    </td>\n' +
                '    <td class="pl-0">\n' +
                '        <span  class="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg ">'+certificate+': '+item['qualification']+'</span>\n' +
                '        <span class="'+text_dark+' font-weight-bold d-block font-size-lg ">'+major+': '+item['major']+'</span>\n' +
                '    </td>\n' +
                '    <td class="text-right">\n' +
                '        <span class="text-dark-75 font-weight-bolder d-block font-size-lg">'+joined_date+' - '+end_date+'</span>\n' +
                '        <span class="'+text_primary+' font-weight-bold d-block font-size-lg ">'+formatDate(item['edu_start_date'])+' - '+formatDate(item['edu_end_date'])+'</span>\n' +
                '    </td>\n' +
                '</tr>';
        });
        parent.find('.body_education').find('.no_data').remove();
        parent.find('.body_education').html(html);
    }
}
function detailsContract(data){
    let parent = $('#details');
    let html = "";
    if(data){
        data.forEach(function(item){
            let contract_type_name = arr[item['contract_type_name']];
            let annual_leave = item['annual_leave']? item['annual_leave']:'0';
            let salary = item['salary']? formatNumber(item['salary']): 0;
            let health_insurance = item['health_insurance']? formatDate(item['health_insurance']):arr['no_participate'];
            let end_date = item['end_date']? formatDate(item['end_date']):arr['indefinite'];
            html += '<tr class="font-weight-boldest list-hover" style="border-top: 1px solid #ebedf3;">\n' +
                '    <td class="border-0 pl-0 pt-7 align-middle align-items-center">'+item['contract_code']+'</td>\n' +
                '    <td class="text-left pt-7 align-middle ">'+contract_type_name+'</td>\n' +
                '    <td class="text-left pt-7 align-middle ">'+item['position_name']+'</td>\n' +
                '    <td class="text-primary pr-0 pt-7 text-right align-middle">'+health_insurance+'</td>\n' +
                '    <td class="text-primary pr-0 pt-7 text-right align-middle">'+formatDate(item['joined_date'])+'</td>\n' +
                '    <td class="text-primary pr-0 pt-7 text-right align-middle">'+end_date+'</td>\n' +
                '    <td class="text-right pt-7 align-middle text-primary">'+annual_leave+'</td>\n' +
                '    <td class="text-danger pr-0 pt-7 text-right align-middle  salary-toggle "><div class="input-group-append" style="flex-direction: row-reverse;"><span class="text-danger input-group-text pr-0 salary-span d-none" style="background: none;outline: none; border: none">'+salary+'</span><span class="input-group-text " style="background: none;outline: none; border: none"><i class="la icon-lg la-eye-slash"></i></span></div></td>\n' +
                '</tr>';
        });
        parent.find('.body_contract').find('.no_data').remove();
        parent.find('.body_contract').html(html);
    }
}
$(document).on('click','.salary-toggle', function (){
    let la = $(this).parent().find('.la');
    let span = $(this).parent().find('.salary-span');
    span.toggleClass('d-none');
    la.toggleClass('la-eye-slash');
    la.toggleClass('la-eye');
});
function detailsVacation(data){
    let parent = $('.details_vacation');
    parent.find('.total_number').text(data['vacation_total']);
    parent.find('.total_annual').text(data['annual_leave']);
    parent.find('.total_day_use').text(data['days_off_total']);
    parent.find('.total_current_day').text(data['current_vacation']);
}
let check_probationary = false;
let check_indefinite = false;
function contract(data){
    check_probationary = data['check_probationary'];
    check_indefinite = data['check_indefinite'];
    delete data['check_probationary'];
    delete data['check_indefinite'];
    let parse_data = parseData(data);
    let parent = $('#contract');
    let html = "";

    parse_data.forEach(function(item){
        let health_insurance = item['health_insurance']?formatDate(item['health_insurance']):arr['no_participate'];
        let end_date = item['end_date']? formatDate(item['end_date']):arr['indefinite'];
        let time = formatDate(item['joined_date']) +" - "+end_date;
       html += '<tr class="tr_contract_view">\n' +
           '        <td class="pl-7 py-5">\n' +
           '            <span class="contract_code_view text-dark-75 font-weight-bolder d-block font-size-lg">'+item['contract_code']+'</span>\n' +
           '        </td>\n' +
           '        <td>\n' +
           '            <span class="contract_type_view text-dark-75 font-weight-bolder d-block font-size-lg">'+arr_notification[item['contract_type_name']]+'</span>\n' +
           '        </td>\n' +
           '        <td>\n' +
           '            <span class="position_view text-dark-75 font-weight-bolder d-block font-size-lg">'+item['position_name']+'</span>\n' +
           '        </td>\n' +
           '        <td>\n' +
           '            <span class="health_insurance_view text-right text-primary font-weight-bolder d-block font-size-lg">'+health_insurance+'</span>\n' +
           '        </td>\n' +
           '        <td>\n' +
           '            <span class="time_contract_view text-right text-primary font-weight-bolder d-block font-size-lg">'+time+'</span>\n' +
           '        </td>\n' +
           '        <td class="text-center pr-0">\n' +
           '            <button onclick="seeDetailsContract('+item['contract_type']+','+item['contract_id']+')"  type="button" class=" btn btn-icon btn-light btn-hover-primary btn-sm "  data-toggle="tooltip" data-placement="top" title="" data-original-title="'+arr['see_details']+'">\n' +
           '    <span class="svg-icon svg-icon-md svg-icon-primary">\n' +
           '        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
           '            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
           '                <rect x="0" y="0" width="24" height="24"></rect>\n' +
           '                <path d="M7,3 L17,3 C19.209139,3 21,4.790861 21,7 C21,9.209139 19.209139,11 17,11 L7,11 C4.790861,11 3,9.209139 3,7 C3,4.790861 4.790861,3 7,3 Z M7,9 C8.1045695,9 9,8.1045695 9,7 C9,5.8954305 8.1045695,5 7,5 C5.8954305,5 5,5.8954305 5,7 C5,8.1045695 5.8954305,9 7,9 Z" fill="#000000"></path>\n' +
           '                <path d="M7,13 L17,13 C19.209139,13 21,14.790861 21,17 C21,19.209139 19.209139,21 17,21 L7,21 C4.790861,21 3,19.209139 3,17 C3,14.790861 4.790861,13 7,13 Z M17,19 C18.1045695,19 19,18.1045695 19,17 C19,15.8954305 18.1045695,15 17,15 C15.8954305,15 15,15.8954305 15,17 C15,18.1045695 15.8954305,19 17,19 Z" fill="#000000" opacity="0.3"></path>\n' +
           '            </g>\n' +
           '        </svg>\n' +
           '    </span>\n' +
           '            </button>\n' +
           '            <button onclick="updateContract('+item['contract_type']+','+item['contract_id']+')" type="button" class="update_view_'+item['contract_id']+' btn btn-icon btn-light btn-hover-primary btn-sm mx-3" data-toggle="tooltip" data-placement="top" title="" data-original-title="'+arr['edit']+'">\n' +
           '    <span class="svg-icon svg-icon-md svg-icon-primary">\n' +
           '        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
           '            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
           '                <rect x="0" y="0" width="24" height="24"></rect>\n' +
           '                <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>\n' +
           '                <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>\n' +
           '            </g>\n' +
           '        </svg>\n' +
           '    </span>\n' +
           '            </button>\n' +
           '            <button type="button" onclick="deleteContract('+item['contract_type']+','+item['contract_id']+');" class="delete_view_'+item['contract_id']+' btn btn-icon btn-light btn-hover-primary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="'+arr['delete']+'">\n' +
           '    <span class="svg-icon svg-icon-md svg-icon-primary">\n' +
           '        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
           '            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
           '                <rect x="0" y="0" width="24" height="24"></rect>\n' +
           '                <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>\n' +
           '                <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>\n' +
           '            </g>\n' +
           '        </svg>\n' +
           '    </span>\n' +
           '            </button>\n' +
           '        </td>\n' +
           '    </tr>';
    });
    if(check_indefinite){
        parent.find('.card-footer').find('.card-toolbar').remove();
    }
    if(parse_data.length > 0){
        parent.find('.contract_body_view').find('.no-data').remove();
        parent.find('.contract_body_view').html(html);
    }

}
function education(data){
    let parent = $('#education');
    let html = "";
    let parse_data = parseData(data);
    parse_data.forEach(function(item){
        html += '  <tr class="tr_edu_view">\n' +
            '       <td class="pl-7 py-5">\n' +
            '            <span class="qualification_edu_view text-dark-75 font-weight-bolder d-block font-size-lg">'+item['qualification']+'</span>\n' +
            '        </td>\n' +
            '        <td>\n' +
            '            <span class="major_edu_view text-dark-75 font-weight-bolder d-block font-size-lg">'+item['major']+'</span>\n' +
            '        </td>\n' +
            '        <td>\n' +
            '            <span class="start_date_edu_view text-right text-primary font-weight-bolder d-block font-size-lg">'+formatDate(item['edu_start_date'])+'</span>\n' +
            '        </td>\n' +
            '        <td>\n' +
            '            <span class= "end_date_edu_view text-right text-primary font-weight-bolder d-block font-size-lg">'+formatDate(item['edu_end_date'])+'</span>\n' +
            '        </td>\n' +
            '        <td class="text-center pr-0">\n' +
            '            <button onclick="updateEducation('+item['education_id']+','+item['employee_id']+')" type="button" class="update_view_edu_'+item['education_id']+' btn btn-icon btn-light btn-hover-primary btn-sm mx-3" data-toggle="tooltip" data-placement="top" title="" data-original-title="'+arr['edit']+'">\n' +
            '        <span class="svg-icon svg-icon-md svg-icon-primary">\n' +
            '            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
            '                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '                    <rect x="0" y="0" width="24" height="24"></rect>\n' +
            '                    <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>\n' +
            '                    <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>\n' +
            '                </g>\n' +
            '            </svg>\n' +
            '        </span>\n' +
            '            </button>\n' +
            '            <button type="button" onclick="deleteEducation('+item['education_id']+','+item['employee_id']+')" class="delete_view_edu_'+item['education_id']+' btn btn-icon btn-light btn-hover-primary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="'+arr['delete']+'">\n' +
            '        <span class="svg-icon svg-icon-md svg-icon-primary">\n' +
            '            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\n' +
            '                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '                    <rect x="0" y="0" width="24" height="24"></rect>\n' +
            '                    <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>\n' +
            '                    <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>\n' +
            '                </g>\n' +
            '            </svg>\n' +
            '        </span>\n' +
            '            </button>\n' +
            '        </td>\n' +
            '    </tr>';
    });
    if(parse_data.length > 0){
        parent.find('.edu_body_view').find('no_data_edu').remove();
        parent.find('.edu_body_view').html(html);
    }
}
function basicInformation(data){
    let parent = $('#kt-form-profile');
    let employ_name = $('.employ_name');
    let employ_date_birth = $('.employ_date_birth');
    let employ_gender = $('.employ_gender');
    let employ_nationality = $('.employ_nationality');
    let employ_identity = $('.employ_identity');
    let employ_registered = $('.employ_registered');
    let employ_issued = $('.employ_issued');
    let employ_email = $('.employ_email');

    let permanent_province  = $('.permanent_province ');
    let permanent_district = $('.permanent_district');
    let permanent_ward  = $('.permanent_ward');
    let permanent_street  = $('.permanent_street');

    let temporary_province  = $('.temporary_province ');
    let temporary_district = $('.temporary_district');
    let temporary_ward  = $('.temporary_ward');
    let temporary_street  = $('.temporary_street');
    $('.tab-pane input,.tab-pane select').not(':input[type=hidden]').data('id_check',1);

    parent.find(employ_name).val(data['fullname']);
    parent.find(employ_name).data('value',data['fullname']);
    parent.find(employ_gender).data('value',data['gender']);
    parent.find(employ_nationality).data('value',data['nationality']? data['nationality']: '0243');
    parent.find(employ_date_birth).data('value',formatDate(data['date_of_birth']));
    parent.find(employ_identity).data('value',data['identity_no']);
    parent.find(employ_issued).data('value',data['issued_at']);
    parent.find(permanent_district).data('value',data['permanent_res']['district']);
    parent.find(permanent_ward).data('value',data['permanent_res']['ward']);
    parent.find(permanent_street).data('value',data['permanent_res']['street']);
    parent.find(permanent_province).data('value',data['permanent_res']['province']);
    parent.find(temporary_district).data('value',data['temporary_res']['district']);
    parent.find(temporary_ward).data('value',data['temporary_res']['ward']);
    parent.find(temporary_street).data('value',data['temporary_res']['street']);
    parent.find(temporary_street).val(data['temporary_res']['street']);
    parent.find(temporary_province).data('value',data['temporary_res']['province']);
    parent.find(employ_email).data('value',data['employee_email']);
    parent.find(employ_registered).data('value',formatDate(data['registered_date']));
    parent.find(employ_identity).val(data['identity_no']);
    parent.find(employ_issued).val(data['issued_at']);
    parent.find(employ_email).val(data['employee_email']);
    parent.find(permanent_street).val(data['permanent_res']['street']);

    parent.find(employ_gender).val(data['gender']).change();
    parent.find(employ_nationality).val(data['nationality']? data['nationality']: '0243').change();
    data['permanent_res']['province'] ? parent.find(permanent_province).val(data['permanent_res']['province']).change():"";
    data['temporary_res']['province']? parent.find(temporary_province).val(data['temporary_res']['province']).change():"";
    data['date_of_birth']? parent.find(employ_date_birth).datepicker('setDate',moment(data['date_of_birth']).format('DD/MM/YYYY')):"";
    data['registered_date']? parent.find(employ_registered).datepicker('setDate',moment(data['registered_date']).format('DD/MM/YYYY')):""
}
//Select-province
$(document).on('change', '.select-province',function (e){
    let parent = $(this).parents('div.repeater-js');
    let fieldset = $(this).parents('.fieldset');
    $.ajax({
        url:baseURL + 'user/list-districts',
        type:'post',
        dataType: "json",
        data: {
            province_id: $(this).val(),
        },
        success: function (data){
            parent.find(".select-district").children().remove();
            parent.find(".select-ward").children().remove();
            parent.find(".select-district").append('<option value="">'+select['select_district']+'</option>');
            parent.find(".select-ward").append('<option value="">'+select['select_ward']+'</option>');
            $.each(data, function (key, value) {
                let valueSelect = parent.find(".select-district").data('value');
                let selected = valueSelect == value.district_id?'selected':'';
                parent.find(".select-district").append('<option '+selected+' value="'+ value.district_id+'">'+ value.name+'</option>');
            });
            parent.find(".select-district").trigger('change');
        },
        complete: function(){
            let province = parent.find(".select-province option:selected").text();
            let province_val = parent.find(".select-province option:selected").val();
            province = province_val != ""?province:"";
            let details_data = fieldset.find(".address_details").data("id");
            let details = fieldset.find(".address_details");
            details_data? details.text(province): fieldset.find(".address_details").attr("data-id",1);
        }
    })
});
//Select-district
$(document).on('change','.select-district',function (){
    let parent = $(this).parents('div.repeater-js');
    let fieldset = $(this).parents('.fieldset');
    $.ajax({
        url:baseURL + 'user/list-wards',
        type:'post',
        dataType: "json",
        data: {
            district_id: $(this).val(),
        },
        success: function (data){
            parent.find(".select-ward").children().remove();
            parent.find(".select-ward").append('<option value="">'+select['select_ward']+'</option>');
            $.each(data, function (key, value) {
                let valueSelect = parent.find(".select-ward").data('value');
                let selected = valueSelect == value.ward_id?'selected':'';
                parent.find(".select-ward").append('<option '+selected+' value="'+ value.ward_id+'">'+value.name+'</option>');
            });
        },
        error: function (error){

        },
        complete: function(){
            addressDetails(parent,fieldset);
        }
    })
});
//Select-ward
$(document).on('change','.select-ward',function (){
    let parent = $(this).parents('div.repeater-js');
    let fieldset = $(this).parents('.fieldset');
    addressDetails(parent,fieldset);
});
$(document).on('change','.select-street',function (){
    let parent = $(this).parents('div.repeater-js');
    let fieldset = $(this).parents('.fieldset');
    addressDetails(parent,fieldset);
});
function addressDetails(parent, fieldset){
    let province = parent.find(".select-province option:selected").text();
    let province_val = parent.find(".select-province option:selected").val();
    province = province_val !=""? province:"" ;

    let district = parent.find(".select-district option:selected").text();
    let district_val = parent.find(".select-district option:selected").val();
    district = district_val != ''?district+ ", ": "";

    let ward = parent.find(".select-ward option:selected").text();
    let ward_val = parent.find(".select-ward option:selected").val();
    ward = ward_val != ''?ward+ ", ": "";

    let street = parent.find(".select-street").val();
    street = street != ""? street +", ": "";

    let details = fieldset.find(".address_details");
    let details_val = street+ward+district+province;

    details.text(details_val);
}

$(document).ready(function (){
    addSelect2();
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
    $('#registered_date').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        endDate: formatDate(),
        autoclose: true,
    }).on('changeDate', function(e) {
        validate_profile.revalidateField('[registered-date]');
    });
    $('#date_of_birth').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        endDate: formatDate(),
        minDate: formatDate(),
        autoclose: true,
    }).on('changeDate', function(e) {
        validate_profile.revalidateField('[date-of-birth]');
    });

    $('.edu_end_date').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        autoclose: true,
        endDate: formatDate(),
    }).on('change',function (e){
        validate_education.revalidateField('[edu-end-date]');
    });

    $('.edu_start_date').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        autoclose: true,
        endDate: formatDate(),
    }).on('change', function(e) {
        validate_education.revalidateField('[edu-start-date]');
        let date = $(this).val();
        let edu_end_date = $('.edu_end_date');
        date = formatDateReverse(date);
        edu_end_date.datepicker("setStartDate", moment(date).format("DD/MM/YYYY"));
        date = moment(date).add(4, 'years');
        let amount = moment().diff(date, "years");
        amount > 0 ? edu_end_date.datepicker('setDate',moment(date).format('DD/MM/YYYY')):  edu_end_date.datepicker('setDate',moment().format('DD/MM/YYYY'));
    });
    $('.joined_date').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        autoclose: true,
        endDate: formatDate(),
    }).on('change', function(e) {
        validate_contract.revalidateField('[joined_date]');
        let select_contract_type = $('.select_contract_type').val();
        if(select_contract_type != '3'){
            let date = $(this).val();
            let end_date = $('.end_date');
            date = formatDateReverse(date);
            date = moment(date).add(2, 'months');
            let amount = moment().diff(date, "months");
            amount > 0 ? end_date.datepicker('setDate',moment(date).format('DD/MM/YYYY')):  end_date.datepicker('setDate',moment().format('DD/MM/YYYY'));
            end_date.datepicker('setStartDate',$(this).val());
        }
    });
    $('.end_date').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        autoclose: true,
        endDate: formatDate(),
        startDate: formatDate(),
    }).on('change', function(e) {
        validate_contract.revalidateField('[end_date]');
        let contract_type = $('.select_contract_type').val();
        if(contract_type != '3'){
            let end_date = $(this);
            let end_date_val = $('.end_date').val();
            let start_date_val = $('.joined_date').val();
            end_date_val ? start_date_val? end_date.datepicker('setStartDate',start_date_val):end_date.datepicker('setStartDate',formatDate()):"";
        }
    });
    $('.health_insurance').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        orientation: "bottom left",
        templates: arrows,
        format:'dd/mm/yyyy',
        autoclose: true,
        endDate: formatDate(),
    }).on('change', function(e) {
        validate_contract.revalidateField('[health_insurance]');
    });

});
//Validate profile
function checkGender(val){
    return arr_gender.includes(val);
}
function checkAddressType(val){
    return arrAddressTypeList.includes(val);
}
const validate_profile = FormValidation.formValidation(
    document.getElementById('kt-form-profile'),
    {
        fields: {
            '[full-name]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^[^0-9]{4,}(?:[^0-9]+)?(?: [^0-9]+)?$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                    blank: {
                    },
                }
            },
            '[gender]': {
                validators: {
                    callback: {
                        message: arrErrorMessage['field_not_valid'],
                        valid: true,
                        callback: function (input) {
                            return checkGender(input.value);
                        },
                    },
                    blank: {
                    },

                }
            },
            '[date-of-birth]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        message: 'The date is not in the range',
                        callback: function (input) {
                            const value = input.value;
                            return value.isValid() && value.isAfter('12/08/2022');
                        },
                    },
                    blank: {
                    },
                }
            },
            '[nationality]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[identity-no]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^([0-9]{9})$|^([0-9]{12})$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                    blank: {
                    },
                }
            },
            '[registered-date]': {
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
            '[employee-email]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                    blank: {
                    },
                }
            },
            '[issued-at]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][0][address_type]': {
                validators: {
                    different: {
                        compare: function () {
                            return document.getElementById('kt-form-profile').querySelector('[name="[1][address_type]"]').value;
                        },
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        message: arrErrorMessage['field_not_valid'],
                        valid: true,
                        callback: function (input) {
                            return checkAddressType(input.value);
                        },
                    },
                    blank: {
                    },
                }
            },
            '[address][0][province]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][0][district]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][0][ward]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][0][street]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][1][address_type]': {
                validators: {
                    different: {
                        compare: function () {
                            return document.getElementById('kt-form-profile').querySelector('[name="[0][address_type]"]').value;
                        },
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        message: arrErrorMessage['field_not_valid'],
                        valid: true,
                        callback: function (input) {
                            return checkAddressType(input.value);
                        },
                    },
                    blank: {
                    },
                }
            },
            '[address][1][province]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][1][district]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[address][1][ward]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            'address[1][street]': {
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
    //Save-profile-employee
    let parent = $('#kt-form-profile');
    let data = parent.serializeArray();
    let key = employee_key['1'];
    let formData = new FormData();
    formData.append('key', key);
    formData.append(key+"[id]", employ_id);
    if(Array.isArray(data)){
        data.forEach(({name, value}) => {
            formData.append(`${key}${name}`, value);
        });
    }
    let url_employee = baseURL + 'user/update-employee/id-user/'+id;
    $.ajax({
        url:url_employee,
        type:'post',
        data: formData,
        processData: false,
        contentType: false,
    }).done(function (response) {
        if(!response['SUCCESS_UPDATE']){
            $.each(response,function(k,v) {
                k == 'identity-no' ?$('.identity_no').val(""):"";
                validate_profile
                    .updateValidatorOption('['+k+']', 'blank', 'message', k == 'identity-no'?arrErrorMessage['field_exists']:arrErrorMessage[v])
                    .updateFieldStatus('['+k+']', 'Invalid', 'blank').enableValidator('['+k+']','notEmpty');
            });
        }else if(response['ERROR_UPDATE']){
            $.notify(arr_notification['error_update'], {type:'danger'});
        }else{
            $.notify(arr_notification['success_update'], {type:'success'});
            employ_id = response['employee-id'];
            parent.find('.permanent_province').data('value',response['address'][0]['province']);
            parent.find('.permanent_district').data('value',response['address'][0]['district']);
            parent.find('.permanent_ward').data('value',response['address'][0]['ward']);

            parent.find('.temporary_province').data('value',response['address'][1]['province']);
            parent.find('.temporary_district').data('value',response['address'][1]['district']);
            parent.find('.temporary_ward').data('value',response['address'][1]['ward']);
            $('.tab-pane-hidden').attr('style', 'display: block !important');

            $('#input-fullname').text(response['full-name']);
        }
    });
});

function checkContractType(val){
    val = check_probationary?  '1': val;
    return arrContractTypeList.includes(val);
}

function change_contract(val){
    switch (val){
        case '1':
            $('.definite').hide();
            $('.indefinite').show();
            const field = validate_contract.getFields();
            field['[health_insurance]'] ?  validate_contract.removeField('[health_insurance]'): '';
            field['[annual_leave]'] ? validate_contract.removeField('[annual_leave]') : '';
            validate_contract.addField('[end_date]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            $('.health_insurance, .annual_leave').val('');
            break;
        case '2':
            $('.definite,.indefinite').show();
            validate_contract.addField('[health_insurance]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            validate_contract.addField('[end_date]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            validate_contract.addField('[annual_leave]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^([0-9]{1,2})$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            break;
        case '3':
            let definite = $('.definite');
            let indefinite = $('.indefinite');
            definite.show();
            indefinite.hide();
            const fields = validate_contract.getFields();
            $('.end_date').val("");
            fields['[end_date]'] ? validate_contract.removeField('[end_date]'): '';
            validate_contract.addField('[annual_leave]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^([0-9]{1,2})$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            validate_contract.addField('[health_insurance]',{
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    date: {
                        format: 'DD/MM/YYYY',
                        message: arrErrorMessage['field_not_valid'],
                    },
                }
            });
            break;
    }
}
//Select contract_type
$('.select_contract_type').on('change',function (){
    if(checkContractType($(this).val())){
        change_contract($(this).val());
    }
});
let con_type = '1';

const validate_contract = FormValidation.formValidation(
    document.getElementById('kt-form-contract'),
    {
        fields: {
            '[contract_type]': {
                validators: {
                    callback: {
                        message: arrErrorMessage['field_not_valid'],
                        valid: true,
                        callback: function (input) {
                            return checkContractType(input.value);
                        },
                    },
                    blank: {
                    },
                }
            },
            '[contract_code]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[position]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[joined_date]': {
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
            '[end_date]': {
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

        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap({
                eleInvalidClass: '',
                eleValidClass: '',
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // icon: new FormValidation.plugins.Icon({
            //     valid: 'fa fa-check',
            //     invalid: 'fa fa-times',
            //     validating: 'fa fa-refresh',
            // }),

        }
    }
).on('core.form.valid', function () {
    let modal = $('#updateContractModal');
    if(employ_id){
        let parent = $('#kt-form-contract');
        let key = employee_key['3'];
        let data = parent.serializeArray();
        let formData = new FormData();
        formData.append('key', key);
        formData.append(key+"[id]", contr_id);
        let contract_type = "[contract_type]";
        if(Array.isArray(data)){
            data.forEach(({name, value}) => {
                name == contract_type && contr_id ?formData.delete(name):formData.append(`${key}${name}`, value);
            });
        }
        contr_id ?formData.append(key+contract_type, contr_type):"";
        let url_contract = baseURL + 'user/update-employee/id-user/'+id;
        $.ajax({
            url:url_contract,
            type:'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function (response) {
            if(!response['SUCCESS_UPDATE']){
                $.each(response,function(k,v) {
                    k == 'contract_code' ?$('.contract_code').val(""):"";
                    validate_contract
                        .updateValidatorOption('['+k+']', 'blank', 'message', k == 'contract_code'?arrErrorMessage['field_exists']:arrErrorMessage[v])
                        .updateFieldStatus('['+k+']', 'Invalid', 'blank').enableValidator('['+k+']','notEmpty');
                });
            }else{
                $.notify(arr_notification['success_update'], {type:'success'});
                modal.modal('hide');

                let update = $('.update_view_'+contr_id);
                if(update.length > 0){
                    let contract_code = parent.find('.contract_code').val();
                    let contract_type = parent.find('.select_contract_type option:selected').text();
                    let position = parent.find('.position option:selected').text();
                    let health_insurance = parent.find('.health_insurance').val();
                    let joined_date = parent.find('.joined_date').val();
                    let end_date = parent.find('.end_date').val();
                    end_date = end_date?end_date:arr['indefinite'];

                    update.parents('tr').find('.contract_code_view').text(contract_code);
                    update.parents('tr').find('.contract_type_view').text(contract_type);
                    update.parents('tr').find('.position_view').text(position);
                    update.parents('tr').find('.health_insurance_view').text(health_insurance? health_insurance: arr['no_participate']);
                    update.parents('tr').find('.time_contract_view').text(joined_date+" - "+end_date);
                }else{
                    let contract = 'contract';
                    let contract_body_view = $('.contract_body_view');
                    contract_body_view.find('.no-data').remove();
                    let contract_type_name = arr_notification[response[contract]['contract_type_name']];
                    let health_insurance = response[contract]['health_insurance'];
                    health_insurance = health_insurance ? health_insurance: arr['no_participate'];
                    let end_date = response[contract]['end_date'];
                    end_date = end_date ? end_date: arr['indefinite'];
                    let contract_type = response[contract]['contract_type'];
                    let contract_form = $('#contract');
                    contract_type == '3'? contract_form.find('.card-footer').find('.card-toolbar').remove():"";
                    let vacation_hidden = $('.vacation-hidden');
                    contract_type == '3'? vacation_hidden.attr('style', 'display: block !important'):vacation_hidden.attr('style', 'display: none !important');
                    let see_details = arr['see_details'];
                    let edit = arr['edit'];
                    let delete_ = arr['delete'];
                    contract_body_view.append(
                        `
                            <tr class="tr_contract_view">
                           <td class="pl-7 py-8">
                               <span class="contract_code_view text-dark-75 font-weight-bolder d-block font-size-lg">${response[contract]['contract_code']}</span>
                           </td>
                           <td>
                               <span class="contract_type_view text-dark-75 font-weight-bolder d-block font-size-lg">${contract_type_name}</span>
                           </td>
                           <td>
                               <span class="position_view text-dark-75 font-weight-bolder d-block font-size-lg">${response[contract]['position_name']}</span>
                           </td>
                           <td>
                               <span class="health_insurance_view text-right text-primary font-weight-bolder d-block font-size-lg">${health_insurance}</span>
                           </td>
                           <td>
                               <span class="time_contract_view text-right text-primary font-weight-bolder d-block font-size-lg">${response[contract]['joined_date']} - ${end_date}</span>
                           </td>
                           <td class="text-center pr-0">
                               <button onclick="seeDetailsContract(${response[contract]['contract_type']}, ${response[contract]['id']});" type="button" class=" btn btn-icon btn-light btn-hover-primary btn-sm " data-toggle="tooltip" data-placement="top" title="" data-original-title="${see_details}">
                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"></rect>
                                                <path d="M7,3 L17,3 C19.209139,3 21,4.790861 21,7 C21,9.209139 19.209139,11 17,11 L7,11 C4.790861,11 3,9.209139 3,7 C3,4.790861 4.790861,3 7,3 Z M7,9 C8.1045695,9 9,8.1045695 9,7 C9,5.8954305 8.1045695,5 7,5 C5.8954305,5 5,5.8954305 5,7 C5,8.1045695 5.8954305,9 7,9 Z" fill="#000000"></path>
                                                <path d="M7,13 L17,13 C19.209139,13 21,14.790861 21,17 C21,19.209139 19.209139,21 17,21 L7,21 C4.790861,21 3,19.209139 3,17 C3,14.790861 4.790861,13 7,13 Z M17,19 C18.1045695,19 19,18.1045695 19,17 C19,15.8954305 18.1045695,15 17,15 C15.8954305,15 15,15.8954305 15,17 C15,18.1045695 15.8954305,19 17,19 Z" fill="#000000" opacity="0.3"></path>
                                            </g>
                                        </svg>
                                    </span>
                               </button>
                                <button onclick="updateContract(${response[contract]['contract_type']}, ${response[contract]['id']});" type="button" class="update_view_${response[contract]['id']} btn btn-icon btn-light btn-hover-primary btn-sm mx-3" data-toggle="tooltip" data-placement="top" title="" data-original-title="${edit}">
                                    <span class="svg-icon svg-icon-md svg-icon-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"></rect>
                                                <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>
                                                <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                            </g>
                                        </svg>
                                    </span>
                                </button>
                                <button type="button" onclick="deleteContract(${response[contract]['contract_type']}, ${response[contract]['id']});" class="delete_view_${response[contract]['id']} btn btn-icon btn-light btn-hover-primary btn-sm " data-toggle="tooltip" data-placement="top" title="" data-original-title="${delete_}">
                                    <span class="svg-icon svg-icon-md svg-icon-primary">
                                       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                  <rect x="0" y="0" width="24" height="24"></rect>
                                                  <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>
                                                  <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                                              </g>
                                       </svg>
                                     </span>
                                </button>
                           </td>
                        </tr>
                        `
                    )
                    $('body').tooltip({
                        selector: '[data-toggle="tooltip"]'
                    });
                }
            }
        });
    }else{
        $.notify(arr_notification['error_update'], {type:'danger'});
        modal.modal('hide');
    }

});
let contr_id = "";
let contr_type = "";
function updateContract(contract_type, contract_id) {
    let url = baseURL + 'user/get-data-contract-type/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        data: {
            contract_type: contract_type,
            contract_id: contract_id
        },
        success: function (data){
            let contract_type = $('.select_contract_type');
            contract_type.addClass('fc-not-allowed text-muted');
            if(check_probationary && data['contract_type'] == '1') {
                $(".select_contract_type option[value='1']").remove();
                contract_type.append('<option value="1">' + arr_notification['PROBATIONARY'] + '</option>');
            }
            let contract_type_hidden = $('.contract_type_hidden');
            let label = contract_type_hidden.find('.no_edit');
            let cannot_change_message = arr['cannot_change'];
            if(label.length < 1){
                contract_type_hidden.find('label').append(
                    `
                        <span class="no_edit required ">(${cannot_change_message})</span>
                    `
                );
            }
            contract_type.val(data['contract_type']);
            contract_type.on('change',function(){
                if(checkContractType(contract_type.val())){
                    change_contract(contract_type.val());
                }
            });
            contract_type.trigger('change');
            contract_type.attr('readonly',true);
            contract_type.attr('disabled',true);
            $('.contract_code').val(data['contract_code']);
            $('.position').val(data['position_id']);
            $('.joined_date').datepicker('setDate',formatDate(data['joined_date']));
            data['salary'] ? $('.salary').val(formatNumber(data['salary'])): '';
            data['end_date'] ? $('.end_date').datepicker('setDate',formatDate(data['end_date'])): '';
            data['contract_note']? $('.reason').val(data['contract_note']): '';
            data['health_insurance'] ? $('.health_insurance').datepicker('setDate',formatDate(data['health_insurance'])): '';
            data['annual_leave']? $('.annual_leave').val(data['annual_leave']): '';
            contr_id = data['contract_id'];
            contr_type = data['contract_type'];
            contract_type.off('change');
        },
        complete: function (){
            $('#updateContractModal').modal('show');
        }
    });
}
let send_contract_type = "";
let send_contract_id = "";
function deleteContract(contract_type, contract_id){
    $('#deleteContract').modal('show');
    send_contract_type = contract_type;
    send_contract_id = contract_id;
}
$('#submitDeleteContract').on('click',function (){
    let url = baseURL + 'user/delete-contract/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        data: {
            contract_type: send_contract_type,
            contract_id: send_contract_id
        },
        success: function (data){
            if(data['SUCCESS_DELETE']){
                let delete_contract_view = $('.delete_view_'+send_contract_id);
                delete_contract_view.parents('.tr_contract_view').remove();
                let add = arr['add'];
                let contract_body_view = $('.contract_body_view');
                let vacation_hidden = $('.vacation-hidden');
                send_contract_type == '3'? vacation_hidden.attr('style', 'display: none !important'):vacation_hidden.attr('style', 'display: block !important');
                if(send_contract_type == '3'){
                    let contract_form = $('#contract');
                    contract_form.find('.card-footer').append(
                        `
                            <div class="card-toolbar">
                                <button type="button" id="add_contract_modal" data-toggle="modal" data-target="#updateContractModal" class="btn btn-primary btn-sm font-weight-bold">
                                    <i class="flaticon-add-circular-button"></i>${add}</button>
                            </div>
                        `
                    );
                }
                let tr_contract_view = $('.tr_contract_view');
                let no_data = arr_notification['no_data'];
                if(tr_contract_view.length < 1){
                    contract_body_view.append(
                        `
                            <tr class="no-data">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><span class="text-danger font-weight-bolder d-block font-size-lg">${no_data}</span></td>
                                <td></td>
                                <td></td>
                            </tr>
                        `
                    );
                }
            }
        },
        complete: function (){
            $('#deleteContract').modal('hide');
        }
    });
});
$(document).on('click','#add_contract_modal',function (){
    let url = baseURL + 'user/check-contract-type/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        success: function (data){
            let kt_form_contract = $('#kt-form-contract');
            let contract_type = $('.select_contract_type');
            kt_form_contract.find("input[type=text],input[type=number]").val("");
            validate_contract.resetForm(true);
            if(data){
                $(".select_contract_type option[value='1']").remove();
                //change_contract_type
                contract_type.val('3');
            }else{
                let option = $(".select_contract_type option[value='1']");
                if(option.length < 1){
                    let probationary = arr_notification['PROBATIONARY'];
                    contract_type.append(
                        `
                            <option value="1">${probationary}</option>
                        `
                    );
                }
                contract_type.val('1');
            }
            contract_type.removeClass('fc-not-allowed text-muted');
            let contract_type_hidden = $('.contract_type_hidden');
            let label = contract_type_hidden.find('.no_edit');
            if(label){
                label.remove();
            }
            contract_type.attr('readonly',false);
            contract_type.attr('disabled',false);
            contract_type.on('change',function(){
                if(checkContractType(contract_type.val())){
                    change_contract(contract_type.val());
                }
            });
            contract_type.trigger('change');
            contr_id = "";
            contr_type = "";
            kt_form_contract.find("textarea").val("");
        }
    });
});
function seeDetailsContract(contract_type, contract_id){
    $('#seeDetails').modal('show');
    let url = baseURL + 'user/get-data-contract/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        data: {
            contract_type: contract_type,
            contract_id: contract_id
        },
        success: function (data){
           $('.view_contract_code').text(data['contract_code']);
           $('.view_contract_type').text(arr_notification[data['contract_type']]);
           $('.view_annual_leave').text(data['annual_leave']? data['annual_leave']: 0);
           $('.view_position').text(data['position_name']);
           $('.view_salary').text(data['salary']? formatNumber(data['salary']): 0);
           let view_health_insurance = $('.view_health_insurance');
           view_health_insurance.text(data['health_insurance']? formatDate(data['health_insurance']): arr['no_participate']);
           data['health_insurance']? view_health_insurance.addClass('text-right text-primary'): view_health_insurance.removeClass('text-right text-primary');
           $('.view_joined_date').text(data['joined_date']? formatDate(data['joined_date']):'');
           $('.view_end_date').text(data['end_date']?formatDate(data['end_date']):arr['indefinite']);
           $('.view_contract_note').text(data['contract_note']);
        }
    });
}

const validate_education = FormValidation.formValidation(
    document.getElementById('kt-form-education'),
    {
        fields: {
            '[major]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[qualification]': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    blank: {
                    },
                }
            },
            '[edu-start-date]': {
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
            '[edu-end-date]': {
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
    let modal = $('#modal_update_education');
    if(employ_id){
        let form_edu = $('#kt-form-education');
        let data = form_edu.serializeArray();
        let parent = $('#education');
        let key = 'education';
        let formData = new FormData();
        formData.append('key', key);
        formData.append(key+"[id]", edu_id);
        if(Array.isArray(data)){
            data.forEach(({name, value}) => {
                formData.append(`${key}${name}`, value);
            });
        }
        let url_education = baseURL + 'user/update-employee/id-user/'+id;
        $.ajax({
            url:url_education,
            type:'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function (response) {
            if(!response['SUCCESS_UPDATE']){
                $.each(response,function(k,v) {
                    validate_education
                        .updateValidatorOption('['+k+']', 'blank', 'message',arrErrorMessage[v])
                        .updateFieldStatus('['+k+']', 'Invalid', 'blank').enableValidator('['+k+']','notEmpty');
                });
            }else if(response['ERROR_UPDATE']){
                $.notify(arr_notification['error_update'], {type:'danger'});
            }else{
                $.notify(arr_notification['success_update'], {type:'success'});
                let update_edu = $('.update_view_edu_'+edu_id);
                let education = response['education'];
                let edu_body_view = $('.edu_body_view');
                let no_data_edu = $('.no_data_edu');
                let edu_start_date = education['edu-start-date'];
                let edu_end_date = education['edu-end-date'];
                let education_id = education['id'];
                let employee_id_edu = education['employee'];
                let major = education['major'];
                let qualification = education['qualification'];
                let edit_edu = arr['edit'];
                let delete_edu = arr['delete'];

                if(update_edu.length > 0){
                    update_edu.parents('tr').find('.qualification_edu_view').text(qualification);
                    update_edu.parents('tr').find('.major_edu_view').text(major);
                    update_edu.parents('tr').find('.start_date_edu_view').text(edu_start_date);
                    update_edu.parents('tr').find('.end_date_edu_view').text(edu_end_date);
                }else{
                    parent.find(no_data_edu).remove();
                    parent.find(edu_body_view).append(
                        `
                        <tr class="tr_edu_view">
                            <td class="pl-7 py-8">
                                <span class="qualification_edu_view text-dark-75 font-weight-bolder d-block font-size-lg">${qualification}</span>
                            </td>
                            <td>
                                <span class="major_edu_view text-dark-75 font-weight-bolder d-block font-size-lg">${major}</span>
                            </td>
                            <td>
                                <span class="start_date_edu_view text-right text-primary font-weight-bolder d-block font-size-lg">${edu_start_date}</span>
                            </td>
                            <td>
                                <span class="end_date_edu_view text-right text-primary font-weight-bolder d-block font-size-lg">${edu_end_date}</span>
                            </td>
                            <td class="text-center pr-0">
                                <button onclick="updateEducation(${education_id},${employee_id_edu});" type="button" class="update_view_edu_${education_id} btn btn-icon btn-light btn-hover-primary btn-sm mx-3" data-toggle="tooltip" data-placement="top" title="" data-original-title="${edit_edu}">
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"></rect>
                                        <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>
                                        <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                    </g>
                                </svg>
                            </span>
                                </button>
                                <button type="button" onclick="deleteEducation(${education_id},${employee_id_edu});" class="delete_view_edu_${education_id} btn btn-icon btn-light btn-hover-primary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="${delete_edu}">
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24"></rect>
                                        <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>
                                        <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                                    </g>
                                </svg>
                            </span>
                                </button>
                            </td>
                    </tr>
                    `
                    );
                }
            }
            modal.modal('hide');
        });
    }else{
        $.notify(arr_notification['error_update'], {type:'danger'});
        modal.modal('hide');
    }

});
let vacation_total ='';
$('#update_vacation_total').on('click',function (){
    let url = baseURL + 'user/get-vacation/id-user/'+id;
    $.ajax({
        url:url,
        type:'post',
        success: function (data){
            validate_vacation.resetForm(true);
            let parent = $('#kt-form-vacation');
            parent.find('.vacation_total').val(data['vacation_total']? data['vacation_total']: 0);
            vacation_total = data['vacation']['vacation_total'];
            parent.find('.day_available').text(vacation_total?' (<= '+vacation_total+')':'(= 0'+')' );
        },
        error: function (error){
        },
        complete: function(){
            $('#modal_update_vacation').modal('show');
        }
    });
});
function checkVacationTotal(val){
    let number = vacation_total?vacation_total:0;
    if(val > number){
        return false;
    }else{
        return true;
    }
}
const validate_vacation = FormValidation.formValidation(
    document.getElementById('kt-form-vacation'),{
        fields: {
            'vacation_total': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },

                    callback: {
                        message: arrErrorMessage['field_not_valid'],
                        valid: true,
                        callback: function (input) {
                            return checkVacationTotal(input.value);
                        },
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
    let url = baseURL + 'user/update-vacation/id-user/'+id;
    $.ajax({
        url:url,
        type:'post',
        data: {
            vacation_total: $('.vacation_total').val(),
        },
        success: function (data){
            if(data['SUCCESS_UPDATE']){
                $.notify(arr_notification['success_update'], {type:'success'});
            }else{
                $.notify(arr_notification['error_update'], {type:'danger'});
            }
            let parent_vacation = $('.details_vacation');
            parent_vacation.find('.total_number').text(data['vacation']['vacation_total']);
            parent_vacation.find('.total_current_day').text(data['vacation']['current_vacation']);
            parent_vacation.find('.total_day_use').text(data['vacation']['days_off_total']);
            parent_vacation.find('.total_annual').text(data['vacation']['annual_leave']);
        },
        error: function (error){
        },
        complete: function(){
            $('#modal_update_vacation').modal('hide');
        }
    });
});
let edu_id = "";
function updateEducation(education_id, employee_id) {
    let url = baseURL + 'user/get-data-education/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        data: {
            education_id: education_id,
            employee_id: employee_id
        },
        success: function (data){
            $('.edu_start_date').datepicker('setDate',moment(data['edu_start_date']).format('DD/MM/YYYY'));
            $('.edu_end_date').datepicker('setDate',moment(data['edu_end_date']).format('DD/MM/YYYY'));
            $('.qualification').val(data['qualification']);
            $('.major').val(data['major']);
            edu_id = data['education_id'];
        },
        complete: function (){
            $('#modal_update_education').modal('show');
        }
    });
}
$('#add_education').on('click',function(){
    edu_id = "";
});
$('#modal_update_education').on('hidden.bs.modal',function (e){
    let kt_form_education = $('#kt-form-education');
    kt_form_education.find("input[type=text]").val("");
    validate_education.resetForm(true);
});
$('#updateContractModal').on('hidden.bs.modal',function (e){
    validate_contract.resetForm(true);
    let kt_form_contract = $('#kt-form-contract');
    kt_form_contract.find("textarea").val("");

});
$('#updateContractModal').on('shown.bs.modal', function () {
    $('.position').select2({
        tags: true
    })
});
$('.salary').on('keydown',function (){
    formatCurrency($(this));
});
let education_id_update ="";
let employee_id_update ="";
function deleteEducation(education_id, employee_id){
    $('#deleteEducation').modal('show');
    education_id_update = education_id;
    employee_id_update = employee_id;
}
$('#submitDeleteEducation').on('click',function (){
    let url = baseURL + 'user/delete-education/id-user/'+id;
    $.ajax({
        url:url,
        type: "post",
        dataType: "json",
        data: {
            education_id: education_id_update,
            employee_id: employee_id_update
        },
        success: function (data){
            if(data['SUCCESS_DELETE']){
                $.notify(arr_notification['success_delete'], {type:'success'});
                let delete_edu_view = $('.delete_view_edu_'+education_id_update);
                delete_edu_view.parents('.tr_edu_view').remove();
                let parent = $('#education');
                let edu_body_view = $('.edu_body_view');
                let no_data_edu = arr_notification['no_data'];
                let tr_edu_view = $('.tr_edu_view');
                if(tr_edu_view.length < 1){
                    parent.find(edu_body_view).append(
                        `
                            <tr class="no_data_edu">
                                <td></td>
                                <td></td>
                                <td><span class="text-danger font-weight-bolder d-block font-size-lg">${no_data_edu}</span></td>
                                <td></td>
                                <td></td>
                            </tr>
                        `
                    );
                }
            }else{
                $.notify(arr_notification['error_delete'], {type:'danger'});
            }
        },
        complete: function (){
            $('#deleteEducation').modal('hide');
        }
    });
});

