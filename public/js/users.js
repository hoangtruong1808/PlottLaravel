// var baseURL = 'http://192.168.20.27/cong/public/';
var selectedCount;


function closeF() {
    document.getElementById("myForm").style.display = "none";
}

$("#usersCount").on("change", function(){
    // console.log($(this).val());
    // console.log(search);
    selectedCount = $(this).val();

    url = "http://192.168.20.27/cong/public/user/index/item/" + selectedCount + "/page/" + getPage;
    url += "?search=" + search;
    // console.log(url);
    window.location = url;
    // $(this).val(selectedCount);
    // console.log($(this).val(selectedCount));

});

$(document).ready(function() {
    $("#search").hover(function(){
        if($("#search").val() == ''){
            $(':input[type="submit"]').prop('disabled', true);
        }
    });
    $('input[type="text"]').keyup(function() {
        if($(this).val() != '') {
            $(':input[type="submit"]').prop('disabled', false);
        }
    });
});

$("#clear-search").on("click", function(){
    url = baseURL + "user/index/item/" + countItem;
    // console.log(url);
    window.location.href = url;
});

$("#add-user").on("click", function(){
    url = baseURL + "user/add";
    // console.log(url);
    window.location.href = url;
})

$("#sync-users").on("click", function(){
    $('#open-modal').removeClass('hidden');
    url = baseURL + "user/sync-users";
    // console.log(url);
})

$(":input[name=password]").focusout(function(){
    // console.log($(this).val());
    if($(this).val() == ''){
        $('#submit-form').prop('disabled', true);
        $("#errors").text("Mật khẩu không được để trống");

    }else{
        $("#errors").text("");
        $('#submit-form').prop('disabled', false);
    }
})

$('#submit-form').on('click', function(){
    // console.log("ehe");
    $('#sync-confirm').attr('action', baseURL + 'user/sync-users');
    confirmPassword = $(":input[name=password]").val();
    $.ajax({
        url: baseURL + "/user/check",
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
                // console.log(baseURL + 'user/sync-users');
                // // }else{
                // //     console.log("false");
                // //     // $("#errors").text("Sai mật khẩu");
                // // }
            }
        },
        error: function(data){
            return $("#errors").text("Sai mật khẩu");
        }
    });
})
