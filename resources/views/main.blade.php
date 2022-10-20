<!DOCTYPE html>
<html lang="en">
<!--begin::Head-->
<head>
    <base href="">
    <meta charset="utf-8"/>
    <title>{{$title}}</title>
    <meta name="description"
          content="Metronic admin dashboard live demo. Check out all the features of the admin panel. A large number ofdw settings, additional services and widgets."/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <link rel="canonical" href="https://keenthemes.com/metronic"/>
    <style>
        body {
            font-family: 'Montserrat', sans-serif !important;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">

    <!--end::Fonts-->
    <!--begin::Page Vendors Styles(used by index page)-->

    <!--end::Page Vendors Styles-->
    <!-- Begin: Datatables -->
    <!--begin::Page Vendors Styles(used by users, lists page)-->
    <link href="{{asset('/admins/assets/plugins/custom/datatables/datatables.bundle.css')}}" rel="stylesheet" type="text/css" />

    <!--end::Page Vendors Styles-->
    <!-- End:Datatables -->
    <!--begin::Global Theme Styles(used by all pages)-->
    <link href="{{asset('/admins/assets/plugins/global/plugins.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('/admins/assets/plugins/custom/prismjs/prismjs.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <!-- begin: FULLCALENDAR -->
    <link href="{{asset('/admins/assets/css/style.bundle.css')}}" rel="stylesheet" type="text/css"/>

    <!-- END: FULLCALENDAR -->
    <!--end::Global Theme Styles-->
    <!--begin::Layout Themes(used by all pages)-->
    <link href="{{asset('/admins/assets/css/themes/layout/header/base/light.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('/admins/assets/css/themes/layout/header/menu/light.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('/admins/assets/css/themes/layout/brand/dark.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('/admins/assets/css/themes/layout/aside/dark.css')}}" rel="stylesheet" type="text/css"/>

    @if (request()->route()->getControllerClass() == "App\Http\Controllers\RoleController")
        <link href="{{asset('/css/style1.bundle.css')}}" rel="stylesheet" type="text/css"/>
        <script src="{{asset('/js/script1.bundle.js')}}"></script>
    @endif

    <!--end::Layout Themes-->
    <link rel="shortcut icon" href="/img/favicon.ico" />
    <!-- begin: Jquery -->
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="/admins/assets/plugins/global/plugins.bundle.js"></script>
    <!-- end: jquery -->
    <script src="/admins/assets/plugins/custom/prismjs/prismjs.bundle.js"></script>
    <script src="/admins/assets/js/scripts.bundle.js"></script>

    <script src="/admins/assets/plugins/custom/fullcalendar/fullcalendar.bundle.js"></script>

    <!--begin::Page Scripts(used by index page)-->
    <script src="/admins/assets/js/pages/widgets.js"></script>
    <!-- begin: NOTIFY -->
    <!-- end: NOTIFY -->
    <style>
        div.divCalc {
            display: table;
            color: black;
            /*margin: 20px auto;*/
        }

        div.divCalcBody {
            color: black;
            border-radius: 10px;
            /*border: 1px solid #dfe1e5;*/
            padding: 20px;
            background-color: #fff;
        }

        #displayTop,
        #displayMain {
            align-items: center;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            display: flex;
            font-size: 30px;
            font-family: Roboto,
            HelveticaNeue,
            Arial,
            sans-serif;
            justify-content: center;
            margin: 0 auto 7px auto;
            padding: 3px 8px 3px 0;
            text-align: right;
            width: 346px;
        }


        div.divButton {
            display: table-cell;
            padding: 4px;
        }

        .btnRow button,
        .button#point {
            font-size: 14px;
            font-family: inherit;
            border: 0;
            padding: 0;
            border-radius: 4px;
            line-height: 5px;
            width: 80px;
            color: #202124;
            border: 1px solid #dfe1e5;
            /*font-family: Roboto,*/
            /*HelveticaNeue,*/
            /*Arial,*/
            /*sans-serif;*/
            text-align: center;
            background: #f1f3f4;
            padding: 15px;
        }

        .btnRow button:hover {
            background: #e8eaeb;
            border-color: #e8eaeb;
        }

        .btnRow button:focus {
            border-color: #bdc1c6;
        }

        button#equal.equal {
            background: #4285f4;
            color: #fff;
            border: 1px solid #4285f4;
        }

        button#equal.equal:hover {
            background: #4d8bf1;
            border-color: #4d8bf1;
        }

        button#equal.equal:active {
            background: #4d8bf1;
            box-shadow: 0 1px 2px 0 rgba(66, 133, 244, 0.45), 0 3px 6px 2px rgba(66, 133, 244, 0.30);
        }

        .operator,
        .function,
        .modifier {
            background: #dfe1e5;
            color: #202124;
            border: 1px solid #dfe1e5;
            box-sizing: border-box;
        }

        #divide,
        #multiply,
        #subtract,
        #addition,
        #point,
        #equal {
            font-size: 18px;
        }

        #ce,
        #ac {
            font-size: 13;
        }
    </style>

