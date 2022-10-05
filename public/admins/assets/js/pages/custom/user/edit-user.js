"use strict";

$("#cancel-edit").on("click", function(){
	window.history.go(-1);
});

// $("#reset-edit").on("click", function(){
// 	$("#submit-edit").prop('disabled',isCheckFile || isCheckInput);
// });

var avatar = new KTImageInput('kt_user_edit_avatar');
// let patternFile = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG)$";
// let patternPhone = "^[0-9]{10}$";
// let patternMail = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
// let patternFullname = "(?=^.{4,40}$)^[a-zA-Z-]+\\s[a-zA-Z-]+$";
// let patternFullname = "^[^0-9]{4,}(?:[^0-9]+)?(?: [^0-9]+)?$";
// function checkFullname(fullname){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternFullname);
// 	return substrRegex.test(fullname);
// }
//
// function checkPhone(phone){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternPhone);
// 	return substrRegex.test(phone);
// }
// function checkMail(mail){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternMail);
// 	return substrRegex.test(mail);
// }
// function checkFile(file){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternFile);
// 	return substrRegex.test(file);
// }
let isCheckFile = false;
let isCheckInput = false;

$('#change_avatar').on('change', function() {
	$('#reset-edit').prop('disabled',false);
	let name = this.files[0].name;
	let size = this.files[0].size;
	if(checkFile(name) == false || size > 4195024){
		isCheckFile = true;
		$(this).parents('.form-group').find('.invalid-feedback').show();
	}else{
		isCheckFile = false;
		$(this).parents('.form-group').find('.invalid-feedback').hide();
	}
	$("#submit-edit").prop('disabled',isCheckFile || isCheckInput);
});
$('#cancelUpload').click(function (){
	isCheckFile = false;
	$(this).parents('.form-group').find('.invalid-feedback').hide();
	$("#submit-edit").prop('disabled',isCheckFile || isCheckInput);
});
$('input[name="roles"],input[name="status"]').change(function (){
	$("#submit-edit").prop('disabled',isCheckFile || isCheckInput);
	$('#reset-edit').prop('disabled',false);
});

$('input[name="fullname"],input[name="email"], input[name="phone"]').on("keyup", function(){
	$('#reset-edit').prop('disabled',false);
	$(this).parents('.form-group').find('.fv-help-block').hide();
	let name = $(this).attr('name');
	let phone = $("#phone").val();
	let mail = $("#mail").val();
	let fullname = $('#fullname').val();
	let isDisabled = function(){
		let tr = $(".editable").not(':disabled');
		let result = false;
		tr.each(function(){
			if($(this).val() == '' || $(this).val() == 0 || !checkMail(mail) || !checkPhone(phone) || !checkFullname(fullname) ){
				result = true;
				return true;
			}
		})
		return result;
	}
	isCheckInput = isDisabled();
	$("#submit-edit").prop('disabled',isDisabled() || isCheckFile);
	if($(this).val() == '') {
		$(this).parents('.form-group').find('.invalid-feedback').show();
		$(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
		$(this).parents('.form-group').find('.invalid-feedback.format-phone').hide();
		$(this).parents('.form-group').find('.invalid-feedback.format-mail').hide();
		// $(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
	}else{
		$(this).parents('.form-group').find('.invalid-feedback').hide();
		if(name=='phone'){
			if(!checkPhone(phone)){
				$(this).parents('.form-group').find('.invalid-feedback.format-phone').show();
			}else{
				$(this).parents('.form-group').find('.invalid-feedback.format-phone').hide();
			}
		}else if(name=='email'){
			if(!checkMail(mail)){
				$(this).parents('.form-group').find('.invalid-feedback.format-mail').show();
			}else{
				$(this).parents('.form-group').find('.invalid-feedback.format-mail').hide();
			}
		}else if(name=='fullname'){
			if(!checkFullname(fullname)){
				$(this).parents('.form-group').find('.invalid-feedback.format-fullname').show();
			}else{
				$(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
			}
		}
	}
	// $('input[name="fullname"]').val() == '' ? $(".empty-fullname").show() : $(".empty-fullname, .error-fullname").hide();
	// $('input[name="phone"]').val() == '' ? $(".empty-phone").show() : $(".empty-phone, .error-phone").hide();
	// $('input[name="email"]').val() == '' ? $(".empty-email").show() : $(".empty-email, .error-email").hide();
	// $("#submit-edit").prop('disabled',isDisabled());
	// $('.error-phone').hide();
	// $('.error-fullname').hide();
	// $('.error-email').hide();
// else if(name=='fullname'){
// 		if(!checkFullname(fullname)){
// 			$(this).parents('.form-group').find('.invalid-feedback.format-fullname').show();
// 		}else{
// 			$(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
// 		}
// 	}
})
$('#reset-edit').click(function(){
	setTimeout(() => {
		$('input[name="fullname"],input[name="phone"],input[name="email"]').keyup();
}, "0")
})
// Class definition

// var KTBootstrapMaxlength = function () {
//
// 	// Private functions
// 	var demos = function () {
// 		// minimum setup
// 		$('input[name="phone"]').maxlength({
// 			alwaysShow: true,
// 			threshold: 5,
// 			placement: 'top-right',
// 			warningClass: "label label-danger label-rounded label-inline",
// 			limitReachedClass: "label label-primary label-rounded label-inline"
// 		});
// 		console.log();
//
// 	}
//
// 	return {
// 		// public functions
// 		init: function() {
// 			demos();
// 		}
// 	};
// }();

// jQuery(document).ready(function() {
//
// });

