// PLOTT ASEAN POLICY START

//-----------setJudgmentCriteriaWeight------------//
let judgment_criteria_value = $("input[name='judgment_criteria_value']").val();

function setJudgmentCriteriaWeight() {

    if($("input[name='judgment_criteria']:checked").val() == 2){
        $("input[name='judgment_criteria_value']").attr("disabled", false);
        $('.check_hidden').prop('hidden',false);
    }else{
        $("input[name='judgment_criteria_value']").attr("disabled", true);
        $("input[name='judgment_criteria_value']").val("");
        $('.check_hidden').prop('hidden',true);
    }
    $("input[name='judgment_criteria']").on("change", function(){
        if($(this).val() == 2){
            $("input[name='judgment_criteria_value']").attr("disabled", false);
            $('.check_hidden').prop('hidden',false);
            $("input[name='judgment_criteria_value']").val(judgment_criteria_value);
        }else{
            if($("input[name='judgment_criteria_value']").val() != '' ){
                judgment_criteria_value = $("input[name='judgment_criteria_value']").val();
            }
            $("input[name='judgment_criteria_value']").val("");
            $("input[name='judgment_criteria_value']").attr("disabled", true);
            $('.check_hidden').prop('hidden',true);
        }
    });
}

//---------------------BUTTON ADD AND REMOVE CHECKPOINT ---------------------------//
function addMultier(e) {
    var smoothfile_process_condition_dummy = $('#smoothfile_process_condition_dummy');
    var judgment_criteria_val = $("input[name='judgment_criteria']:checked").val();
    var sub_wrapper_html = smoothfile_process_condition_dummy.html();
    var wrapper = $(e).prev();
    var idx = smoothfile_process_condition_dummy.data('template-id');
    sub_wrapper_html = sub_wrapper_html.replace(/_0/g, "_" + idx);
    sub_wrapper_html = sub_wrapper_html.replace(/\[0\]/g, "[" + idx + "]");
    wrapper.append(sub_wrapper_html);
    if(judgment_criteria_val == 2){
        wrapper.find('.check_hidden').prop('hidden', false);
    }
    wrapper.find('.wrap_check_point').find('.pagination_minusIcon').show();
    smoothfile_process_condition_dummy.data('template-id', idx +1);
}
function removeMultier(e) {
    var div = $(e).closest("div");
    var wrapper = div.parent().parent();
    if (wrapper.children().length === 1) {
        return false;
    }
    div.parent().remove();
    var first_el = wrapper.children().eq(0);
    var num_el = wrapper.children().length;
    if (num_el === 1) {
        first_el.find("> div > span.pagination_minusIcon").hide();
    }
}

//------------------------------CHANGE CHECKPOINT----------------------------//
function CheckItemChange(obj, order) {
    if(typeof order == 'undefined'){
        order = "_0";
    }
    CloseAllCheckItem(order);
    var mode = obj.options[obj.selectedIndex].value;
    switch (mode) {
        case "0":
            funcOpenAllOrPass(order);
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "10":
            funcOpenMatchNumber(order);
            funcOpenTargetCheck(order);
            break;
//		case "4":
//			duplicate_1.checked = true;
//			span_duplicate_0.style.display = 'none';
//			funcOpenMatchNumber();
//			break;
        case "5":
            funcOpenCapacityCheck(order);
            break;
        case "6":
//			funcOpenKeywordGroupCheck();
            funcOpenMatchNumber(order);
            funcOpenTargetCheck(order);
            break;
        case "7":
            funcOpenKeywordLogicCheck(order);
            funcOpenKeywordCheck(order);
            funcOpenMatchNumber(order);
            funcOpenTargetCheck(order);
            break;
        case "8":
            funcOpenRegularExpressionCheck(order);
            funcOpenMatchNumber(order);
            funcOpenTargetCheck(order);
            break;
        case "9":
            funcOpenAllOrPass(order);
            break;
        default:
            DisplayAllCheckItem(order);
            break;
    }
}

function DisplayAllCheckItem(order) {
    funcOpenCapacityCheck(order);
    funcOpenKeywordCheck(order);
    funcOpenKeywordLogicCheck(order);
    funcOpenRegularExpressionCheck(order);
    funcOpenMatchNumber(order);
    funcOpenTargetCheck(order);
}

function CloseAllCheckItem(order) {
    funcCloseCapacityCheck(order);
    funcCloseKeywordCheck(order);
    funcCloseKeywordLogicCheck(order);
    funcCloseRegularExpressionCheck(order);
    funcCloseMatchNumber(order);
    funcCloseTargetCheck(order);
}

