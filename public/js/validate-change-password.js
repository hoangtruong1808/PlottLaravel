// let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
// let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
// let weakRegex = new RegExp("^[A-Za-z0-9]{1,7}$");

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

const change_password = FormValidation.formValidation(
    document.getElementById('change-password-form'),
    {
        fields: {
            'password': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    callback: {
                        callback: function (input) {
                            if($(".error-password").length == 1){
                                $(".error-password").remove();
                            }
                            return true;
                        }
                    }
                }
            },
            'password2': {
                validators: {
                    different: {
                        compare: function () {
                            return document.getElementById('change-password-form').querySelector('[name="password"]').value;
                        },
                        message: arrErrorMessage['error_new_password'],
                    },
                    callback: {
                        callback: function (input) {
                            return displayValidatePassword(input);
                            // }
                        }
                    }
                }
            },
            'password3': {
                validators: {
                    notEmpty:{
                        message: arrErrorMessage['field_required'],
                    },
                    identical: {
                        compare: function () {
                            return document.getElementById('change-password-form').querySelector('[name="password2"]').value;
                        },
                        message: arrErrorMessage['error_new_password'],
                    }
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
    $('#change-password-form').submit();
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
