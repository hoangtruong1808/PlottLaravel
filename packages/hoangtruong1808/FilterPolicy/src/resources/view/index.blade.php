@extends('Policy::main')

@section('content')
    <script>
        let arrStatus ={
            'active':'Hoạt động',
            'inactive':'Không hoạt động',
            'blocked':'Đang khóa',
        }
        let arrLanguage ={
            'show':'Hiển thị',
            'account':'mục',
            'search':'Tìm kiếm',
            'to':'đến',
            'out_of':'trong số',
            'edit':'Thông tin tài khoản',
            'no_matching':'Không có kết quả phù hợp',
            'no_data':'Không có dữ liệu',
            'found':'Tìm thấy',
            'adverbs':'Trạng từ',
            'delete':'Xóa',
            'loading':'Đang tải',
            'wrong_password':'Sai mật khẩu',
            'password_not_empty': 'Mật khẩu không được để trống',
            'employee_profile': 'Hồ sơ nhân viên',
        }
    </script>
    <div class="d-flex flex-column-fluid">
        <div class="container">
            <!--begin::Card-->
            <div class="card card-custom">
                <div class="card-header flex-wrap py-5">
                    <div class="card-title">
                        <h3 class="card-label">Danh sách bộ lọc
                        </h3>
                    </div>
{{--                    @can('create', \App\Models\User::class)--}}
                        <div class="card-toolbar">
                            <a href="{{route('policy_create')}}" class="btn btn-primary font-weight-bolder">
                            <span class="svg-icon svg-icon-md">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="#000000" cx="9" cy="15" r="6" />
                                        <path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3" />
                                    </g>
                                </svg>
                            </span>Thêm mới
                            </a>
                        </div>
{{--                    @endcan--}}
                </div>
                <div class="card-body">
                    <table class="table table-separate table-head-custom table-checkable" id="filter_policy_datatable">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên chính sách</th>
                            <th>Người gửi</th>
                            <th>Quá trình</th>
                            <th>Ưu tiên</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="deletePolicy" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Xóa dữ liệu</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <span>Bạn có muốn xóa không?</span>
                    <input type="hidden" id="policy-delete-id" name="policy-delete-id"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button type="button" id="submitDelPolicy" class="btn btn-primary">Đồng ý</button>
                </div>
            </div>
        </div>
    </div>
    <script>
    <!-- end:MODAL DELETE -->
    "use strict";
    let info = " _TOTAL_ "+arrLanguage['account']+arrLanguage['out_of']+" _START_ "+arrLanguage['to']+" _END_ "+' '+arrLanguage['show'];
    let info_empty = " 0 "+arrLanguage['account']+arrLanguage['out_of']+" 0 "+arrLanguage['to']+" 0 "+' '+arrLanguage['show'];
    let infoFiltered = "( "+" _MAX_ "+arrLanguage['adverbs']+" "+arrLanguage['account']+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['found']+")";
    // var baseURL = "http://192.168.20.27/cong/public/";

    info = arrLanguage['show']+" _START_ "+arrLanguage['to']+" _END_ "+arrLanguage['out_of']+" _TOTAL_ "+arrLanguage['account'];
    info_empty = arrLanguage['show']+" 0 "+arrLanguage['to']+" 0 "+arrLanguage['out_of']+" 0 "+arrLanguage['account'];
    infoFiltered = "( "+arrLanguage['found']+" _TOTAL_ "+arrLanguage['out_of']+" _MAX_ "+arrLanguage['account']+")";
    var baseURL = '/';
    var count_policy = {{$count_policy}};
    var KTDatatablesAdvancedColumnRendering = function () {
        var exec = "";
        var stt = 0;
        var btn_rank = "";
        var init = function () {
        var table = $('#filter_policy_datatable');

        // begin first table
        table.DataTable({
            ajax: function (data, callback, settings) {
            $.ajax(
            {
                url: '/policy/get-all-json',
                dataType: 'json',
                dataSrc: '',
                success: function (data) {
                    const data_format = {"data": data}
                    callback(data_format);
                }
            });
        },
        columns: [
            {data: "rank"},
            {data: "filter_policy_list_name"},
            {data: "from_user"},
            {data: "exec_type"},
            {data: "rank"},
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
                targets: 3,
                render: function (data, type, row) {
                    switch(data) {
                        case 0:
                            exec = "Gửi";
                            break;
                        case 1:
                            exec = "Cấp trên phê duyệt";
                            break;
                        case 2:
                            exec = "Kiểm tra chính sách tiếp theo";
                            break;
                        case 3:
                            exec = "Từ chối";
                            break;
                        default:
                        // code block
                    }
                    return exec;
                }
            },
            {
                targets: 4,
                render: function (data, type, row) {
                    if (data == 1) {
                        btn_rank = "<button class='check_disabled' style='border: none; background: none; cursor: pointer' onClick='funcUpdateRank(`" + row.filter_policy_list_id + "`, "+ '`down`' +")'><img src={{ asset('/img/arrow_under.gif') }}></button>";
                    }
                    else if (data > 1 && data < count_policy) {
                        btn_rank = "<button class='check_disabled' style='border: none; background: none; cursor: pointer' onClick='funcUpdateRank(`" + row.filter_policy_list_id + "`, "+ '`up`' +")'><img src={{ asset('/img/arrow_top.gif') }}></button><button class='check_disabled' style='border: none; background: none; cursor: pointer' onClick='funcUpdateRank(`" + row.filter_policy_list_id + "`, "+ '`down`' +")'><img src={{ asset('/img/arrow_under.gif') }}></button>";
                    }
                    else if (data == count_policy) {
                        btn_rank = "<button class='check_disabled' style='border: none; background: none; cursor: pointer' onClick='funcUpdateRank(`" + row.filter_policy_list_id + "`, "+ '`up`' +")'><img src={{ asset('/img/arrow_top.gif') }}></button>";
                    }
                    return btn_rank;
                },
                className: 'text-center',
            },
        {
            targets: -1,
            // title: 'f',
            orderable: false,
            render: function (data, type, row) {
                let html =  '\
                <a href="' + baseURL + 'policy/edit/'+ data.filter_policy_list_id +'" class="btn btn-sm btn-clean btn-icon btn-noti"  data-toggle="tooltip"  data-placement="top" title="'+arrLanguage['edit']+'">\
                    <i class="la la-edit"></i>\
                </a>\ ';

                html += '<button onclick="deletePolicy(' + data.filter_policy_list_id +')" class="btn btn-sm btn-clean btn-icon btn-noti" data-toggle="tooltip"  data-placement="top"  title="'+arrLanguage['delete']+'">\
                    <i class="la la-trash"></i>\
                </button>\ ';

                return html;

            },
        className: 'text-center',
        },

        {
            targets: [0, 1, 2, 5],
            render: function (data, type, row) {
                return data;
            },
        },

        ],
        search: {
        input: $('#kt_subheader_search_form'),
        delay: 400,
        key: 'generalSearch'
        },
        "drawCallback": function (settings){
            $(".btn-noti").tooltip();
            }
            // order: [[1, 'asc']],
            });
        };

        return {

        //main function to initiate the module
        init: function () {
        init();

        }
        };
    }();

    $(document).ready(function () {
        KTDatatablesAdvancedColumnRendering.init();
    });

    $("#submitDelPolicy").on("click", function(){

        count_policy = count_policy - 1;
        let id = $('input[name="policy-delete-id"]').val();
        var delete_url = "/policy/destroy/" + id;

        $.ajax({
            url: delete_url,
            dataType: 'json',
            dataSrc: '',
            success: function (data) {
                $("#deletePolicy").modal("hide");
                if(data.status == 'success'){
                    $.notify('Xóa bộ lọc thành công', {type: "success"});
                }else{
                    $.notify('Xóa bộ lọc thất bại', {type: "danger"});
                }
                $('#filter_policy_datatable').DataTable().ajax.reload();
            }
        });
    });

    </script>
    <script src="/js/policy.js"></script>
@stop
