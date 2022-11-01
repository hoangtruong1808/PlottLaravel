"use strict";
let info = " _TOTAL_ "+arrLanguage['account']+arrLanguage['out_of']+" _START_ "+arrLanguage['to']+" _END_ "+' '+arrLanguage['show'];
let info_empty = " 0 "+arrLanguage['account']+arrLanguage['out_of']+" 0 "+arrLanguage['to']+" 0 "+' '+arrLanguage['show'];
let infoFiltered = "( "+" _MAX_ "+arrLanguage['adverbs']+" "+arrLanguage['account']+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['found']+")";
// var baseURL = "http://192.168.20.27/cong/public/";

 info = arrLanguage['show']+" _START_ "+arrLanguage['to']+" _END_ "+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['account'];
info_empty = arrLanguage['show']+" 0 "+arrLanguage['to']+" 0 "+arrLanguage['out_of']+" 0 "+arrLanguage['account'];
infoFiltered = "( "+arrLanguage['found']+" _TOTAL_ "+arrLanguage['out_of']+" _MAX_ "+arrLanguage['account']+")";
var baseURL = '/';

var KTDatatablesAdvancedColumnRendering = function () {
var stt = 1;
    var init = function () {
        var table = $('#users_datatable');
// begin first table
        table.DataTable({
            ajax: function (data, callback, settings) {
                $.ajax({
                    url: '/user/get-all-json',
                    dataType: 'json',
                    dataSrc: '',
                    success: function (data) {
                        const data_format = {"data": data}
                        callback(data_format);
                    }
                });
            },
            columns: [
                // {data: null},
                {data: null},
                {data: "email"},
                {data: "phone"},
                {data: null},
                {data: "create_at"},
                {data: "update_at"},
                {data: null},
            ],
            responsive: true,
            paging: true,
            order: [[0, 'asc']],
            language: {
                lengthMenu: arrLanguage['show']+" _MENU_ "+arrLanguage['account'],
                search: arrLanguage['search'],
                emptyTable: arrLanguage['no_data'],
                info: info,
                infoFiltered: infoFiltered,
                zeroRecords: arrLanguage['no_matching'],
                infoEmpty: info_empty,
                LoadingRecords: arrLanguage['loading']+"...",
            },
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row) {
                        // console.log(data);
                        // console.log(full);
                        // var number = KTUtil.getRandomInt(1, 14);
                        var user_img = data.avatar;

                        var output;
                        output = `
                                <div class="d-flex align-items-center">
                                    <div class="symbol symbol-50 flex-shrink-0">
                                        <img style="width:35px; height: 40px; object-fit: cover; " src="` +  `/storage/avatar/` + user_img + `" alt="photo">
                                    </div>
                                    <div class="ml-3">
                                        <a href="` + baseURL + `user/edit/` + data.id + `" class="text-dark-75 font-weight-bold line-height-sm d-block pb-2">` + data.fullname + `</a>
                                        <span href="#" class="text-muted text-hover-primary">` + data.username + `</span>
                                    </div>
                                </div>`;

                        return output;
                    },
                },
                {
                    targets: -1,
                    // title: 'f',
                    orderable: false,
                    render: function (data, type, row) {
                        if(data.id != 150){
                            let html =  '\
                                <a href="' + baseURL + 'user/edit/'+ data.id +'" class="btn btn-sm btn-clean btn-icon btn-noti"  data-toggle="tooltip"  data-placement="top" title="'+arrLanguage['edit']+'">\
                                    <i class="la la-edit"></i>\
                                </a>\ ';

                            if(data.ldap != 1){
                                html += '<button onclick="deleteUser(' + data.id +')" class="btn btn-sm btn-clean btn-icon btn-noti" data-toggle="tooltip"  data-placement="top"  title="'+arrLanguage['delete']+'">\
                                    <i class="la la-trash"></i>\
                                </button>\ ';
                            }else{
                                html += '\
                                <a href="' + baseURL + 'admin/users/employee/'+ data.id +'" class="btn btn-sm btn-clean btn-icon btn-noti"  data-toggle="tooltip"  data-placement="top" title="'+arrLanguage['employee_profile']+'">\
                                    <i class="la la-id-card"></i>\
                                </a>\ ';
                            }
                            return html;
                        }else{
                            return '<div></div>';
                        }
                    },
                    className: 'text-center',
                },
                {
                    targets: 3,
                    render: function (data, type, row) {
                        var status = {
                            1: {'title': arrStatus['active'], 'class': ' btn-light-success'},
                            2: {'title': arrStatus['inactive'], 'class': ' btn-light-danger'},
                        };
                        if(data.id == 150){
                            return '<button class="btn' + status[data.status].class + ' btn-sm font-weight-bold status">' + status[data.status].title + '</button>';
                        }
                        return '<button class="btn' + status[data.status].class + ' btn-sm font-weight-bold status" id="' + data.id + '" onclick="changeStatus(this)">' + status[data.status].title + '</button>';
                    },
                    className: 'text-center'
                },
                {
                    targets: [4,5],
                    type: 'date-eu',
                    render: function (data, type, row) {
                        return formatDate(data);
                    },
                    className: 'text-center',
                }
            ],
            search: {
                input: $('#kt_subheader_search_form'),
                delay: 400,
                key: 'generalSearch'
            },
            "drawCallback": function (settings){
                $(".btn-noti").tooltip();
            }
        });
    };

    return {

//main function to initiate the module
        init: function () {
            init();
            // console.log($("button.status"));
        }
    };
}();

