var avatar1 = new KTImageInput('kt_user_add_avatar');
let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
let weakRegex = new RegExp("^[A-Za-z0-9]{1,7}$");
var inputne;
function regimePassword(password){
    if(strongRegex.test(password)){
        return 3;
    }else if(mediumRegex.test(password)){
        return 2;
    }else if(weakRegex.test(password)){
        return 1;
    }else{
        return 4;
    }
}

const add = FormValidation.formValidation(
    document.getElementById('add-user'),
    {
        fields: {
            'username': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    regexp: {
                        regexp: '^[\\w][^_\\W]{4,20}$',
                        message: arrErrorMessage['field_not_valid'],
                    },
                    callback: {
                        callback: function (input) {
                            if($(".error-username").length == 1){
                                $(".error-username").remove();
                            }
                            return true;
                        }
                    }
                }
            },
            'password': {
                validators: {
                    // notEmpty:{
                    //     message: arrErrorMessage['error_empty_password'],
                    // },
                    callback: {
                        // valid: false,
                        // message: arrErrorMessage['field_not_valid'],
                        callback: function (input) {
                            // inputne = input;
                            // console.log(input, input.value);
                            // if (input.value.length > 0) {
                                return displayValidatePassword(input);
                            // }
                        }
                    }
                }
            }
            ,'password2': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    identical: {
                        compare: function () {
                            return document.getElementById('add-user').querySelector('[name="password"]').value;
                        },
                        message: arrErrorMessage['error_new_password'],
                    }
                }
            },
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
                            if($(".error-email").length == 1){
                                $(".error-email").remove();
                            }
                            return true;
                        }
                    }
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
                            if($(".error-phone").length == 1){
                                $(".error-phone").remove();
                            }
                            return true;
                        }
                    }
                }
            },
            'avatar': {
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
            bootstrap: new FormValidation.plugins.Bootstrap(),
            submitButton: new FormValidation.plugins.SubmitButton(),
        }
    }
).on('core.form.valid', function () {
    $('#add-user').submit();
});


