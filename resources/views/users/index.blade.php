@extends('main')

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
    <div class="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
        <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <!--begin::Details-->
            <div class="d-flex align-items-center flex-wrap mr-2">
                <!--begin::Title-->
                <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">{{ $title }}</h5>
                <!--end::Title-->
                <!--begin::Separator-->
                <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-5 bg-gray-200"></div>
                <!--end::Separator-->
                <!--begin::Breadcrumb-->
                <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm mt-2 mb-2 mr-5">
                    <li class="breadcrumb-item">
                        <a href="/user" class="text-muted">Quản lý người dùng</a>
                    </li>
                    <li class="breadcrumb-item">
                        <span class="text-muted type-filter">{{ $title }}</span>
                    </li>
                </ul>
                <!--end::Breadcrumb-->
            </div>
            <!--end::Details-->
        </div>
    </div>
    <div class="d-flex flex-column-fluid">
        <div class="container">
            <!--begin::Card-->
            <div class="card card-custom">
                <div class="card-header flex-wrap py-5">
                    <div class="card-title">
                        <h3 class="card-label">Danh sách tài khoản người dùng
                        </h3>
                    </div>
                    @can('create', \App\Models\User::class)
                    <div class="card-toolbar">
                        <a href="{{route('user_create')}}" class="btn btn-primary font-weight-bolder">
                            <span class="svg-icon svg-icon-md">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <rect x="0" y="0" width="24" height="24" />
                                        <circle fill="#000000" cx="9" cy="15" r="6" />
                                        <path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3" />
                                    </g>
                                </svg>
                            </span>Thêm tài khoản
                        </a>
                    </div>
                    @endcan
                </div>
                <div class="card-body">
                    <table class="table table-separate table-head-custom table-checkable" id="users_datatable">
                        <thead>
                        <tr>
                            <th>Thông tin</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Ngày cập nhật</th>
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

    @if (auth()->user()->ldap == 0 && auth()->user()->roles == 0)
    <!-- BEGIN::MODAL SYNC -->
    <div class="modal fade" id="syncUser" tabindex="-1" aria-labelledby="syncUserConfirm" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="syncUserConfirm">Xác nhận cập nhật toàn bộ tài khoản LDAP ?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form method="post" id="sync-confirm">
                    <div class="modal-body">
                        <span>Nhập lại mật khẩu để xác nhận</span>
                        <input type="password" name="password" class="form-control form-control-lg"/>
                        <div class="fv-plugins-message-container">
                            <div class="fv-help-block">
                                <span></span>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button type="button" id="submitSync" class="btn btn-primary">Đồng ý</button>
                </div>
            </div>
        </div>
    </div>
    @endif
    <div class="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Xóa tài khoản người dùng</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <span>Bạn có muốn xóa không?</span>
                    <input type="hidden" id="user-delete-id" name="user-delete-id"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button type="button" id="submitDel" class="btn btn-primary">Đồng ý</button>
                </div>
            </div>
        </div>
    </div>
    <!-- end:MODAL DELETE -->
    <!-- BEGIN::MODAL CHANGE USER STATUS -->
    <div class="modal fade" id="change_user_status" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Thay đổi trạng thái người dùng</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <span>Xác nhận đổi trạng thái của người dùng?</span>
                    <input type="hidden" id="change-status-id" name="status"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  data-dismiss="modal">Hủy</button>
                    <button type="button" id="submitChange" class="btn btn-primary">Đồng ý</button>

                </div>
            </div>
        </div>
    </div>
    <!-- end:MODAL CHANGE USER STATUS -->
@stop