$(document).ready(function () {
    KTDatatablesAdvancedColumnRendering.init();
});

function deleteUser(id){
    // console.log(id);
    $("#deleteUser").modal("show");
    $("#user-delete-id").val(id);
}

$("#submitDel").on("click", function(){
    let id = $('input[name="user-delete-id"]').val();
    var delete_url = "/user/destroy/" + id;

    $.ajax({
        url: delete_url,
        dataType: 'json',
        dataSrc: '',
        success: function (data) {
            $("#deleteUser").modal("hide");
            if(data.status == 'success'){
                $.notify('Xóa tài khoản thành công', {type: "success"});
            }else{
                $.notify('Xóa tài khoản thất bại', {type: "danger"});
            }

           return $('#users_datatable').DataTable().ajax.reload();
        }
    });
});
var element;
function changeStatus(el){
    element = el;
    // console.log(el.id);
    const ADMIN = 150;
    if(element.id != ADMIN){
        $("#change_user_status").modal("show");
        // $("#change-status-id").val(element.id);
        // console.log($("#change-status-id").val(element.id));
    // }else{
    //     $.notify("Loi64", {type: "danger"});
    }
}

$("#submitChange").on("click", function (){
    const change = baseURL + "user/execedit";
    // let id = $('input[name=status]').val();

    $.ajax({
        url: change,
        method: 'post',
        dataType: 'json',
        data: {
            user_id : element.id,
        },
        success: function (data) {
            if(typeof data.success !== 'undefined'){
                if($("#" + element.id ).hasClass("btn-light-danger")){
                    $("#" + element.id ).removeClass("btn-light-danger").addClass("btn-light-success").text(arrStatus['active']);
                }else{
                    $("#" + element.id ).removeClass("btn-light-success").addClass("btn-light-danger").text(arrStatus['inactive']);
                }
                $("#change_user_status").modal("hide");
                // $(element).parent().html(changed_html);
                return $.notify(data.success, {type: "success"});
                // return $('#users_datatable').DataTable().ajax.reload();
            }else{
                    $.notify(data.error, {type: "danger"});
                }
        }
    });
})

function confirmSync(){
    // console.log(id);
    $("#syncUser").modal("show");
    // $("#user-delete-id").val(id);
}

$("input[name=password]").focusout(function(){
    // console.log($(this).val());
    if($(this).val() == ''){
        $('#submitSync').prop('disabled', true);
        $(".fv-help-block span").text(arrLanguage['password_not_empty']);
    }else{
        $(".fv-help-block span").text("");
        $('#submitSync').prop('disabled', false);
    }
})

$('#submitSync').on('click', function(){
    // console.log("ehe");
    $('#sync-confirm').attr('action', baseURL + 'user/sync-users');
    let confirmPassword = $("input[name=password]").val();
    $.ajax({
        url: baseURL + "user/check",
        type: 'post',
        async: false,
        dataType: 'json',
        data : {
            'password' : confirmPassword
        },
        success: function (data) {
            // console.log(data);
            if(data['status'] == true) {
                return $('#sync-confirm').submit();
                // return console.log("ehe");
                // console.log(baseURL + 'user/sync-users');
                // // }else{
                // //     console.log("false");
                // //     // $("#errors").text("Sai mật khẩu");
                // // }
            }
        },
        error: function(data){
            return $(".fv-help-block span").text(arrLanguage['wrong_password']);
        }
    });
})