function displayValidatePassword(input){
    let password = input.value;
    let input_query = $("#" + input.element.id);

    // input_query.parents('.form-group').find('.fv-plugins-message-container').hide();
    input_query.parents('.form-group').find('.invalid-feedback').hide();
    if(password == ''){
        // input_query.parents('.form-group').find('.invalid-feedback').show();
        // input_query.parents('.form-group').find('.invalid-feedback.class-password').hide();
        // input_query.parents('.form-group').find('.invalid-feedback.short-password').hide();
        input_query.parents('.form-group').find('.invalid-feedback1').removeClass('bg-danger');
        input_query.parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
        input_query.parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
        $('.progress-hidden').prop('hidden',true);
        return {
            valid: false,
            message: arrErrorMessage['error_empty_password'],
        };
    }else{
        $('.progress-hidden').prop('hidden',false);
        input_query.parents('.form-group').find('.progress').show();
        if(regimePassword(password) == 1){
            // input_query.parents('.form-group').find('.invalid-feedback.short-password').show();
            input_query.parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
            input_query.parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
            input_query.parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
            return {
                valid: false,
                message: arrErrorMessage['password_short'],
            };
        }else if(regimePassword(password) == 2){
            input_query.parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
            input_query.parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
            input_query.parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
            input_query.parents('.form-group').find('.invalid-feedback.medium-password').show();
            return true;
        }else if(regimePassword(password) == 3){
            input_query.parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
            input_query.parents('.form-group').find('.invalid-feedback3').addClass('bg-success');
            input_query.parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
            // $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
            input_query.parents('.form-group').find('.invalid-feedback.strong-password').show();
            return true;
        }else if(regimePassword(password) == 4){
            // input_query.parents('.form-group').find('.invalid-feedback.weak-password').show();
            input_query.parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
            input_query.parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
            input_query.parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
            return {
                valid: false,
                message: arrErrorMessage['password_weak'],
            };
        }
    }
    return true;
}
// $('input[type=password]').on("keyup", function(){
//
//     let passwordLength = $("#txtNewPassword").val().length;
//     let confirmPassword = $("#txtConfirmPassword").val();
//
// })
// $('input[type="password"]').on("keyup", function(){
//     let password = $("#txtNewPassword").val();
//     let confirmPassword = $("#txtConfirmPassword").val();
//     $(this).parents('.form-group').find('.fv-plugins-message-container').hide();
//     let isDisabled = function(){
//         let tr = $('input[type="password"]').not(':disabled');
//         let result = false;
//         tr.each(function(){
//             if(password != confirmPassword){
//                 result = true;
//                 return true;
//             }
//         })
//         return result;
//     }
//     isCheckInput = isDisabled();
//     if($(this).val() == ''){
//         $(this).parents('.form-group').find('.invalid-feedback').show();
//         // $(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
//         $(this).parents('.form-group').find('.invalid-feedback.class-password').hide();
//         $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
//         // $(this).parents('.form-group').find('.invalid-feedback.format-phone').hide();
//         // $(this).parents('.form-group').find('.invalid-feedback.format-mail').hide();
//         // $(this).parents('.form-group').find('.invalid-feedback.format-username').hide();
//         $(this).parents('.form-group').find('.invalid-feedback1').removeClass('bg-danger');
//         $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
//         $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
//         $('.progress-hidden').prop('hidden',true);
//     }else{
//         $(this).parents('.form-group').find('.invalid-feedback').hide();
//         let name = $(this).attr('name');
//         if(name == 'password2'){
//             if (password != confirmPassword){
//                 $(this).parents('.form-group').find('.invalid-feedback').show();
//             }
//         }else if(name=='password'){
//             $('.progress-hidden').prop('hidden',false);
//             $(this).parents('.form-group').find('.progress').show();
//             if(regimePassword(password) == 1){
//                 $(this).parents('.form-group').find('.invalid-feedback.short-password').show();
//                 $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
//                 $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
//                 $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
//             }else if(regimePassword(password) == 2){
//                 $(this).parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
//                 $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
//                 $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
//                 // $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
//                 $(this).parents('.form-group').find('.invalid-feedback.medium-password').show();
//             }else if(regimePassword(password) == 3){
//                 $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
//                 $(this).parents('.form-group').find('.invalid-feedback3').addClass('bg-success');
//                 $(this).parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
//                 // $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
//                 $(this).parents('.form-group').find('.invalid-feedback.strong-password').show();
//             }else if(regimePassword(password) == 4){
//                 $(this).parents('.form-group').find('.invalid-feedback.weak-password').show();
//                 $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
//                 $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
//                 $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
//             }
//         // }else if(name=='phone'){
//         //     if(!checkPhone(phone)){
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-phone').show();
//         //     }else{
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-phone').hide();
//         //     }
//         // }else if(name=='email'){
//         //     if(!checkMail(mail)){
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-mail').show();
//         //     }else{
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-mail').hide();
//         //     }
//         // }else if(name=='username'){
//         //     if(!checkUsername(username)){
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-username').show();
//         //     }else{
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-username').hide();
//         //     }
//         // }else if(name=='fullname'){
//         //     if(!checkFullname(fullname)){
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-fullname').show();
//         //     }else{
//         //         $(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
//         //     }
//         }
//     }
//     // let key = $(this)[0].name;
//     // if(key == 'password2'){
//     // 	if($(this).val() == $('input[name="password"]').val()){
//     // 		$(".empty-" + key + ",.error-" + key).hide();
//     // 	}else{
//     // 		$(".empty-" + key).show();
//     // 	}
//     // }else{
//     // 	$(this).val() == '' ? $(".empty-" + key).show() : $(".empty-" + key + ",.error-" + key).hide();
//     // }
//     // $('input[name="username"]').val() == '' ? $(".empty-username").show() : $(".empty-username").hide();
//     // $('input[name="fullname"]').val() == '' ? $(".empty-fullname").show() : $(".empty-fullname").hide();
//     // $('input[name="password"]').val() == '' ? $(".empty-password").show() : $(".empty-password").hide();
//     // $('input[name="password2"]').val() == '' ? $(".empty-password2").show() : $(".empty-password2").hide();
//     // $('input[name="phone"]').val() == '' ? $(".empty-phone").show() : $(".empty-phone").hide();
//     // $('input[name="email"]').val() == '' ? $(".empty-email").show() : $(".empty-email").hide();
//
//     $('button[type="submit"]').prop('disabled',isDisabled() || isCheckFile);
// })
