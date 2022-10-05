var avatar = new KTImageInput('kt_user_edit_avatar');

//This is fast edit
$("#avatar").on("change", function(e) {
    e.preventDefault();
    let url = baseURL + 'user/execedit';
    $("#form-edit-avatar").attr("action", url);
    let name = $(this)[0].files[0].name;
    let size = $(this)[0].files[0].size;
    let isCheckFile = false;
    // console.log(name);
    if(checkFile(name) == false || size > 4195024){
        isCheckFile = true;
        editAvatar.cancel.click();
        $.notify(arrAside['UPLOAD_AVATAR_EMPTY'], {type : "danger"});
    }else{
        const formData = new FormData();
        let attachment_data = $(this)[0].files[0];
        formData.append("avatar", attachment_data);
        $.ajax({
            type: "POST",
            url,
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            // cache: false,
            success: function(data){
                if(data != null) {
                    $(".symbol-label:eq(2)").css("background-image", $(".image-input-wrapper.symbol-label").css("background-image"));
                    $.notify(arrAside['SUCCESS_UPDATE'], {type : "success"});
                }
            }
        });
    }
})