</head>
<body id="kt_body" class="header-fixed header-mobile-fixed subheader-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">
<div id="kt_header_mobile" class="header-mobile align-items-center header-mobile-fixed">
    <div class="d-flex align-items-center">
        <button class="btn p-0 burger-icon ml-4" id="kt_aside_mobile_toggle">
            <span></span>
        </button>
        <button class="btn btn-hover-text-primary p-0 ml-2" id="kt_header_mobile_topbar_toggle">
            <span class="svg-icon svg-icon-xl">
                <!--begin::Svg Icon | path:assets/media/svg/icons/General/User.svg-->
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" />
                        <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero" />
                    </g>
                </svg>
            </span>
        </button>
    </div>
</div>
<div class="d-flex flex-column flex-root">
    <div class="d-flex flex-row flex-column-fluid page">
        @include('/menu')
        <div class="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
            <div id="kt_header" class="header header-fixed">
                <div class="container-fluid d-flex align-items-stretch justify-content-between">
                    <div class="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper"></div>
                    <div class="topbar">
                        <div class="dropdown">
                            <!--begin::Toggle-->
                            <div class="topbar-item" data-toggle="dropdown" data-offset="10px,0px">
                                <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1">
                                    <img class="h-20px w-20px rounded-sm" src="{{asset('/assets/media/svg/flags/063-japan.svg')}}" alt="" />
                                </div>
                            </div>
                            <div class="dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-sm dropdown-menu-right">
                                <ul class="navi navi-hover py-4">
                                    <!--begin::Item-->
                                    <li class="navi-item">
                                        <a href="?lang=vi" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="/assets/media/svg/flags/220-vietnam.svg" alt="" />
													</span>
                                            <span class="navi-text">Vietnamese</span>
                                        </a>
                                    </li>
                                    <li class="navi-item">
                                        <a href="?lang=ja" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="/assets/media/svg/flags/063-japan.svg" alt="" />
													</span>
                                            <span class="navi-text">Japanese</span>
                                        </a>
                                    </li>
                                    <li class="navi-item">
                                        <a href="?lang=en" class="navi-link">
                                                <span class="symbol symbol-20 mr-3">
														<img src="/assets/media/svg/flags/226-united-states.svg" alt="" />
													</span>
                                            <span class="navi-text">English</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="topbar-item">
                            <div class="btn btn-icon btn-icon-mobile w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle">
                                <span class="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Chào,</span>
                                <span class="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{{auth()->user()->fullname}}</span>
                                <span class="symbol symbol-lg-35 symbol-25 symbol-light-primary">
											<span class="symbol-label font-size-h5 font-weight-bold">A</span>
										</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
                @yield('content')
            </div>
            <div class="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
                <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div class="text-dark order-2 order-md-1">
                        <span class="text-muted font-weight-bold mr-2">2022©</span>
                        <a href="https://www.plott.co.jp/en/" target="_blank" class="text-dark-75 text-hover-primary">PLOTT ASEAN</a>
                    </div>
                    <div class="nav nav-dark order-1 order-md-2">
                        <a href="https://www.plott.co.jp/en/" target="_blank" class="nav-link pr-3 pl-0">Về chúng tôi</a>
                        <a href="https://www.plott.co.jp/en/" target="_blank" class="nav-link pl-3 pr-0">Tương tác</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@include('/user-panel')
