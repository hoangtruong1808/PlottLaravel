
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

            <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
                @yield('content')
            </div>

{{--@include('/user-panel')--}}

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

