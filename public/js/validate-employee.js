// //Check disabled
// function isDisabled(input,requirement){
//     let result = false;
//     input.each(function (){
//        if(requirement){
//            result = true;
//            return true;
//        }
//        return result;
//     });
// }
// function showInputMessage(result,name){
//     result == false? $(`input[name="${name}"]`).parents('.col-8').find('.invalid-feedback').show(): $(`input[name="${name}"]`).parents('.col-8').find('.invalid-feedback').hide();
// }
// function showSelectMessage(result,name){
//     result == false? $(`select[name="${name}"]`).parents('.col-8').find('.invalid-feedback').show(): $(`select[name="${name}"]`).parents('.col-8').find('.invalid-feedback').hide();
// }
let patternFullname = "^[^0-9]{4,}(?:[^0-9]+)?(?: [^0-9]+)?$";
let patternDate = "^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$";
let patternIdentity = "^[0-9]{9,12}$";
// function check(val,pattern){
//     let substrRegex;
//     substrRegex = new RegExp(pattern);
//     return substrRegex.test(val);
// }
// function checkGender(val){
//     return arr_gender.includes(val);
// }
//
// $('input').on('keyup',function (){
//     let name = $(this).attr('name');
//     let val = $(this).val();
//     if(name == '[full-name]' || name== '[nationality]'){
//         let result = check(val,patternFullname);
//         showInputMessage(result,name);
//     }
//     if(name== '[date-of-birth]' || name== '[registered-date]'){
//         let date = moment(val).format('DD/MM/YYYY');
//         let result = check(date,patternDate);
//         showInputMessage(result,name);
//     }
//     if(name== '[identity-no]'){
//         let result = check(val,patternIdentity);
//         showInputMessage(result,name);
//     }
//
// });
// $('select').on('change',function(){
//     let name = $(this).attr('name');
//     let val = $(this).val();
//     if(name == '[gender]'){
//         let result = checkGender(val);
//         showSelectMessage(result,name);
//     }
// });
// console.log(moment('12-12-2020').diff(moment('12-12-2019'),'months'));

// document.addEventListener('DOMContentLoaded', function (e) {
//     const strongPassword = function () {
//         return {
//             validate: function (input) {
//                 const value = input.value;
//                 if (value === '') {
//                     return {
//                         valid: true,
//                     };
//                 }
//
//                 // Check the password strength
//                 if (value.length < 8) {
//                     return {
//                         valid: false,
//                         message: 'The password must be more than 8 characters long',
//                     };
//                 }
//
//                 // The password doesn't contain any uppercase character
//                 if (value === value.toLowerCase()) {
//                     return {
//                         valid: false,
//                         message: 'The password must contain at least one upper case character',
//                     };
//                 }
//
//                 // The password doesn't contain any uppercase character
//                 if (value === value.toUpperCase()) {
//                     return {
//                         valid: false,
//                         message: 'The password must contain at least one lower case character',
//                     };
//                 }
//
//                 // The password doesn't contain any digit
//                 if (value.search(/[0-9]/) < 0) {
//                     return {
//                         valid: false,
//                         message: 'The password must contain at least one digit',
//                     };
//                 }
//
//                 return {
//                     valid: true,
//                 };
//             },
//         };
//     };
//
//     FormValidation.formValidation(
//         document.getElementById('kt-form-profile'),
//         {
//             fields: {
//                 '[nationality]': {
//                     validators: {
//                         notEmpty: {
//                             message: 'Email is required'
//                         },
//                         callback: {
//                             message: 'Giờ BẮT ĐẦU phải là 8:00 hoặc 13:00',
//                             callback: function (input) {
//                                 if (input.value == 'cong'){
//                                     return false;
//                                 }
//                             },
//                         },
//
//                     }
//                 },
//
//             },
//
//             plugins: {
//                 trigger: new FormValidation.plugins.Trigger(),
//                 // Bootstrap Framework Integration
//                 bootstrap: new FormValidation.plugins.Bootstrap({
//                     eleInvalidClass: '',
//                     eleValidClass: '',
//                 }),
//                 // Validate fields when clicking the Submit button
//                 submitButton: new FormValidation.plugins.SubmitButton(),
//                 // // Submit the form when all fields are valid
//                 defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
//             }
//         }
//     );
// });

