@extends('main')

@section('content')
    <script src="/scripts/js/jquery.min.js"></script>
    <script src="/bootstrap/js/notify.js"></script>
    <style>
        .border-card{
            border: 1px solid #ebedf3 !important;
        }
        #kt_modal_role {

        }
        .modal-content {
            height: 500px !important;
        }

    </style>
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
                        <a href="/role" class="text-muted">Quản lý quyền</a>
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
                        <h3 class="card-label">Danh sách quyền
                    </div>
                </div>
                <div class="card-body">
                    <div id="kt_app_content_container" class="app-container container-xxl">
                        <!--begin::Row-->
                        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-5 g-xl-9">
                            <!--begin::Col-->
                            @foreach ($role_list as $role)
                            <div class="col-md-4 ">
                                <!--begin::Card-->
                                <div class="card card-flush h-md-100 border-card">
                                    <!--begin::Card header-->
                                    <div class="card-header">
                                        <!--begin::Card title-->
                                        <div class="card-title">
                                            <h2>{{ $role['name'] }}</h2>
                                        </div>
                                        @can('delete', $role_model)
                                        <div class="card-toolbar">
                                            <a class="btn btn-sm btn-color-muted btn-active btn-active-light-primary active px-4 me-1 delete_btn" title="Xóa" style="margin-right: 0px !important;" data-id="{{ $role['id'] }}">
                                                <span class="svg-icon svg-icon-2">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path>
                                                        <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path>
                                                        <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                            </a>
                                        </div>
                                        @endcan
                                        <!--end::Card title-->
                                    </div>
                                    <!--end::Card header-->
                                    <!--begin::Card body-->
                                    <div class="card-body pt-1">
                                        <!--begin::Users-->
                                        <div class="fw-bold text-gray-600 mb-5">Tổng tài khoản: {{ $role['user_count'] }}</div>
                                        <!--end::Users-->
                                        <!--begin::Permissions-->
                                        <!--end::Permissions-->
                                    </div>
                                    <!--end::Card body-->
                                    <!--begin::Card footer-->
                                    <div class="card-footer flex-wrap pt-0">
                                        <a href="{{ route('role_detail', ['role_id' => $role['id']]) }}" class="btn btn-light btn-active-primary my-1 me-2">Xem chi tiết</a>
                                        @can('update', $role_model)
                                        <button type="button"  class="btn btn-light btn-active-light-primary btn-edit-role my-1" data-bs-toggle="modal" data-id={{ $role['id'] }} >Chỉnh sửa</button>
                                        @endcan
                                    </div>
                                    <!--end::Card footer-->
                                </div>
                                <!--end::Card-->
                            </div>
                            @endforeach
                            @can('create', $role_model)
                            <div class="ol-md-4">
                                <!--begin::Card-->
                                <div class="card h-md-100  border-card">
                                    <!--begin::Card body-->
                                    <div class="card-body d-flex flex-center">
                                        <!--begin::Button-->
                                        <button type="button" class="btn btn-clear d-flex flex-column btn-add-role flex-center" data-bs-toggle="modal">
                                            <!--begin::Illustration-->
                                            <!--end::Illustration-->
                                            <!--begin::Label-->

                                            <a class=" btn btn-primary">Thêm quyền mới</a>

                                            <!--end::Label-->
                                        </button>
                                        <!--begin::Button-->
                                    </div>
                                    <!--begin::Card body-->
                                </div>
                                <!--begin::Card-->
                            </div>
                            @endcan
                            <!--begin::Add new card-->
                        </div>
                        <!--end::Row-->
                        <!--begin::Modal - Add role-->
                        <div class="modal fade" id="kt_modal_role" tabindex="-1" aria-hidden="true">
                            <!--begin::Modal dialog-->
                            <div class="modal-dialog modal-dialog-centered mw-750px">
                                <!--begin::Modal content-->
                                <div class="modal-content">
                                    <!--begin::Modal header-->
                                    <div class="modal-header">
                                        <!--begin::Modal title-->
                                        <h2 class="fw-bold title-modal"></h2>
                                        <!--end::Modal title-->
                                        <!--begin::Close-->
                                        <div class="btn btn-icon btn-sm btn-active-icon-primary" data-kt-roles-modal-action="close">
                                            <!--begin::Svg Icon | path: icons/duotune/arrows/arr061.svg-->
                                            <span class="svg-icon svg-icon-1">
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor"></rect>
																<rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor"></rect>
															</svg>
														</span>
                                            <!--end::Svg Icon-->
                                        </div>
                                        <!--end::Close-->
                                    </div>
                                    <!--end::Modal header-->
                                    <!--begin::Modal body-->
                                    <div class="modal-body scroll-y mx-lg-5 my-7">
                                        <!--begin::Form-->
                                        <form id="kt_modal_add_role_form" class="form fv-plugins-bootstrap5 fv-plugins-framework" action="#">
                                            @csrf()
                                            <!--begin::Scroll-->
                                            <div class="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_add_role_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_add_role_header" data-kt-scroll-wrappers="#kt_modal_add_role_scroll" data-kt-scroll-offset="300px" >
                                                <!--begin::Input group-->
                                                <div class="fv-row mb-10 fv-plugins-icon-container">
                                                    <!--begin::Label-->
                                                    <label class="fs-5 fw-bold form-label mb-2">
                                                        <span class="required">Tên</span>
                                                    </label>
                                                    <!--end::Label-->
                                                    <!--begin::Input-->
                                                    <input class="form-control form-control-solid" placeholder="Nhập tên" id="role_name" name="name">
                                                    <input type="hidden" name="id" id="role_id">
                                                    <div class="fv-plugins-message-container error-username">
                                                        <div class="fv-help-block error-field" id="error-name">
                                                        </div>
                                                    </div>
                                                    <!--end::Input-->
                                                    <div class="fv-plugins-message-container invalid-feedback"></div></div>
                                                <!--end::Input group-->
                                                <!--begin::Permissions-->
                                                <div class="fv-row">
                                                    <!--begin::Label-->
                                                    <label class="fs-5 fw-bold form-label mb-2">Cài đặt phân quyền</label>
                                                    <div class="fv-plugins-message-container error-permission">
                                                        <div class="fv-help-block error-field" id="error-role_permission">
                                                        </div>
                                                    </div>
                                                    <!--end::Label-->
                                                    <!--begin::Table wrapper-->
                                                    <div class="table-responsive">
                                                        <!--begin::Table-->
                                                        <table class="table align-middle table-row-dashed fs-6 gy-5">
                                                            <!--begin::Table body-->
                                                            <tbody class="text-gray-600 fw-semibold">
                                                            <!--begin::Table row-->
                                                            <tr>
                                                                <td class="text-gray-800">Quyền admin
                                                                    <i class="fas fa-exclamation-circle ms-1 fs-7" data-bs-toggle="tooltip" aria-label="Allows a full access to the system" data-kt-initialized="1"></i></td>
                                                                <td>
                                                                    <!--begin::Checkbox-->
                                                                    <label class="form-check form-check-custom form-check-solid me-9">
                                                                        <input class="form-check-input" type="checkbox" id="select-all-permission">
                                                                        <span class="form-check-label" for="kt_roles_select_all">Chọn tất cả</span>
                                                                    </label>
                                                                    <!--end::Checkbox-->
                                                                </td>
                                                            </tr>
                                                            <!--end::Table row-->
                                                            <!--begin::Table row-->
                                                            @foreach ($role_permission as $permission_key => $permission_value)
                                                            <tr>
                                                                <!--begin::Label-->
                                                                <td class="text-gray-800">{{ $permission_value }}</td>
                                                                <!--end::Label-->
                                                                <!--begin::Options-->
                                                                <td>
                                                                    <!--begin::Wrapper-->
                                                                    <div class="d-flex">
                                                                        <!--begin::Checkbox-->
                                                                        <label class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20 ">
                                                                            <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$permission_key}}][view]">
                                                                            <span class="form-check-label">Xem</span>
                                                                        </label>
                                                                        <!--begin::Checkbox-->
                                                                        <label class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20 ">
                                                                            <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$permission_key}}][add]">
                                                                            <span class="form-check-label">Thêm</span>
                                                                        </label>
                                                                        <!--end::Checkbox-->
                                                                        <!--begin::Checkbox-->
                                                                        <label class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20 ">
                                                                            <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$permission_key}}][delete]">
                                                                            <span class="form-check-label">Xóa</span>
                                                                        </label>
                                                                        <!--end::Checkbox-->
                                                                        <!--begin::Checkbox-->
                                                                        <label class="form-check form-check-sm form-check-custom form-check-solid ">
                                                                            <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$permission_key}}][edit]">
                                                                            <span class="form-check-label">Sửa</span>
                                                                        </label>
                                                                        <!--end::Checkbox-->
                                                                    </div>
                                                                    <!--end::Wrapper-->
                                                                </td>
                                                                <!--end::Options-->
                                                            </tr>
                                                            @endforeach
                                                            <!--end::Table row-->
                                                            <!--begin::Table row-->
                                                            <!--end::Table row-->
                                                            </tbody>
                                                            <!--end::Table body-->
                                                        </table>
                                                        <!--end::Table-->
                                                    </div>
                                                    <!--end::Table wrapper-->
                                                </div>
                                                <!--end::Permissions-->
                                            </div>
                                            <!--end::Scroll-->
                                            <!--begin::Actions-->
                                            <div class="text-center pt-15">
                                                <button type="reset" class="btn btn-light me-3" data-kt-roles-modal-action="cancel">Discard</button>
                                                <button type="submit" class="btn btn-primary" data-kt-roles-modal-action="submit">
                                                    <span class="indicator-label">Submit</span>
                                                    <span class="indicator-progress">Please wait...
																<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                                </button>
                                            </div>
                                            <!--end::Actions-->
                                            <div></div></form>
                                        <!--end::Form-->
                                    </div>
                                    <!--end::Modal body-->
                                </div>
                                <!--end::Modal content-->
                            </div>
                            <!--end::Modal dialog-->
                        </div>
                        <!--end::Modal - Add role-->

                        <!--end::Modals-->
                    </div>

                </div>
            </div>
        </div>
    </div>
    <script>
        var type;
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $('.btn-edit-role').click(function (){
            type = 'edit';
            $(".error-field").html("");
            $("input:checkbox").prop('checked', false);
            $("input").removeClass('is-invalid');
            $(".title-modal").html('Cập nhật quyền');
            var id = $(this).attr('data-id');

            $.get('role/edit/'+id, function (data) {

                $('#kt_modal_role').modal('show');
                $('#role_name').val(data.name);
                $('#role_id').val(id);

                var permission = JSON.parse(data.permission);

                $.each(permission, function(permission_key, permission_value){
                    $.each(permission_value, function(key, value) {
                        if (value == "1") {
                            var input_name = "role_permission[" + permission_key + "][" + key + "]";
                            $('input[name="' + input_name  +'"]').prop('checked', true);
                        }
                    });
                });

            })
        })

        $('.btn-add-role').click(function (){
            type = 'add';
            $(".error-field").html("");
            $("input").removeClass('is-invalid');
            $(".title-modal").html('Thêm quyền');
            $('#kt_modal_add_role_form').trigger("reset");
            $('#kt_modal_role').modal('show');
        })

        $("#kt_modal_add_role_form").submit(function(e) {
            var exec_url ="";
            if (type == 'add') {
                exec_url = "{{ route('role_store') }}";
            }
            else {
                exec_url = "{{ route('role_update') }}";
            }

            e.preventDefault();
            $(".error-field").html("");
            let formData = new FormData(this);

            $.ajax({
                url: exec_url,
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == 'success') {
                        $('#kt_modal_role').modal('hide');
                        location.reload();
                    }
                    else if (data.status == 'error') {
                        $.each(data.error, function(error_key, error_value){
                            $("#error-"+error_key).html(error_value[0]);
                            $("input[name="+error_key+"]").addClass('is-invalid');

                        });
                    }
                    else {
                        $.notify('Không thành công', {type: "danger"});
                    }
                },
                error: function(data){
                    // var message_parse = JSON.parse(data.responseText);
                    // $.each(message_parse.errors, function(error_key, error_value){
                    //     $("#error-"+error_key).html(error_value[0]);
                    //     $("input[name="+error_key+"]").addClass('is-invalid');
                    // });
                }
            });
        })
        $('#select-all-permission').change(function () {
            if ($("#select-all-permission").is(':checked')) {
                $(".permission").prop('checked', true);
            }
            else {
                $(".permission").prop('checked', false);
            }
        });

        $('.delete_btn').click(function(){
            if(confirm('Bạn có muốn xóa không?')) {
                var role_id = $(this).attr('data-id');
                window.location.href = "/role/destroy/"+role_id;
            }
        })
    </script>
@stop
