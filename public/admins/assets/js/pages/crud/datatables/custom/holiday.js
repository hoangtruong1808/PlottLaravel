"use strict";
let info = " _TOTAL_ "+arrLanguage['holiday']+arrLanguage['out_of']+" _START_ "+arrLanguage['to']+" _END_ "+' '+arrLanguage['show'];
let info_empty = " 0 "+arrLanguage['holiday']+arrLanguage['out_of']+" 0 "+arrLanguage['to']+" 0 "+' '+arrLanguage['show'];
let infoFiltered = "( "+" _MAX_ "+arrLanguage['adverbs']+" "+arrLanguage['holiday']+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['found']+")";
// var baseURL = "http://192.168.20.27/cong/public/";
if(language == 'vi' || language == 'en'){
    info = arrLanguage['show']+" _START_ "+arrLanguage['to']+" _END_ "+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['holiday'];
    info_empty = arrLanguage['show']+" 0 "+arrLanguage['to']+" 0 "+arrLanguage['out_of']+" 0 "+arrLanguage['holiday'];
    infoFiltered = "( "+arrLanguage['found']+" _TOTAL_ "+arrLanguage['out_of']+" _MAX_ "+arrLanguage['holiday']+")";
}
// var baseURL = "http://192.168.20.27/cong/public/";
// var KTDatatablesAdvancedColumnRendering = function () {
//     var stt = 1;
//     var init = function () {
//         var table = $('#holiday_datatable');
// // begin first table
//         table.DataTable({
//             ajax: function (data, callback, settings) {
//                 $.ajax({
//                     url: baseURL + 'holiday/get-all-json',
//                     dataType: 'json',
//                     dataSrc: '',
//                     success: function (data) {
//                         const data_format = {"data": data}
//                         console.log(data);
//                         callback(data_format);
//                     }
//                 });
//             },
//             columns: [
//                 {data: "start"},
//                 {data: "title"},
//                 {data: "description"},
//                 // {data: null},
//             ],
//             responsive: true,
//             paging: true,
//             language: {
//                 lengthMenu: arrLanguage['show']+" _MENU_ "+arrLanguage['holiday'],
//                 search: arrLanguage['search'],
//                 emptyTable: arrLanguage['no_data'],
//                 info: info,
//                 infoFiltered: infoFiltered,
//                 infoEmpty: info_empty,
//                 zeroRecords: arrLanguage['no_data'],
//             },
//             columnDefs: [
//                 {
//                     targets: 0,
//                     render: function(data, type, row){
//                         return formatDate(data);
//                     }
//                 }
//                 // {
//                 //     targets: -1,
//                 //     // title: 'Actions',
//                 //     orderable: false,
//                 //     render: function (data, type, row) {
//                 //         if(data.roles == 0){
//                 //             if(typeof(data.expired) === 'undefined'){
//                 //                 // console.log(new Date(data.date_holiday));
//                 //                 // console.log(new Date());
//                 //                 // return "<div> TRUEEEEEEEEEEEEEEEEEE</div>";
//                 //                 return '\
//                 //                 <a href="' + baseURL + 'holiday/edit/id/'+ data.id_holiday +'" class="btn btn-sm btn-clean btn-icon btn-noti" title="'+arrLanguage['edit']+'">\
//                 //                     <i class="la la-edit"></i>\
//                 //                 </a>\
//                 //                 <button onclick="deleteHoliday(' + data.id_holiday +')" class="btn btn-sm btn-clean btn-icon btn-noti" title="'+arrLanguage['delete']+'">\
//                 //                     <i class="la la-trash"></i>\
//                 //                 </button>\
//                 //                 ';
//                 //             }else{
//                 //                 // console.log(new Date(data.date_holiday));
//                 //                 // return '<div>'+ (new Date(data.date_holiday) <= new Date()) +'</div>';
//                 //                 return '<span></span>';
//                 //             }
//                 //         }else{
//                 //             return '<span></span>';
//                 //         }
//                 //     },
//                 //     className: "text-center"
//                 // },
//
//                 // {
//                 //     targets: 3,
//                 //     render: function (data, type, row) {
//                 //         var status = {
//                 //             0: {'title': 'Không kích hoạt', 'class': ' label-light-danger'},
//                 //             1: {'title': 'Kích hoạt', 'class': ' label-light-success'},
//                 //             2: {'title': 'Đang khóa', 'class': ' label-light-primary'},
//                 //         };
//                 //         return '<span class="label label-lg font-weight-bold' + status[data.status].class + ' label-inline">' + status[data.status].title + '</span>';
//                 //     },
//                 // },
//                 // {
//                 //     targets: 5,
//                 //     render: function (data, type, row) {
//                 //         return data;
//                 //     },
//                 // },
//                 // {
//                 //     targets: 6,
//                 //     render: function (data, type, row) {
//                 //         return data;
//                 //     },
//                 // },
//             ],
//             "drawCallback": function (settings){
//                 // console.log("brooo");
//                 $(".btn-noti").tooltip();
//             }
//             // search: {
//             //     input: $('#kt_subheader_search_form'),
//             //     delay: 400,
//             //     key: 'generalSearch'
//             // },
//             // order: [[1, 'asc']],
//         });
//
//         // table.DataTable().on( 'order.dt search.dt', function () {
//         //     let i = 1;
//         //
//         //     table.DataTable().cells(null, 0, {search:'applied', order:'applied'}).every( function (cell) {
//         //         this.data(i++);
//         //     } );
//         // } ).draw();
// // $('#kt_datatable_search_status').on('change', function() {
// // datatable.search($(this).val().toLowerCase(), 'Status');
// // });
// //
// // $('#kt_datatable_search_type').on('change', function() {
// // datatable.search($(this).val().toLowerCase(), 'Type');
// // });
// //
// // $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();
//     };
//
//     return {
//
// //main function to initiate the module
//         init: function () {
//             init();
//         }
//     };
// }();
//
// jQuery(document).ready(function () {
//     KTDatatablesAdvancedColumnRendering.init();
// });

function deleteHoliday(id){
    $("#deleteHoliday").modal("show");
    $("#holiday-delete-id").val(id);
}

$("#submitDelete").on("click", function(){
    const del = baseURL + "holiday/delete/id/";
    // window.location.href = del + id;
    let id = $('input[name="holiday-delete-id"]').val();
    $.ajax({
        url: del + id,
        dataType: 'json',
        dataSrc: '',
        success: function (data) {
            $("#deleteHoliday").modal("hide");
            if(typeof data.Success !== 'undefined'){
                $.notify(data.Success, {type: "success"});
            }else{
                $.notify(data.Error, {type: "danger"});
            }
            return $('#holiday_datatable').DataTable().ajax.reload();
        }
    });
});

// $('#holiday_datatable').DataTable();