<div id="kt_scrolltop" class="scrolltop">
    <span class="svg-icon">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <polygon points="0 0 24 0 24 24 0 24" />
                <rect fill="#000000" opacity="0.3" x="11" y="10" width="2" height="10" rx="1" />
                <path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fill-rule="nonzero" />
            </g>
        </svg>
    </span>
</div>
<ul class="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-3 mt-4" style="z-index: 2000">
    <li class="nav-item mb-2" data-toggle="tooltip" title="" data-placement="left" data-original-title="Máy tính">
        <span class="btn btn-sm btn-icon btn-bg-light btn-icon-warning btn-hover-warning click_calculator" >
            <i class="fas fa-calculator icon-lg"></i>
        </span>
    </li>

</ul>
<div class="modal fade" id="open_calculator" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="max-width: fit-content;">
            <div class="modal-header">
                <h4 class="modal-title" >Máy tính</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="divCalc">
                <div class="divCalcBody">
                    <div>
                        <div class="display">
                            <input type="text" id="displayMain" placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <div class="calc">
                            <div class="btnRow btnRow1">
                                <div class="divButton">
                                    <button class="modifier button" value="(" id="open">(</button>
                                </div>
                                <div class="divButton">
                                    <button class="modifier button" value=")" id="close">)</button>
                                </div>
                                <div class="divButton">
                                    <button class="function button" value="AC" id="ac">AC</button>
                                </div>
                                <div class="divButton">
                                    <button class="function button" value="CE" id="ce">CE</button>
                                </div>
                            </div>
                            <div class="btnRow btnRow2">
                                <div class="divButton">
                                    <button class="number button" value="7">7</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="8">8</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="9">9</button>
                                </div>
                                <div class="divButton">
                                    <button class="operator button" value="&#x00F7;" id="divide">&#x00F7;</button>
                                </div>
                            </div>
                            <div class="btnRow btnRow3">
                                <div class="divButton">
                                    <button class="number button" value="4">4</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="5">5</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="6">6</button>
                                </div>
                                <div class="divButton">
                                    <button class="operator button" value="&#x00D7;" id="multiply">&#x00D7;</button>
                                </div>
                            </div>
                            <div class="btnRow btnRow4">
                                <div class="divButton">
                                    <button class="number button" value="1">1</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="2">2</button>
                                </div>
                                <div class="divButton">
                                    <button class="number button" value="3">3</button>
                                </div>
                                <div class="divButton">
                                    <button class="operator button" value="-" id="subtract">-</button>
                                </div>
                            </div>
                            <div class="btnRow btnRow5">
                                <div class="divButton">
                                    <button class="number button" value="0">0</button>
                                </div>
                                <div class="divButton">
                                    <button class="modifier button" value="." id="point">.</button>
                                </div>
                                <div class="divButton">
                                    <button class="equal button" value="=" id="equal">=</button>
                                </div>
                                <div class="divButton">
                                    <button class="operator button" value="+" id="addition">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>var HOST_URL = "https://preview.keenthemes.com/metronic/theme/html/tools/preview";</script>
<script>var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1400 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#3699FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#E4E6EF", "dark": "#181C32" }, "light": { "white": "#ffffff", "primary": "#E1F0FF", "secondary": "#EBEDF3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#3F4254", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#EBEDF3", "gray-300": "#E4E6EF", "gray-400": "#D1D3E0", "gray-500": "#B5B5C3", "gray-600": "#7E8299", "gray-700": "#5E6278", "gray-800": "#3F4254", "gray-900": "#181C32" } }, "font-family": "Poppins" };</script>
<script src="/admins/assets/plugins/custom/datatables/datatables.bundle.js"></script>

<script src="{{asset('admins/assets/js/pages/crud/datatables/custom/users.js')}}"></script>
<script src="/admins/assets/js/pages/crud/datatables/custom/statistics.js"></script>

<script src="/js/custom-func.js"></script>

