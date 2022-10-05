// // Class definition
// function getYear(date){
//     if(date == ''){
//         return '';
//     }
//     date = moment(date, "DD/MM/YYYY").toDate();
//     return date.getFullYear();
// }
//
// function getMonth(date){
//     if(date == ''){
//         return '';
//     }
//     date = moment(date, "DD/MM/YYYY").toDate();
//     return ('0' + (date.getMonth())).slice(-2);
//     // return date.getMonth;
// }
//
// function getDate(date){
//     if(date == ''){
//         return '';
//     }
//     date = moment(date, "DD/MM/YYYY").toDate();
//     return ('0' + date.getDate()).slice(-2);
// }
//
// var KTBootstrapDatepicker = function () {
//
//     var arrows;
//     if (KTUtil.isRTL()) {
//         arrows = {
//             leftArrow: '<i class="la la-angle-right"></i>',
//             rightArrow: '<i class="la la-angle-left"></i>'
//         }
//     } else {
//         arrows = {
//             leftArrow: '<i class="la la-angle-left"></i>',
//             rightArrow: '<i class="la la-angle-right"></i>'
//         }
//     }
//
//     // Private functions
//     var demos = function () {
//         // minimum setup
//         $('#change-holiday').datepicker({
//             rtl: KTUtil.isRTL(),
//             todayHighlight: true,
//             orientation: "bottom left",
//             templates: arrows,
//             startDate: new Date(),
//             // defaultDate: new Date(2022,9,3),
//             // setDate: new Date(2022,9,28),
//             // setDate: moment($("#change-holiday").val(), "dd/mm/YYYY").toDate(),
//             // update: new Date(getYear($("#change-holiday").val()), getMonth($("#change-holiday").val()), getDate($("#change-holiday").val())),
//
//             // defaultViewDate: {
//             //     // year: getYear($("#change-holiday").val()) ,
//             //     // month: getMonth($("#change-holiday").val()),
//             //     // day:  getDate($("#change-holiday").val())
//             //     year: 2022,
//             //     month: 6,
//             //     day: 20
//             // },
//             format: 'dd/mm/yyyy',
//         });
//
//         // console.log(getYear($("#change-holiday").val()));
//         // console.log(getMonth($("#change-holiday").val()));
//         // console.log(getDate($("#change-holiday").val()));
//         // console.log(new Date(getYear($("#change-holiday").val()), getMonth($("#change-holiday").val()), getDate($("#change-holiday").val())));
//     }
//
//     return {
//         // public functions
//         init: function() {
//             demos();
//         }
//     };
// }();
//
// jQuery(document).ready(function() {
//     KTBootstrapDatepicker.init();
// });
//
// $("#cancel-edit").on("click", function(){
//     window.history.go(-1);
// });