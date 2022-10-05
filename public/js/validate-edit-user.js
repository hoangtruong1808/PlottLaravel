let avatar1 = new KTImageInput('kt_image_1');
let security_information = 'security-information';
let general_information = 'general-information';
let id_user = id;
let arr_translate = arrErrorMessage;
let check_ldap = ldap;
let check_layout = layout;
window.onload = function() {
    $('body').find('.overlay').removeClass() ;
}
$(document).ready(function(){
    // check_ldap ?
});
//format url
$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");
    if (location.hash) {
        const hash = url.split("#");
        if(check_layout == 'user'){
            check_ldap ? $('#myTabPassword a[href="#'+general_information+'"]').tab("show"): $('#myTabPassword a[href="#'+security_information+'"]').tab("show");
            url = location.href.replace(/\/#/, "#");
            url = url.replace('#'+hash[1], "");
        }else{
            check_ldap ? $('#myTabPassword a[href="#'+general_information+'"]').tab("show"): $('#myTabPassword a[href="#'+hash[1]+'"]').tab("show");
            url = location.href.replace(/\/#/, "#");
            url = !check_ldap ? url : url.replace('#'+hash[1], "");
        }

        history.replaceState(null, null, url);
    }else{
        if(check_layout == 'user'){
            check_ldap ? $('#myTabPassword a[href="#'+general_information+'"]').tab("show"):$('#myTabPassword a[href="#'+security_information+'"]').tab("show");
        }else{
            $('#myTabPassword a[href="#'+general_information+'"]').tab("show");
        }
    }

    $('a[data-toggle="tab"]').on("click", function() {
        if(!check_ldap){
            let newUrl;
            const hash = $(this).attr("href");
            if(hash === "#"+general_information) {
                newUrl = url.split("#")[0];
            } else {
                newUrl = url.split("#")[0] + hash;
            }
            // newUrl += "/";
            history.replaceState(null, null, newUrl);
        }

    });
    let my_tab_password =$('#myTabPassword');
    if(layout == 'user'){
        if(check_ldap){
            my_tab_password.find('.tab-pane-general').attr('style', 'display: block !important');
            my_tab_password.find('.tab-pane-hidden').attr('style', 'display: none !important');
        }else{
            my_tab_password.find('.tab-pane-general').attr('style', 'display: none !important');
            my_tab_password.find('.tab-pane-hidden').attr('style', 'display: block !important');
        }
    }else{
        if(check_ldap){
            my_tab_password.find('.tab-pane-hidden').attr('style', 'display: none !important');
        }else{
            my_tab_password.find('.tab-pane-hidden').attr('style', 'display: block !important');
        }
    }
});

const edit = FormValidation.formValidation(
    document.getElementById('kt-edit-user'),
    {
        fields: {
            'fullname': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: "^[^0-9]{4,50}(?:[^0-9]+)?(?: [^0-9]+)?$",
                        message: arrErrorMessage['field_not_valid'],
                    },

                }
            },
            'phone': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        // regexp: "^[0-9]{10}$",
                        regexp: "^0[0-9]{9}$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        callback: function (input) {
                            let error_phone = $(".error-phone");
                            if(error_phone.length === 1){
                                error_phone.remove();
                            }
                            return true;
                        }
                    }
                }
            },
            'email': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    emailAddress: {
                        message: arrErrorMessage['field_not_valid'],
                    },
                    regexp: {
                        regexp: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        callback: function (input) {
                            let error_email = $(".error-email");
                            if(error_email.length === 1){
                                error_email.remove();
                            }
                            return true;
                        }
                    }
                }
            },
            'profile_avatar': {
                validators: {
                    file: {
                        extension: 'jpeg,jpg,png',
                        type: 'image/jpeg,image/png',
                        maxSize: 4195024, // 2048 * 1024
                        message: uploadErrorImage,
                    },
                }
            },
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap(
                {
                    eleInvalidClass: '',
                    eleValidClass: '',
                }
            ),
            submitButton: new FormValidation.plugins.SubmitButton(),
        }
    }
).on('core.form.valid', function () {
    $('#kt-edit-user').submit();
});
function regimePassword(value){
    if(strongRegex.test(value)){
        return 4;
    }else if(mediumRegex.test(value)){
        return 3;
    }else if(weakRegex.test(value)){
        return 1;
    }else{
        return 2;
    }
}

