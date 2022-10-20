@extends('main')

@section('content')
    <style>
        .required {
            color:red;
        }
    </style>
    <!--begin::Subheader-->
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
    <!--end::Subheader-->

    <style>
        .image-input .image-input-wrapper {
            width: 200px;
            height: 200px;
        }
    </style>
    <!--begin::Entry-->
    <div class="d-flex flex-column-fluid">
        <!--begin::Container-->
        <div class="container-fluid">
            <!--begin::Card-->
            <div class="card card-custom">
                <form class="form" enctype="multipart/form-data" id="add-user1" method="post">
                    @csrf()
                    @if (isset($code))
                        <input type="hidden" name="id" id="avatar" value="{{$code}}" />
                    @endif
                    <div class="card-body px-0">
                        <div class="container-fluid justify-content-center">
                            <div class="form-group row">
                                <div class="col-lg-3 text-center" style="margin: auto auto;">
                                    <div class="image-input" id="kt_user_add_avatar">
                                        <div class="image-input-wrapper" style="background-image: url({{ (isset($code))?asset('storage/avatar/'.$user['avatar']):asset('files/photo/admin2.jpg')}})"></div>
                                        <label class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="change" data-toggle="tooltip" title="" data-original-title="Thanh đổi ảnh đại diện">
                                            <i class="fa fa-pen icon-sm text-muted"></i>
                                            <input type="file" name="avatar" id="avatar" accept=".png, .jpg, .jpeg" />
                                            <input type="hidden" name="profile_avatar_remove" />
                                        </label>
                                        <span class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow" data-action="cancel" data-toggle="tooltip" title="Cancel avatar" id="cancelUpload">
														<i class="ki ki-bold-close icon-xs text-muted"></i>
													</span>
                                    </div>
                                </div>
                                <div class="col-lg-9">
                                    <div class="form-group row">
                                        <div class="col-lg-4 mb-8">
                                            <label for="username" class="col-form-label">Tên đăng nhập<span class="required"> *</span></label>
                                            <input name="username" id="username" placeholder="Tên đăng nhập" maxlength="20" class="form-control {if isset($errors['username'])}is-invalid{/if}" type="text" value="{{ (isset($code))?$user['username']:"" }}">
                                            <div class="fv-plugins-message-container error-username">
                                                <div class="fv-help-block error-field" id="error-username">
                                                </div>
                                            </div>

                                        </div>

                                        <div class="col-lg-4 mb-8">
                                            <label for="password" class="col-form-label">Mật khẩu<span class="required">{{ (isset($code))?"":" *"}}</span></label>
                                            <input name="password" id="txtNewPassword" placeholder="Mật khẩu" class="form-control" type="password" value="">
                                            <div class=" mt-2 progress progress-hidden" hidden>
                                                <div class="progress-bar class-remove" role="progressbar"  aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                                <div class="invalid-feedback1 class-remove" role="progressbar" style="width: 33%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                                <div class="invalid-feedback2 class-remove" role="progressbar" style="width: 33%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                                <div class="invalid-feedback3 class-remove" role="progressbar" style="width: 34%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>

                                            <div class="invalid-feedback text-warning medium-password class-password">Mật khẩu trung bình</div>
                                            <div class="invalid-feedback text-success strong-password class-password">Mật khẩu mạnh</div>

                                            <div class="fv-plugins-message-container error-password">
                                                <div class="fv-help-block error-field" id="error-password">
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-lg-4 mb-8">
                                            <label for="password2" class="col-form-label">Nhập lại mật khẩu mới<span class="required">{{ (isset($code))?"":" *"}}</span></label>
                                            <input name="password2" id="txtConfirmPassword" placeholder="Nhập lại mật khẩu mới" class="form-control" type="password"  value="">

                                            <div class="fv-plugins-message-container error-password2">
                                                <div class="fv-help-block error-field" id="error-password2">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 mb-8">
                                            <label for="fullname" class="col-form-label">Họ và tên<span class="required"> *</span></label>
                                            <input name="fullname" id="fullname" placeholder="Họ và tên" maxlength="50" class="form-control" type="text"  value="{{ (isset($code))?$user['fullname']:"" }}">
                                                <div class="fv-plugins-message-container error-fullname">
                                                    <div class="fv-help-block error-field" id="error-fullname">
                                                    </div>
                                                </div>
                                        </div>
                                        <div class="col-lg-4 mb-8">
                                            <label for="email" class="col-form-label">Địa chỉ email<span class="required"> *</span></label>
                                            <input name="email" id="email" placeholder="Địa chỉ email" class="form-control {if isset($errors['email'])}is-invalid{/if}" type="text"  value="{{ (isset($code))?$user['email']:"" }}">
                                            <div class="fv-plugins-message-container error-email">
                                                <div class="fv-help-block error-field" id="error-email">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-8">
                                            <label for="phone" class="col-form-label">Số điện thoại<span class="required"> *</span></label>
                                            <input name="phone" id="phone" placeholder="Số điện thoại" maxlength="10" class="form-control" type="text" value="{{ (isset($code))?$user['phone']:"" }}">
                                            <div class="fv-plugins-message-container error-phone">
                                                <div class="fv-help-block error-field" id="error-phone">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-8">
                                            <label class="col-form-label">Trạng thái<span class="required">*</span></label>
                                            <div class="radio-inline">
                                                <label class="radio radio-outline radio-outline-2x radio-primary">
                                                    <input type="radio" name="status" value="1" checked/>
                                                    <span></span>
                                                    Hoạt động
                                                </label>
                                                <label class="radio radio-outline radio-outline-2x radio-primary">
                                                    <input type="radio" name="status" value="2"/>
                                                    <span></span>
                                                    Không hoạt động
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 mb-8">
                                            <label class="col-form-label">Quyền<span class="required">*</span></label>
                                            <div class="checkbox-inline">
                                                <label class="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                    <select class="form-control" name="roles">
                                                        @foreach ($role as $key=>$value)
                                                        <option value="{{ $value['id'] }}">{{ $value['name'] }}</option>
                                                        @endforeach
                                                    </select>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-right">
                        <button type="button" id="cancel-add" class="btn btn-light-primary">Hủy</button>
                        <button type="reset" id="clear-add" class="btn btn-light">Đặt lại</button>
                        <button type="submit" class="btn btn-primary" id="submit-add" data-wizard-type="action-submit">Lưu lại</button>
                    </div>
                </form>
            </div>
            <!--end::Card-->
        </div>
        <!--end: Container -->
    </div>
    <!--end: entry -->
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        let arrErrorMessage = {
            'field_required' : 'Trường này bắt buộc nhập',
            'field_not_valid' : 'Trường này không hợp lệ',
            'error_new_password' : 'Mật khẩu mới và mật khẩu nhập lại không trùng nhau',
            'error_empty_password' : 'Mật khẩu không được để trống',
            'password_short' : 'Mật khẩu quá ngắn',
            'password_weak' : 'Mật khẩu yếu',
            'password_medium' : 'Mật khẩu trung bình',
            'password_strong' : '',

        }
        let uploadErrorImage = 'Ảnh đại diện không đúng định dạng (Kích thước: < 4mb, Loại: "png, jpg, jpeg")';

        $("#cancel-add").on("click", function(){
            window.location.href = '{{ route('user_show') }}';
        });

        $("#add-user1").submit(function(e) {
            var exec_url ="";
            @if (isset($code))
                exec_url = "{{ route('user_update') }}";
            @else
                exec_url = "{{ route('user_store') }}";
            @endif
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
                        $.notify(data.message, {type: "success"});
                        window.location = '{{ route('user_show') }}';
                    }
                    else {
                        $.notify('Không thành công', {type: "danger"});
                    }
                },
                error: function(data){
                    var message_parse = JSON.parse(data.responseText);
                    $.each(message_parse.errors, function(error_key, error_value){
                        $("#error-"+error_key).html(error_value[0]);
                        $("input[name="+error_key+"]").addClass('is-invalid');
                    });
                }
            });
        })
    </script>

    <script src="/js/validate-add-user.js"></script>

@stop
