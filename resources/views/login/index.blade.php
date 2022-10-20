<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />

    <title>{{$title}}</title>

    <meta name="description" content="Login page example" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="canonical" href="https://keenthemes.com/metronic" />

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" />

    <link href="{{asset('assets/css/pages/login/classic/login-4.css')}}" rel="stylesheet" type="text/css" />

    <link href="{{asset('assets/plugins/global/plugins.bundle.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('assets/plugins/custom/prismjs/prismjs.bundle.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('assets/css/style.bundle.css')}}" rel="stylesheet" type="text/css" />

    <link href="{{asset('assets/css/themes/layout/header/base/light.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('assets/css/themes/layout/header/menu/light.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('assets/css/themes/layout/brand/dark.css')}}" rel="stylesheet" type="text/css" />
    <link href="{{asset('assets/css/themes/layout/aside/dark.css')}}" rel="stylesheet" type="text/css" />

    <link rel="shortcut icon" href="{{asset('assets/media/logos/favicon.ico')}}" />
    <link rel="shortcut icon" href="{{asset('img/favicon.ico')}}" />
</head>
<body id="kt_body" class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">

<div class="d-flex flex-column flex-root">
    <!--begin::Login-->
    <div class="login login-4 login-signin-on d-flex flex-row-fluid" id="kt_login">
        <div class="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat" style="background-image: url('{{asset('assets/media/bg/bg-3.jpg')}}');">
            <div class="login-form text-center p-7 position-relative overflow-hidden">
                <!--begin::Login Header-->
                <div class="d-flex flex-center mb-5">
                    <a href="#">
                        <img src="{{asset('img/plott-logo.png')}}" class="max-h-75px" alt="" />
                    </a>
                </div>
                <!--end::Login Header-->
                <!--begin::Login Sign in form-->
                <div class="login-signin">
                    <div class="mb-5">
                    </div>
                    <form class="form" id="kt_login_signin_form" method="post" action="{{ route('exec_login') }}">
                        @csrf()
                        <div class="form-group mb-5">
                            <input class="form-control h-auto form-control-solid py-4 px-8" type="text" placeholder="Tên đăng nhập" name="username" autocomplete="off" />
                        </div>
                        <div class="form-group mb-5">
                            <input class="form-control h-auto form-control-solid py-4 px-8" type="password" placeholder="Mật khẩu" name="password" />

                        </div>
                        <div class="form-group mb-5">
                            <div class="form-group fv-plugins-icon-container">
                                <div class=" mt-3 d-flex flex-wrap justify-content-between align-items-center">
                                    <div >
                                        <label>Chọn ngôn ngữ</label>
                                    </div>
                                    <div class="dropdown">
                                        <!--begin::Toggle-->
                                        <div class="topbar-item" data-toggle="dropdown" data-offset="10px,0px">
                                            <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1">
{{--                                                {if {$smarty.session.language['language']} == 'ja'}--}}
{{--                                                <img class="h-20px w-20px rounded-sm" src="{{asset('assets/media/svg/flags/063-japan.svg')}}" alt="" />--}}
{{--                                                {elseif {$smarty.session.language['language']} == 'en'}--}}
{{--                                                <img class="h-20px w-20px rounded-sm" src="{{asset('assets/media/svg/flags/226-united-states.svg')}}" alt="" />--}}
{{--                                                {else}--}}
                                                <img class="h-20px w-20px rounded-sm" src="{{asset('assets/media/svg/flags/220-vietnam.svg')}}" alt="" />
{{--                                                {/if}--}}
                                            </div>
                                        </div>
                                        <!--end::Toggle-->
                                        <!--begin::Dropdown-->
                                        <div class="dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-sm dropdown-menu-right">
                                            <!--begin::Nav-->
                                            <ul class="navi navi-hover py-4">
                                                <!--begin::Item-->
                                                <li class="navi-item">
                                                    <a href="?lang=vi" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="{{asset('assets/media/svg/flags/220-vietnam.svg')}}" alt="" />
													</span>
                                                        <span class="navi-text">Vietnamese</span>
                                                    </a>
                                                </li>
                                                <li class="navi-item">
                                                    <a href="?lang=ja" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="{{asset('assets/media/svg/flags/063-japan.svg')}}" alt="" />
													</span>
                                                        <span class="navi-text">Japanese</span>
                                                    </a>
                                                </li>
                                                <li class="navi-item">
                                                    <a href="?lang=en" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="{{asset('assets/media/svg/flags/226-united-states.svg')}}" alt="" />
													</span>
                                                        <span class="navi-text">English</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            <!--end::Nav-->
                                        </div>
                                    </div>
                                </div>
                                <div class=" mt-3 d-flex flex-wrap justify-content-between align-items-center">
                                    <div >
                                        <label>Liên kết</label>
                                    </div>
                                    <select name="account-type" style="outline: none; border: none;" class="form-control-solid">
                                        <option value="0">Không liên kết</option>
                                        <option value="1">PLOTT</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                        <button type="submit" id="kt_login_signin_submit" class="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4">Đăng nhập</button>
                        @if ($errors->any())
                            <div class="fv-plugins-message-container">
                                @foreach ($errors->all() as $error)
                                    <div data-field="username" class="fv-help-block">{{ $error }}</div>
                                @endforeach
                            </div>
                        @endif
                    </form>

                </div>
                <!--end::Login Sign in form-->
            </div>
        </div>
    </div>
    <!--end::Login-->
</div>
<script>
    var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1400 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#3699FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#E4E6EF", "dark": "#181C32" }, "light": { "white": "#ffffff", "primary": "#E1F0FF", "secondary": "#EBEDF3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#3F4254", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#EBEDF3", "gray-300": "#E4E6EF", "gray-400": "#D1D3E0", "gray-500": "#B5B5C3", "gray-600": "#7E8299", "gray-700": "#5E6278", "gray-800": "#3F4254", "gray-900": "#181C32" } }, "font-family": "Poppins" };
</script>
<!--end::Global Config-->
<!--begin::Global Theme Bundle(used by all pages)-->
<script src="{{asset('assets/plugins/global/plugins.bundle.js')}}"></script>
<script src="{{asset('assets/plugins/custom/prismjs/prismjs.bundle.js')}}"></script>
<script src="{{asset('assets/js/scripts.bundle.js')}}"></script>
<!--end::Global Theme Bundle-->
<!--begin::Page Scripts(used by this page)-->
<script src="{{asset('assets/js/pages/custom/login/login-custom.js')}}"></script>
<!--end::Page Scripts-->
@if ($errors->any())
    <script>
        const Errors = "Không thành công";
        $.notify(Errors, {type: "danger"});
    </script>
@endif
</body>
</html>