{{--<script>--}}
{{--    const success = "{$translate->_($Success)}";--}}
{{--    {literal}--}}
{{--    $.notify(success, {type: "success"});--}}
{{--</script>--}}


{{--<script>--}}
{{--    const Errors = "{$translate->_($Errors)}";--}}
{{--    {literal}--}}
{{--    $.notify(Errors, {type: "danger"});--}}

{{--</script>--}}

</body>

<script>
    $(".click_calculator").on("click", function(){
        $("#open_calculator").css("top","").css("left","");
        $('#open_calculator').modal('show');
    });

    $("#open_calculator").on("focus", function(e){
        // console.log(e);
    }).keydown(function(e){
        // console.log(e.key);
        // $(".button[value="+ e.key + "]").click();
        switch (e.key){
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
            case '(':
            case ')':
            case '.':
            case '+':
            case '-':
            case '=':
                $(".button[value='"+ e.key + "']").click();
                break;
            case 'Backspace':
                console.log("2" , e.key);
                $(".button[value='CE']").click();
                break;
            case 'Enter':
                $(".button[value='=']").click();
                break;
            case '*':
                $(".button[value='×']").click();
                break;
            case '/':
                $(".button[value='÷']").click();
                break;
        }
    });
    //drag modal element
    dragElement(document.getElementById("open_calculator"));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // calculator
    let displayValue = document.querySelector('#displayMain').value;
    let displayArray = displayValue.split('');
    let inputHistory = []; // TODO: Track input for recall? (?)

    $('#displayMain').on('keyup',function (e){
        if(e.keyCode == 13){
            $('#equal').trigger('click');
        }
    });

    document.addEventListener('click', function (e) {
        let displayValue = document.querySelector('#displayMain').value;
        let displayArray = displayValue.split('');
        if (e.target.matches('.number') || e.target.matches('.modifier')) {
            displayArray.push(e.target.value); // displayArray = displayValue.split('')
            displayValue = displayArray.join('');
            document.querySelector('#displayMain').value = displayValue;
            return false;
        }

        // OPERATOR (add, subtract, multiply, divide)
        if (e.target.matches('.operator')) {
            displayArray.push(' ' + e.target.value + ' ');
            displayValue = displayArray.join('');
            document.querySelector('#displayMain').value = displayValue;
        }
        // EQUAL
        if (e.target.matches('#equal')) {
            // console.log(document.querySelector('#displayMain').value);
            // Replace unicode symbols with operators
            let filteredValue = displayArray.join('');
            // console.log(filteredValue);
            let regex_multiply = /[\×|\*]/g;
            filteredValue = filteredValue.replace(regex_multiply, '*');
            let regex_divide =/[\÷|/]/g;
            filteredValue = filteredValue.replace(regex_divide, '/');
            try {
                total = eval(filteredValue);
                // console.log(filteredValue);
                displayValue = total;
                document.querySelector('#displayMain').value = total;
                let transaction_amount = $('.transaction_amount');
                transaction_amount.val(total);
                transaction_amount.trigger('keyup');
                displayArray = [];
                displayValue = '';

            } catch (error) {
                document.querySelector('#displayMain').value = "Nhập lại 😮";
            }
        }

        // CE - CLEAR ENTRY
        if (e.target.matches('#ce')) {

            let length = displayValue.length;
            length--;
            if(displayValue[displayValue.length-1] == ' '){
                length--;
            }
            // console.log(length, displayValue[displayValue.length-1]);
            displayValue = displayValue.substring(0, length);
            displayArray = displayValue.split('');

            document.querySelector('#displayMain').value = displayValue;
        }

        // AC - ALL CLEAR
        if (e.target.matches('#ac')) {
            displayArray = [];
            displayValue = '';
            document.querySelector('#displayMain').value = '';
        }

    })
</script>
@if (request()->route()->getControllerClass() == "App\Http\Controllers\RoleController")
    <link href="{{asset('/css/style1.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <script src="{{asset('/js/script1.bundle.js')}}"></script>
    <script src="{{asset('/js/plugins1.bundle.js')}}"></script>
@endif

