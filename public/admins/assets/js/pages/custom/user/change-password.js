// $("#save-password").on("click", function(){
//     $("#change-password-form").submit();
// })

$("#cancel-password").on("click", function(){
    $("#change-password-form")[0].reset();
})


function checkPasswordMatch() {
    var password = $("#txtNewPassword").val();
    var confirmPassword = $("#txtConfirmPassword").val();
    if (password != confirmPassword){
        $("#empty-password2").show();
    }
    else{
        $("#empty-password2").hide();
    }
}

// let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
// let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
// let weakRegex = new RegExp("^[A-Za-z0-9]{1,8}$");
// let patternPhone = "^[0-9]{10}$";
// let patternMail = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
// function checkPhone(phone){
//     let substrRegex;
//     substrRegex = new RegExp(patternPhone);
//     return substrRegex.test(phone);
// }
// function checkMail(mail){
//     let substrRegex;
//     substrRegex = new RegExp(patternMail);
//     return substrRegex.test(mail);
// }
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

$('input[type="password"]').on("keyup", function(){
    let password = $("#txtNewPassword").val();
    let confirmPassword = $("#txtConfirmPassword").val();
    $(this).parents('.form-group').find('.fv-plugins-message-container').hide();
    let isDisabled = function(){
        let tr = $('input[type="password"]').not(':disabled');
        let result = false;
        tr.each(function(){
            if($(this).val() == '' || $(this).val() == 0 || password != confirmPassword || regimePassword(password) == 4 || regimePassword(password) == 1){
                result = true;
                return true;
            }
        })
        return result;
    }
    if($(this).val() == ''){
        $(this).parents('.form-group').find('.invalid-feedback').show();
        $(this).parents('.form-group').find('.invalid-feedback.class-password').hide();
        $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
        $(this).parents('.form-group').find('.invalid-feedback1').removeClass('bg-danger');
        $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
        $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
        $('.progress-hidden').prop('hidden',true);
    }else{
        $('.progress-hidden').prop('hidden',false);
        $(this).parents('.form-group').find('.invalid-feedback').hide();
        let name = $(this).attr('name');
        if(name == 'password3'){
            if (password != confirmPassword){
                $(this).parents('.form-group').find('.invalid-feedback').show();
            }
        }else if(name=='password2'){
            $(this).parents('.form-group').find('.progress').show();
            if(regimePassword(password) == 1){
                $(this).parents('.form-group').find('.invalid-feedback.short-password').show();
                $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
                $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
                $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
            }else if(regimePassword(password) == 2){
                $(this).parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
                $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
                $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
                // $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
                $(this).parents('.form-group').find('.invalid-feedback.medium-password').show();
            }else if(regimePassword(password) == 3){
                $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
                $(this).parents('.form-group').find('.invalid-feedback3').addClass('bg-success');
                $(this).parents('.form-group').find('.invalid-feedback2').addClass('bg-warning');
                // $(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
                $(this).parents('.form-group').find('.invalid-feedback.strong-password').show();
            }else if(regimePassword(password) == 4){
                $(this).parents('.form-group').find('.invalid-feedback.weak-password').show();
                $(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
                $(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
                $(this).parents('.form-group').find('.invalid-feedback1').addClass('bg-danger');
            }
        }
    }
    // $('button[type="submit"]').prop('disabled',isDisabled());
    $('#save-password').prop('disabled',isDisabled());
})


