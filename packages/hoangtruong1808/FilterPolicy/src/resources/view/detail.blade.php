@extends('Policy::main')

@section('content')
    <style>
        .loader1 {
            border: 3px solid #f3f3f3; /* Light grey */
            border-top: 3px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 3s linear infinite;
            margin-right: 5px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
    <div class="d-flex flex-column-fluid">
        <div class="container">
            <!--begin::Card-->
            <div class="card card-custom">
                <div class="card-header flex-wrap py-5">
                    <div class="card-title">
                        <h3 class="card-label">Kiểm tra file

                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    <div id="kt_app_content_container" class="app-container container-xxl">
                        <form class="form d-flex" enctype="multipart/form-data" id="check-file" method="post">
                            @csrf
                            <div>
                                <input type="file" name="file[]" id="file" accept=".txt" multiple onchange="javascript:updateList()"/>
                            </div>
                            <button type="submit" class="btn btn-primary d-flex">
                                <span class="loader1"></span>
                                <span class="svg-icon svg-icon-md abc">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <rect x="0" y="0" width="24" height="24"></rect>
                                            <circle fill="#000000" cx="9" cy="15" r="6"></circle>
                                            <path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3"></path>
                                        </g>
                                    </svg>
                                </span>
                                Kiểm tra
                            </button>
                        </form>
                        <div id="selected-file">
                            <div id="fileList"></div>
                        </div>
                        <!--begin::Row-->
                        <div id="result" style="margin-top: 10px">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $( document ).ready(function() {
            $('.loader1').hide();
        });
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        updateList = function() {
            var input = document.getElementById('file');
            var output = document.getElementById('fileList');
            var select_file = document.getElementById('fileList');
            var children = "";
            $("#selected-file p").remove();
            if (input.files.length > 0) {
                $("#selected-file").prepend('<p>File đã chọn:</p>');
            }
            for (var i = 0; i < input.files.length; ++i) {
                children += '<li>' + input.files.item(i).name + '</li>';
            }
            output.innerHTML = '<ul>' + children + '</ul>';

        }

        $("#check-file").submit(function(e) {
            $('.loader1').show();
            $('.abc').hide();
            e.preventDefault();
            let formData = new FormData(this);
            $.ajax({
                url: '/filter-policy/check_file',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == "success") {
                        var message = "Kiểm tra file thành công";
                        $.notify(message, {type: "success"});
                    }
                    else {
                        var message = "Kiểm tra file thất bại";
                        $.notify(message, {type: "danger"});
                    }
                    $( "#result" ).html(data.html);
                    $('.loader1').hide();
                    $('.abc').show();
                },
                error: function(data){
                    var message = "Kiểm tra file thất bại";
                    $.notify(message, {type: "error"});
                    var message_parse = JSON.parse(data.responseText);
                    $.each(message_parse.errors, function(error_key, error_value){
                        $("#error-"+error_key).html(error_value[0]);
                        $("input[name="+error_key+"]").addClass('is-invalid');
                        $('.loader1').hide();
                        $('.abc').show();
                    });
                }
            });
        })
    </script>
@endsection