function funcOpenCapacityCheck(order) {
    var row = document.getElementById("policy_capacity"+order);
    // if (row.style.display == 'none') {
    row.style.display = '';
    // }
    // var t_row = document.getElementById("policy_target"+order);
    // t_row.style.display = 'none';

}

function funcCloseCapacityCheck(order) {
    var row = document.getElementById("policy_capacity"+order);
    row.style.display = 'none';
    // var t_row = document.getElementById('policy_target'+order);
    // t_row.style.display = '';
}

function funcOpenKeywordCheck(order) {
    var row = document.getElementById("policy_keyword" + order);
    row.style.display = '';
}

function funcCloseKeywordCheck(order) {
    var row = document.getElementById("policy_keyword" + order);
    row.style.display = 'none';
}

function funcOpenKeywordLogicCheck(order) {
    var row = document.getElementById("policy_keyword_logic" + order);
    row.style.display = '';
}

function funcCloseKeywordLogicCheck(order) {
    var row = document.getElementById("policy_keyword_logic" + order);
    row.style.display = 'none';
}

function funcOpenMatchNumber(order) {
    var row = document.getElementById("policy_match_count" + order);
    row.style.display = '';
}

function funcCloseMatchNumber(order) {
    var row = document.getElementById("policy_match_count" + order);
    row.style.display = 'none';
}

function funcOpenRegularExpressionCheck(order) {
    var row = document.getElementById("policy_regular_expression" + order);
    row.style.display = '';
}

function funcCloseRegularExpressionCheck(order) {
    var row = document.getElementById("policy_regular_expression" + order);
    row.style.display = 'none';
}

function funcOpenTargetCheck(order) {
    var row = document.getElementById("policy_target" + order);
    row.style.display = '';
}

function funcCloseTargetCheck(order) {
    var row = document.getElementById("policy_target" + order);
    row.style.display = 'none';
}

function funcOpenAllOrPass(order) {
    //別の「チェック内容」でチェックボックスに入力が値をクリア
    var target_id_ary = new Array('title', 'msg', 'attach');
    for (var i = 0; i < target_id_ary.length; i++) {
        var val = $('#policy\\[' + target_id_ary[i] + '\\]').prop('checked');
        if (val) {
            $('#policy\\[' + target_id_ary[i] + '\\]').prop('checked', false);
        }
    }
    var row = document.getElementById('policy_target' + order);
    row.style.display = 'none';
}

function evtContentLoaded(win) {

    var ifr = win.getFrame();
    var doc = $(ifr.contentWindow.document);

    //閉じるボタン
    doc.find("#closeButton").click(function () {
        win.close();
    });

}

function resetForm() {
    location.reload();
}

//------------------------------REGEX CHECKER----------------------------//

function openRegExplain() {
    var explainWin = window.open(getAccountUrl("open-reg-explain"), "ExplainRegularExpression", "width=1120,height=770,resizable=yes,location=no");
}

function funcOpenRegexChecker(order) {
    var postData;
    var regexWord = $("#policy_pattern" + order).val();
    var inputWord;

    if (regexWord == "") {
        alert(msgRegexChecker[0].noInputRegex);
        return false;
    }

    inputWord = prompt(msgRegexChecker[0].enterString);

    if (inputWord !== null && inputWord !== "" && regexWord !== "") {

        inputWord = encodeURIComponent(inputWord);  //エスケープ
        regexWord = encodeURIComponent(regexWord);  //エスケープ

        postData = "input_word=" + inputWord;
        postData = postData + "&regex_word=" + regexWord;
        $.ajax({
            type: "POST",
            url: getAccountUrl("file-mail-defender-link-policy-setting/regex-checker"),
            data: postData,
            dataType: "json",
            success: function (res, type) {
                if (res.state != "OK") {
                    alert(msgRegexChecker[0].errorString);
                    return false;
                } else {
                    if (res.message == "OK") {
                        //正常終了メッセージ
                        alert(res.result);
                        return true;
                    } else {
                        alert(res.message);
                    }
                }
            },
            error: function (request, msg) {
                alert('Error! An error occurred. Please try again later!')
            }
        });
    } else if (inputWord == "") {
        alert(msgRegexChecker[0].noInputData);
    }
}

function funcUpdateRank(row_id, type)
{
    var data = {
        type: type,
        id: row_id,
    };
    $.get(
        '/policy/update-rank',
        data,
        function(data){
            if (data.status == true) {
                $.notify('Cập nhật thành công', {type: "success"});
                return $('#filter_policy_datatable').DataTable().ajax.reload();
            }
            else {
                $.notify('Cập nhật thất bại', {type: "success"});
            }
        }
    );
}

function deletePolicy(id){
    $("#deletePolicy").modal("show");
    $("#policy-delete-id").val(id);
}

