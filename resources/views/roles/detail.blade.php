@extends('main')

@section('content')
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
    <div id="kt_app_content_container" class="app-container container-xxl">
        <!--begin::Layout-->
        <div class="d-flex flex-column flex-lg-row">
            <!--begin::Sidebar-->
            <div class="flex-column flex-lg-row-auto w-100 w-lg-200px w-xl-300px mb-10">
                <!--begin::Card-->
                <div class="card card-flush">
                    <!--begin::Card header-->
                    <div class="card-header">
                        <!--begin::Card title-->
                        <div class="card-title">
                            <h2 class="mb-0">{{ $role_detail["name"] }}</h2>
                        </div>
                        <!--end::Card title-->
                    </div>
                    <!--end::Card header-->
                    <!--begin::Card footer-->
                    @can('update', $role_model)
                    <div class="card-footer pt-0">
                        <button type="button" class="btn btn-light btn-active-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_update_role">Chỉnh sửa</button>
                    </div>
                    @endcan
                    <!--end::Card footer-->
                </div>
                <!--end::Card-->
                <!--begin::Modal-->
                <!--begin::Modal - Chỉnh sửa-->
                <div class="modal fade" id="kt_modal_update_role" tabindex="-1" aria-hidden="true">
                    <!--begin::Modal dialog-->
                    <div class="modal-dialog modal-dialog-centered mw-750px">
                        <!--begin::Modal content-->
                        <div class="modal-content">
                            <!--begin::Modal header-->
                            <div class="modal-header">
                                <!--begin::Modal title-->
                                <h2 class="fw-bold">Cập nhật quyền</h2>
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
                            <div class="modal-body scroll-y mx-5 my-7">
                                <!--begin::Form-->
                                <form id="kt_modal_update_role_form" class="form fv-plugins-bootstrap5 fv-plugins-framework" action="#">
                                    @csrf
                                    <!--begin::Scroll-->
                                    <div class="d-flex flex-column scroll-y me-n7 pe-7" id="kt_modal_update_role_scroll" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_modal_update_role_header" data-kt-scroll-wrappers="#kt_modal_update_role_scroll" data-kt-scroll-offset="300px" style="max-height: 406px;">
                                        <!--begin::Input group-->
                                        <div class="fv-row mb-10 fv-plugins-icon-container">
                                            <!--begin::Label-->
                                            <label class="fs-5 fw-bold form-label mb-2">
                                                <span class="required">Tên</span>
                                            </label>
                                            <!--end::Label-->
                                            <!--begin::Input-->
                                            <input class="form-control form-control-solid" placeholder="Enter a role name" name="name" value="{{$role_detail['name']}}">
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
                                                            <label class="form-check form-check-sm form-check-custom form-check-solid me-9">
                                                                <input class="form-check-input" type="checkbox" value="" id="select-all-permission">
                                                                <input type="hidden" name="id" id="role_id" value="{{ $role_detail['id'] }}">
                                                                <span class="form-check-label" for="kt_roles_select_all">Chọn tất cả</span>
                                                            </label>
                                                            <!--end::Checkbox-->
                                                        </td>
                                                    </tr>
                                                    <!--end::Table row-->
                                                    <!--begin::Table row-->
                                                        @foreach ($role_permission_array as $role_permission_arr_key=>$role_permission_arr_value)
                                                        <tr>
                                                            <!--begin::Label-->
                                                            <td class="text-gray-800">{{ $role_permission_arr_value }}</td>
                                                            <!--end::Label-->
                                                            <!--begin::Input group-->
                                                            <td>
                                                                <!--begin::Wrapper-->
                                                                <div class="d-flex">
                                                                    <!--begin::Checkbox-->
                                                                    <label class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20">
                                                                        <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$role_permission_arr_key}}][view]" {{ isset($role_permission_detail->$role_permission_arr_key->view) ? (($role_permission_detail->$role_permission_arr_key->view == '1')?'checked':'') : "" }}>
                                                                        <span class="form-check-label">Xem</span>
                                                                    </label>
                                                                    <!--begin::Checkbox-->
                                                                    <label class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20">
                                                                        <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$role_permission_arr_key}}][add]" {{ isset($role_permission_detail->$role_permission_arr_key->add) ? (($role_permission_detail->$role_permission_arr_key->add == '1')?'checked':'') : "" }}>
                                                                        <span class="form-check-label">Thêm</span>
                                                                    </label>
                                                                    <!--end::Checkbox-->
                                                                    <!--begin::Checkbox-->
                                                                    <label class="form-check form-check-custom form-check-solid me-5 me-lg-20">
                                                                        <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$role_permission_arr_key}}][delete]" {{ isset($role_permission_detail->$role_permission_arr_key->delete) ? (($role_permission_detail->$role_permission_arr_key->delete == '1')?'checked':'') : "" }}>
                                                                        <span class="form-check-label">Xóa</span>
                                                                    </label>
                                                                    <!--end::Checkbox-->
                                                                    <!--begin::Checkbox-->
                                                                    <label class="form-check form-check-custom form-check-solid">
                                                                        <input class="form-check-input permission" type="checkbox" value="1" name="role_permission[{{$role_permission_arr_key}}][edit]" {{ isset($role_permission_detail->$role_permission_arr_key->edit) ? (($role_permission_detail->$role_permission_arr_key->edit == '1')?'checked':'') : "" }}>
                                                                        <span class="form-check-label">Sửa</span>
                                                                    </label>
                                                                    <!--end::Checkbox-->
                                                                </div>
                                                                <!--end::Wrapper-->
                                                            </td>
                                                            <!--end::Input group-->
                                                        </tr>
                                                        @endforeach
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
                <!--end::Modal - Chỉnh sửa-->
                <!--end::Modal-->
            </div>
            <!--end::Sidebar-->
            <!--begin::Content-->
            <div class="flex-lg-row-fluid ms-lg-10">
                <!--begin::Card-->
                <div class="card card-flush mb-6 mb-xl-9">
                    <!--begin::Card header-->
                    <div class="card-header pt-5">
                        <!--begin::Card title-->
                        <div class="card-title">
                            <h2 class="d-flex align-items-center">Tài khoản
                                <span class="text-gray-600 fs-6 ms-1">({{count($role_user_list)}})</span></h2>
                        </div>
                        <!--end::Card title-->
                        <!--begin::Card toolbar-->
                        <!--end::Card toolbar-->
                    </div>
                    <!--end::Card header-->
                    <!--begin::Card body-->
                    <div class="card-body pt-0">
                        <!--begin::Table-->
                        <div id="kt_roles_view_table_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer"><div class="table-responsive"><table class="table align-middle table-row-dashed fs-6 gy-5 mb-0 dataTable no-footer" id="kt_roles_view_table">
                                    <!--begin::Table head-->
                                    <thead>
                                    <!--begin::Table row-->
                                    <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                        <th class="min-w-50px sorting" tabindex="0" aria-controls="kt_roles_view_table" rowspan="1" colspan="1" aria-label="ID: activate to sort column ascending" style="width: 87.3281px;">STT</th>
                                        <th class="min-w-150px sorting" tabindex="0" aria-controls="kt_roles_view_table" rowspan="1" colspan="1" aria-label="User: activate to sort column ascending" style="width: 322.641px;">Thông tin tài khoản</th>
                                        <th class="min-w-125px sorting" tabindex="0" aria-controls="kt_roles_view_table" rowspan="1" colspan="1" aria-label="Joined Date: activate to sort column ascending" style="width: 238.875px;">Ngày tạo</th>
                                        <th class="text-end min-w-100px sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 144.766px;">Thao tác</th>
                                    </tr>
                                    <!--end::Table row-->
                                    </thead>
                                    <!--end::Table head-->
                                    <!--begin::Table body-->
                                    <tbody class="fw-semibold text-gray-600">
                                    @if (count($role_user_list) == 0)
                                    <tr>
                                        <td colspan="4" style="text-align: center">Không có dữ liệu</td>
                                    </tr>
                                    @else
                                        @foreach ($role_user_list as $user_key => $user_value)
                                        <tr class="odd">
                                            <!--begin::ID-->
                                            <td>{{ $user_key }}</td>
                                            <!--begin::ID-->
                                            <!--begin::User=-->
                                            <td class="d-flex align-items-center">
                                                <!--begin:: Avatar -->
                                                <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                                                    <a href="/user/edit/{{ $user_value['id'] }}">
                                                        <div class="symbol-label">
                                                            <img src="{{ asset('storage/avatar/'.$user_value['avatar']) }}" alt="Emma Smith" class="w-100">
                                                        </div>
                                                    </a>
                                                </div>
                                                <!--end::Avatar-->
                                                <!--begin::User details-->
                                                <div class="d-flex flex-column">
                                                    <a href="/user/edit/{{$user_value['id']}}" class="text-gray-800 text-hover-primary mb-1">{{$user_value['name']}}</a>
                                                    <span>{{$user_value['email']}}</span>
                                                </div>
                                                <!--begin::User details-->
                                            </td>
                                            <!--end::user=-->
                                            <!--begin::Joined date=-->
                                            <td data-order="2022-10-25T20:43:00+07:00">{{$user_value['create_at']}}</td>
                                            <!--end::Joined date=-->
                                            <!--begin::Action=-->
                                            <td class="text-end">
                                                <a href="#" class="btn btn-sm btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">Actions
                                                    <!--begin::Svg Icon | path: icons/duotune/arrows/arr072.svg-->
                                                    <span class="svg-icon svg-icon-5 m-0">
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor"></path>
                                                                            </svg>
                                                                        </span>
                                                    <!--end::Svg Icon--></a>
                                                <!--begin::Menu-->
                                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
                                                    <!--begin::Menu item-->
                                                    <div class="menu-item px-3">
                                                        <a href="../../demo1/dist/apps/user-management/users/view.html" class="menu-link px-3">View</a>
                                                    </div>
                                                    <!--end::Menu item-->
                                                    <!--begin::Menu item-->
                                                    <div class="menu-item px-3">
                                                        <a href="#" class="menu-link px-3" data-kt-roles-table-filter="delete_row">Delete</a>
                                                    </div>
                                                    <!--end::Menu item-->
                                                </div>
                                                <!--end::Menu-->
                                            </td>
                                            <!--end::Action=-->
                                        </tr>
                                        @endforeach
                                    @endif
                                    </tbody>
                                    <!--end::Table body-->
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"></div>
                                <div class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                                    <div class="dataTables_paginate paging_simple_numbers" id="kt_roles_view_table_paginate">
                                        <ul class="pagination">
                                            <li class="paginate_button page-item previous disabled" id="kt_roles_view_table_previous">
                                                <a href="#" aria-controls="kt_roles_view_table" data-dt-idx="0" tabindex="0" class="page-link"><i class="previous"></i>
                                                </a>
                                            </li>
                                            <li class="paginate_button page-item active"><a href="#" aria-controls="kt_roles_view_table" data-dt-idx="1" tabindex="0" class="page-link">1</a>
                                            </li>
                                            <li class="paginate_button page-item "><a href="#" aria-controls="kt_roles_view_table" data-dt-idx="2" tabindex="0" class="page-link">2</a>
                                            </li>
                                            <li class="paginate_button page-item "><a href="#" aria-controls="kt_roles_view_table" data-dt-idx="3" tabindex="0" class="page-link">3</a>
                                            </li>
                                            <li class="paginate_button page-item next" id="kt_roles_view_table_next">
                                                <a href="#" aria-controls="kt_roles_view_table" data-dt-idx="4" tabindex="0" class="page-link"><i class="next"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--end::Table-->
                    </div>
                    <!--end::Card body-->
                </div>
                <!--end::Card-->
            </div>
            <!--end::Content-->
        </div>
        <!--end::Layout-->
    </div>
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $('#select-all-permission').change(function () {
            if ($("#select-all-permission").is(':checked')) {
                $(".permission").prop('checked', true);
            }
            else {
                $(".permission").prop('checked', false);
            }
        });
        $("#kt_modal_update_role_form").submit(function(e) {
            var exec_url ="";
            exec_url = "{{ route('role_update') }}";

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
                    console.log(data);
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
    </script>
@stop