function checkPasswordMeter(value,parent){
    let bar = parent.find('.strengthBar');
    let message = '';
    let score = regimePassword(value);
    switch (score) {
        case 1:
            bar.attr('class', 'strengthBar progress-bar bg-danger')
                .css('width', '10%');
            message = arr_translate['password_short'];
            break;
        case 2:
            bar.attr('class', 'strengthBar progress-bar bg-danger')
                .css('width', '25%');
            message = arr_translate['password_weak'];
            break;
        case 3:
            bar.attr('class', 'strengthBar progress-bar bg-warning')
                .css('width', '65%');
            message = arr_translate['password_medium'];
            break;
        case 4:
            bar.attr('class', 'strengthBar progress-bar bg-success')
                .css('width', '100%');
            message = arr_translate['password_strong'];
            break;
    }
    if (score < 3) {
        return {
            valid: false,
            message: message
        }
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function (e) {
    let form_password = document.getElementById('kt-form-password');
    const validate_password = FormValidation.formValidation(
        form_password, {
            fields: {
                '[old_password]': {
                    validators: {
                        notEmpty: {
                            message: arr_translate['field_required'],
                        },
                        callback: {
                            callback: function (input) {
                                let password_progress = $(input.element).parents('.col-lg-6').find('.progress');
                                let password = input.value;
                                if (password === '') {
                                    $(password_progress).addClass('d-none');
                                    return true;
                                }
                                $(password_progress).removeClass('d-none');
                                return checkPasswordMeter(password, password_progress);
                            }
                        },
                        blank:{}
                    }
                },
                '[new_password]': {
                    validators: {
                        notEmpty: {
                            message: arr_translate['field_required'],
                        },
                        callback: {
                            callback: function (input) {
                                let password_progress = $(input.element).parents('.col-lg-6').find('.progress');
                                let password = input.value;
                                if (password === '') {
                                    $(password_progress).addClass('d-none');
                                    return true;
                                }
                                $(password_progress).removeClass('d-none');
                                return checkPasswordMeter(password, password_progress);
                            }
                        },
                        blank:{}
                    }
                },
                '[confirm_password]': {
                    validators: {
                        // notEmpty: {
                        //     message: arr_translate['field_required'],
                        // },
                        callback: {
                            message: arr_translate['password_not_match'],
                            callback: function (input) {
                                if (input === '') {
                                    return true;
                                }
                                let new_password = $('input[name="[new_password]"]').val();
                                return input.value === new_password;
                            }
                        },
                        blank:{}
                    }
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(
                    {
                        eleInvalidClass: '',
                        eleValidClass: '',
                    }
                ),
                submitButton: new FormValidation.plugins.SubmitButton(),
            }

        }
    ).on('core.form.valid', function () {
        let parent = $('#kt-form-password');
        let key = 'password';
        let data = parent.serializeArray();
        let formData = new FormData();
        if (Array.isArray(data)) {
            data.forEach(({name, value}) => {
                formData.append(`${key}${name}`, value);
            });
        }
        let url_password = baseURL + 'user/update-password/id-user/' + id_user;
        $.ajax({
            url: url_password,
            type: 'post',
            data: formData,
            processData: false,
            contentType: false,
        }).done(function (response) {
            if(response['SUCCESS_UPDATE']){
                $.notify(arr_translate['success_update'], {type:'success'});
                parent.find('input').val('');
                parent.find('.progress').addClass('d-none');
                validate_password.resetForm(true);
            }else if(response['ERROR_UPDATE']){
                $.notify(arr_translate['error_update'], {type:'danger'});
            }
            else{
                $.each(response,function(k,v) {
                    k ? parent.find('input[name='+'"['+k+']"'+']').val(""):"";
                    // console.log($('input[name='+'"['+k+']"'+']').val(""));
                    validate_password
                        .updateValidatorOption('['+k+']', 'blank', 'message', arr_translate[v])
                        .updateFieldStatus('['+k+']', 'Invalid', 'blank').enableValidator('['+k+']','notEmpty');
                });
            }
        });
    });
    // Revalidate the password when changing the username
    form_password.querySelector('[name="[new_password]"]').addEventListener('input', function () {
        validate_password.revalidateField('[confirm_password]');
    });
});
$('.password-toggle').on('click', function (){
    let input = $(this).parents('.col-lg-6').find('input');
    let la = $(this).parent().find('.la');
    la.toggleClass('la-eye-slash');
    la.toggleClass('la-eye');
    la.hasClass('la-eye-slash')?input.attr('type','password'):input.attr('type','text');
});