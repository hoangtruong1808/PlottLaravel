"use strict";

// avatar.onchange = evt => {
// 	const [file] = avatar.files
// 	if(file){
// 		$(".image-input-wrapper").css('background-image', 'url("' +  URL.createObjectURL(file) + '")');
// 	}
// }

var avatar = new KTImageInput('kt_user_add_avatar');

$(document).ready(function() {
    console.log('abc');
	var _avatar;
	var _formEl;
	$("#kt_form").on("submit", function () {
		console.log("bru");
	});
});

$("#cancel-add").on("click", function(){
	window.history.go(-1);
});
$('#clear-add').click(function(){
	$("#submit-add").prop('disabled',true);
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
// let patternFullname = "^[^0-9]{4,}(?:[^0-9]+)?(?: [^0-9]+)?$";
// let patternUsername = "^[a-zA-Z]{4,}(?:[a-zA-Z0-9]+)?(?:[a-zA-Z0-9]+)?$";
// let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
// let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
// let weakRegex = new RegExp("^[A-Za-z0-9]{1,8}$");
// let patternPhone = "^[0-9]{10}$";
// let patternMail = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
// let patternFile = "[^\\s]+(.*?)\\.(jpg|jpeg|png|JPG|JPEG|PNG)$";
// function checkUsername(username){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternUsername);
// 	return substrRegex.test(username);
// }
// function checkFullname(fullname){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternFullname);
// 	return substrRegex.test(fullname);
// }
// function checkFile(file){
// 	let substrRegex;
// 	substrRegex = new RegExp(patternFile);
// 	return substrRegex.test(file);
// }
let isCheckFile = false;
let isCheckInput = false;
$('#avatar').on('change', function() {
	$('#clear-add').prop('disabled',false);
	let name = this.files[0].name;
	let size = this.files[0].size;
	if(checkFile(name) == false || size > 4195024){
		isCheckFile = true;
		$(this).parents('.form-group').find('.invalid-feedback').show();
	}else{
		isCheckFile = false;
		$(this).parents('.form-group').find('.invalid-feedback').hide();
	}
	$("#submit-add").prop('disabled',isCheckFile ||isCheckInput);
});
$('#cancelUpload').click(function (){
	isCheckFile = false;
	$(this).parents('.form-group').find('.invalid-feedback').hide();
	$("#submit-add").prop('disabled',isCheckInput);
});

function checkPhone(phone){
	let substrRegex;
	substrRegex = new RegExp(patternPhone);
	return substrRegex.test(phone);
}
function checkMail(mail){
	let substrRegex;
	substrRegex = new RegExp(patternMail);
	return substrRegex.test(mail);
}
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

$('input[type="text"], input[type="password"],input[type="email"],input[type="phone"]').on("keyup", function(){
	let password = $("#txtNewPassword").val();
	let phone = $("#phone").val();
	let mail = $("#mail").val();
	let username = $('#username').val();
	let fullname = $('#fullname').val();
	let passwordLength = $("#txtNewPassword").val().length;
	let confirmPassword = $("#txtConfirmPassword").val();
	$(this).parents('.form-group').find('.fv-plugins-message-container').hide();
	let isDisabled = function(){
		let tr = $('input[type="text"], input[type="password"],input[type="email"],input[type="phone"]').not(':disabled');
		let result = false;
		tr.each(function(){
			if($(this).val() == '' || $(this).val() == 0 || password != confirmPassword || regimePassword(password) == 4 || regimePassword(password) == 1 || !checkMail(mail) || !checkPhone(phone) || !checkUsername(username) || !checkFullname(fullname)){
				result = true;
				return true;
			}
		})
		return result;
	}
	isCheckInput = isDisabled();
	if($(this).val() == ''){
		$(this).parents('.form-group').find('.invalid-feedback').show();
		$(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
		$(this).parents('.form-group').find('.invalid-feedback.class-password').hide();
		$(this).parents('.form-group').find('.invalid-feedback.short-password').hide();
		$(this).parents('.form-group').find('.invalid-feedback.format-phone').hide();
		$(this).parents('.form-group').find('.invalid-feedback.format-mail').hide();
		$(this).parents('.form-group').find('.invalid-feedback.format-username').hide();
		$(this).parents('.form-group').find('.invalid-feedback1').removeClass('bg-danger');
		$(this).parents('.form-group').find('.invalid-feedback2').removeClass('bg-warning');
		$(this).parents('.form-group').find('.invalid-feedback3').removeClass('bg-success');
		$('.progress-hidden').prop('hidden',true);
	}else{
		$(this).parents('.form-group').find('.invalid-feedback').hide();
		let name = $(this).attr('name');
		if(name == 'password2'){
			if (password != confirmPassword){
				$(this).parents('.form-group').find('.invalid-feedback').show();
			}
		}else if(name=='password'){
			$('.progress-hidden').prop('hidden',false);
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
		}else if(name=='phone'){
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
		}else if(name=='username'){
			if(!checkUsername(username)){
				$(this).parents('.form-group').find('.invalid-feedback.format-username').show();
			}else{
				$(this).parents('.form-group').find('.invalid-feedback.format-username').hide();
			}
		}else if(name=='fullname'){
			if(!checkFullname(fullname)){
				$(this).parents('.form-group').find('.invalid-feedback.format-fullname').show();
			}else{
				$(this).parents('.form-group').find('.invalid-feedback.format-fullname').hide();
			}
		}
	}
	// let key = $(this)[0].name;
	// if(key == 'password2'){
	// 	if($(this).val() == $('input[name="password"]').val()){
	// 		$(".empty-" + key + ",.error-" + key).hide();
	// 	}else{
	// 		$(".empty-" + key).show();
	// 	}
	// }else{
	// 	$(this).val() == '' ? $(".empty-" + key).show() : $(".empty-" + key + ",.error-" + key).hide();
	// }
	// $('input[name="username"]').val() == '' ? $(".empty-username").show() : $(".empty-username").hide();
	// $('input[name="fullname"]').val() == '' ? $(".empty-fullname").show() : $(".empty-fullname").hide();
	// $('input[name="password"]').val() == '' ? $(".empty-password").show() : $(".empty-password").hide();
	// $('input[name="password2"]').val() == '' ? $(".empty-password2").show() : $(".empty-password2").hide();
	// $('input[name="phone"]').val() == '' ? $(".empty-phone").show() : $(".empty-phone").hide();
	// $('input[name="email"]').val() == '' ? $(".empty-email").show() : $(".empty-email").hide();

	$('button[type="submit"]').prop('disabled',isDisabled() || isCheckFile);
})


// $('input[type="text"], input[name="password"], input[name="password2"]').on("focusout", function(){
// 	let key = $(this)[0].name;
// 	if(key == 'password2'){
// 		if($(this).val() == $('input[name="password"]').val()){
// 			$(".empty-" + key + ",.error-" + key).hide();
// 		}else{
// 			$(".empty-" + key).show();
// 		}
// 	}else{
// 		$(this).val() == '' ? $(".empty-" + key).show() : $(".empty-" + key + ",.error-" + key).hide();
// 	}
// 	// console.log($(thi)
// 	// console.log($(this).)
// })
// $('input[name="username"]').val() == '' ? $(".empty-username").show() : $(".empty-username").hide();
// $('input[name="fullname"]').val() == '' ? $(".empty-fullname").show() : $(".empty-fullname").hide();
// $('input[name="password"]').val() == '' ? $(".empty-password").show() : $(".empty-password").hide();
// $('input[name="password2"]').val() == '' ? $(".empty-password2").show() : $(".empty-password2").hide();
// $('input[name="phone"]').val() == '' ? $(".empty-phone").show() : $(".empty-phone").hide();
// $('input[name="email"]').val() == '' ? $(".empty-email").show() : $(".empty-email").hide();


// Class Definition
// var KTAddUser = function () {
// 	// Private Variables
// 	var _wizardEl;
// 	var _formEl;
// 	var _wizardObj;
// 	var _avatar;
// 	var _validations = [];
//
// 	// Private Functions
// 	var _initWizard = function () {
// 		// Initialize form wizard
// 		_wizardObj = new KTWizard(
// 			// _wizardEl, {
// 			// startStep: 1, // initial active step number
// 			// clickableSteps: false  // allow step clicking
// 		// }
// 		);
//
// 		// Validation before going to next page
// 		// _wizardObj.on('change', function (wizard) {
// 		// 	if (wizard.getStep() > wizard.getNewStep()) {
// 		// 		return; // Skip if stepped back
// 		// 	}
// 		//
// 		// 	// Validate form before change wizard step
// 		// 	var validator = _validations[wizard.getStep() - 1]; // get validator for currnt step
// 		//
// 		// 	if (validator) {
// 		// 		validator.validate().then(function (status) {
// 		// 			if (status == 'Valid') {
// 		// 				wizard.goTo(wizard.getNewStep());
// 		//
// 		// 				KTUtil.scrollTop();
// 		// 			} else {
// 		// 				Swal.fire({
// 		// 					text: "Sorry, looks like there are some errors detected, please try again.",
// 		// 					icon: "error",
// 		// 					buttonsStyling: false,
// 		// 					confirmButtonText: "Ok, got it!",
// 		// 					customClass: {
// 		// 						confirmButton: "btn font-weight-bold btn-light"
// 		// 					}
// 		// 				}).then(function () {
// 		// 					KTUtil.scrollTop();
// 		// 				});
// 		// 			}
// 		// 		});
// 		// 	}
// 		//
// 		// 	return false;  // Do not change wizard step, further action will be handled by he validator
// 		// });
//
// 		// Change event
// 		// _wizardObj.on('changed', function (wizard) {
// 		// 	KTUtil.scrollTop();
// 		// });
//
// 		// Submit event
// 		_wizardObj.on('submit', function (wizard) {
// 			Swal.fire({
// 				text: "All is good! Please confirm the form submission.",
// 				icon: "success",
// 				showCancelButton: true,
// 				buttonsStyling: false,
// 				confirmButtonText: "Yes, submit!",
// 				cancelButtonText: "No, cancel",
// 				customClass: {
// 					confirmButton: "btn font-weight-bold btn-primary",
// 					cancelButton: "btn font-weight-bold btn-default"
// 				}
// 			}).then(function (result) {
// 				if (result.value) {
// 					_formEl.submit(); // Submit form
// 				} else if (result.dismiss === 'cancel') {
// 					Swal.fire({
// 						text: "Your form has not been submitted!.",
// 						icon: "error",
// 						buttonsStyling: false,
// 						confirmButtonText: "Ok, got it!",
// 						customClass: {
// 							confirmButton: "btn font-weight-bold btn-primary",
// 						}
// 					});
// 				}
// 			});
// 		});
// 	}
//
// 	var _initValidations = function () {
// 		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
//
// 		// Validation Rules For Step 1
// 		_validations.push(FormValidation.formValidation(
// 			_formEl,
// 			{
// 				fields: {
// 					username: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Tên tài khoản không được để trống'
// 							}
// 						}
// 					},
// 					fullname: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Họ tên không được để trống'
// 							}
// 						}
// 					},
// 					password: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Mật khẩu không được để trống'
// 							}
// 						}
// 					},
// 					password2: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Mật khẩu không được để trống'
// 							}
// 						}
// 					},
// 					phone: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Điện thoại không được để trống'
// 							},
// 							// phone: {
// 							// 	country: ,
// 							// 	message: 'The value is not a valid US phone number. (e.g 5554443333)'
// 							// }
// 						}
// 					},
// 					email: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Email không được để trống'
// 							},
// 							emailAddress: {
// 								message: 'Email không đúng định dạng'
// 							}
// 						}
// 					},
// 					status: {
// 						validators: {
// 							choice: {
// 								min: 1,
// 								message: 'Phải chọn ít nhất 1 giá trị'
// 							}
// 						}
// 					},
// 					// companywebsite: {
// 					// 	validators: {
// 					// 		notEmpty: {
// 					// 			message: 'Website URL is required'
// 					// 		}
// 					// 	}
// 					// }
// 				},
// 				plugins: {
// 					trigger: new FormValidation.plugins.Trigger(),
// 					// Bootstrap Framework Integration
// 					bootstrap: new FormValidation.plugins.Bootstrap({
// 						//eleInvalidClass: '',
// 						eleValidClass: '',
// 					})
// 				}
// 			}
// 		));
//
// 	}
//
// 	var _initAvatar = function () {
// 		_avatar = new KTImageInput('kt_user_add_avatar');
// 	}
//
// 	return {
// 		// public functions
// 		init: function () {
// 			_wizardEl = KTUtil.getById('kt_wizard');
// 			_formEl = KTUtil.getById('kt_form');
//
// 			_initWizard();
// 			_initValidations();
// 			_initAvatar();
// 		}
// 	};
// }();

// jQuery(document).ready(function () {
// 	KTAddUser.init();
// });


// "use strict";
//
// // Class Definition
// var KTAddUser = function () {
// 	// Private Variables
// 	var _wizardEl;
// 	var _formEl;
// 	var _wizardObj;
// 	var _avatar;
// 	var _validations = [];
//
// 	// Private Functions
// 	var _initWizard = function () {
// 		// Initialize form wizard
// 		_wizardObj = new KTWizard(_wizardEl, {
// 			startStep: 1, // initial active step number
// 			clickableSteps: false  // allow step clicking
// 		});
//
// 		// Validation before going to next page
// 		_wizardObj.on('change', function (wizard) {
// 			if (wizard.getStep() > wizard.getNewStep()) {
// 				return; // Skip if stepped back
// 			}
//
// 			// Validate form before change wizard step
// 			var validator = _validations[wizard.getStep() - 1]; // get validator for currnt step
//
// 			if (validator) {
// 				validator.validate().then(function (status) {
// 					if (status == 'Valid') {
// 						wizard.goTo(wizard.getNewStep());
//
// 						KTUtil.scrollTop();
// 					} else {
// 						Swal.fire({
// 							text: "Sorry, looks like there are some errors detected, please try again.",
// 							icon: "error",
// 							buttonsStyling: false,
// 							confirmButtonText: "Ok, got it!",
// 							customClass: {
// 								confirmButton: "btn font-weight-bold btn-light"
// 							}
// 						}).then(function () {
// 							KTUtil.scrollTop();
// 						});
// 					}
// 				});
// 			}
//
// 			return false;  // Do not change wizard step, further action will be handled by he validator
// 		});
//
// 		// Change event
// 		_wizardObj.on('changed', function (wizard) {
// 			KTUtil.scrollTop();
// 		});
//
// 		// Submit event
// 		_wizardObj.on('submit', function (wizard) {
// 			Swal.fire({
// 				text: "All is good! Please confirm the form submission.",
// 				icon: "success",
// 				showCancelButton: true,
// 				buttonsStyling: false,
// 				confirmButtonText: "Yes, submit!",
// 				cancelButtonText: "No, cancel",
// 				customClass: {
// 					confirmButton: "btn font-weight-bold btn-primary",
// 					cancelButton: "btn font-weight-bold btn-default"
// 				}
// 			}).then(function (result) {
// 				if (result.value) {
// 					_formEl.submit(); // Submit form
// 				} else if (result.dismiss === 'cancel') {
// 					Swal.fire({
// 						text: "Your form has not been submitted!.",
// 						icon: "error",
// 						buttonsStyling: false,
// 						confirmButtonText: "Ok, got it!",
// 						customClass: {
// 							confirmButton: "btn font-weight-bold btn-primary",
// 						}
// 					});
// 				}
// 			});
// 		});
// 	}
//
// 	var _initValidations = function () {
// 		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
//
// 		// Validation Rules For Step 1
// 		_validations.push(FormValidation.formValidation(
// 			_formEl,
// 			{
// 				fields: {
// 					firstname: {
// 						validators: {
// 							notEmpty: {
// 								message: 'First Name is required'
// 							}
// 						}
// 					},
// 					lastname: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Last Name is required'
// 							}
// 						}
// 					},
// 					companyname: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Company Name is required'
// 							}
// 						}
// 					},
// 					phone: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Phone is required'
// 							},
// 							phone: {
// 								country: 'US',
// 								message: 'The value is not a valid US phone number. (e.g 5554443333)'
// 							}
// 						}
// 					},
// 					email: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Email is required'
// 							},
// 							emailAddress: {
// 								message: 'The value is not a valid email address'
// 							}
// 						}
// 					},
// 					companywebsite: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Website URL is required'
// 							}
// 						}
// 					}
// 				},
// 				plugins: {
// 					trigger: new FormValidation.plugins.Trigger(),
// 					// Bootstrap Framework Integration
// 					bootstrap: new FormValidation.plugins.Bootstrap({
// 						//eleInvalidClass: '',
// 						eleValidClass: '',
// 					})
// 				}
// 			}
// 		));
//
// 		_validations.push(FormValidation.formValidation(
// 			_formEl,
// 			{
// 				fields: {
// 					// Step 2
// 					communication: {
// 						validators: {
// 							choice: {
// 								min: 1,
// 								message: 'Please select at least 1 option'
// 							}
// 						}
// 					},
// 					language: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Please select a language'
// 							}
// 						}
// 					},
// 					timezone: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Please select a timezone'
// 							}
// 						}
// 					}
// 				},
// 				plugins: {
// 					trigger: new FormValidation.plugins.Trigger(),
// 					// Bootstrap Framework Integration
// 					bootstrap: new FormValidation.plugins.Bootstrap({
// 						//eleInvalidClass: '',
// 						eleValidClass: '',
// 					})
// 				}
// 			}
// 		));
//
// 		_validations.push(FormValidation.formValidation(
// 			_formEl,
// 			{
// 				fields: {
// 					address1: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Address is required'
// 							}
// 						}
// 					},
// 					postcode: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Postcode is required'
// 							}
// 						}
// 					},
// 					city: {
// 						validators: {
// 							notEmpty: {
// 								message: 'City is required'
// 							}
// 						}
// 					},
// 					state: {
// 						validators: {
// 							notEmpty: {
// 								message: 'state is required'
// 							}
// 						}
// 					},
// 					country: {
// 						validators: {
// 							notEmpty: {
// 								message: 'Country is required'
// 							}
// 						}
// 					},
// 				},
// 				plugins: {
// 					trigger: new FormValidation.plugins.Trigger(),
// 					// Bootstrap Framework Integration
// 					bootstrap: new FormValidation.plugins.Bootstrap({
// 						//eleInvalidClass: '',
// 						eleValidClass: '',
// 					})
// 				}
// 			}
// 		));
// 	}
//
// 	var _initAvatar = function () {
// 		_avatar = new KTImageInput('kt_user_add_avatar');
// 	}
//
// 	return {
// 		// public functions
// 		init: function () {
// 			_wizardEl = KTUtil.getById('kt_wizard');
// 			_formEl = KTUtil.getById('kt_form');
//
// 			_initWizard();
// 			_initValidations();
// 			_initAvatar();
// 		}
// 	};
// }();
//
// jQuery(document).ready(function () {
// 	KTAddUser.init();
// });
