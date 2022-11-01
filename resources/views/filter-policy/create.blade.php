@extends('main')

@section('content')
    <style>
        .required {
            color:red;
        }
        .col-form-label {
            width: 15%;
        }
        /*!*PLOTT ASEAN POLICY START*!*/
        input[type="button"] {
            cursor: pointer;
        }
        .padding_area{
            padding-top: 13px;
            padding-bottom: 10px;
        }
        .wrap_check_point{
            position: relative;
            width: 920px;
            border-radius: 4px;
            border: 1px solid #e4e6ef;
            padding: 20px 20px 0px;
            margin-bottom: 10px;
        }

        .check_point_row{
            padding: 5px 0
        }

        .check_point_label{
            width: 150px;
            display: inline-block;
            margin-right: 0;
        }
        .pagination_move span, .pagination_icon span {
            border: 1px solid #7e7c7c;
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            position: relative;
            vertical-align: bottom;
            margin-left: 7px;
        }
        .pagination_plusIcon{
            background:url("/img/create_off.png") no-repeat center;
            background-size: 14px 14px;
            cursor: pointer;
        }
        .pagination_plusIcon:hover{
            background: url('/img/create_on.png') no-repeat center;
            background-size: 14px 14px;
            border: 1px solid #75abf5;
        }

        .pagination_minusIcon{
            background:url("/img/ico_minus_off.png") no-repeat center;
            background-size: 12px 12px;
            cursor: pointer;
        }
        .pagination_minusIcon:hover{
            background: url('/img/ico_minus_on.png') no-repeat center;
            background-size: 12px 12px;
            border: 1px solid #75abf5;
        }

        .whiteback_cell_skin .segment-width{
            min-width: 250px;
        }

        .reg_explain{
            color: -webkit-link;
            cursor: pointer;
            text-decoration: underline;
        }

        .wrap_check_point .pagination_move{
            display: block;
            position: absolute;
            left: 865px;
            top: 15px;
        }

        input, select, textarea {
            border: 1px solid #e4e6ef
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
                        <a href="/user" class="text-muted">{{ $title }}</a>
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
                <form class="form" enctype="multipart/form-data" id="add-policy" method="post">
                    @csrf()
                    @if (isset($code))
                        <input type="hidden" name="id" value="{{$code}}" />
                    @endif
                    <div class="card-body px-0">
                        <div class="container-fluid justify-content-center">
                            <div class="container">
                                <div class="form-group row">
                                    <label for="username" class="col-form-label">Tên chính sách<span class="required"> *</span></label>
                                    <span  style="width:70%">
                                        <input name="filter_policy_list_name" id="username" placeholder="Tên đăng nhập" length="20" class="form-control" type="text" value="{{ (isset($code))?$policy['filter_policy_list_name']:"" }}">
                                          <div class="fv-plugins-message-container error-filter_policy_list_name">
                                            <div class="fv-help-block error-field" id="error-filter_policy_list_name">
                                            </div>
                                        </div>
                                    </span>
                                </div>
                                <div class="form-group row">
                                    <label for="username" class="col-form-label">Người gửi</label>
                                    <span  style="width:70%">
                                        <textarea name="from_user" id="username" length="20" class="form-control">{{ (isset($code))?$policy['from_user']:"" }}</textarea>
                                        <div class="fv-plugins-message-container error-from_user">
                                            <div class="fv-help-block error-field" id="error-from_user">
                                        </div>
                                    </div>
                                    </span>
                                </div>
                                <div class="form-group row">
                                    <label class="col-form-label">Quá trình<span class="required">*</span></label>
                                    <div class="radio-inline">
                                        <label class="radio radio-outline radio-outline-2x radio-primary">
                                            <input type="radio" name="exec_type" value="0"
                                            @if (isset($code))
                                                {{ ($policy['exec_type'] == 0 || !isset($code))?"checked":"" }}
                                            @else
                                                checked
                                            @endif
                                                />
                                            <span></span>
                                            Gửi
                                        </label>
                                        <label class="radio radio-outline radio-outline-2x radio-primary">
                                            <input type="radio" name="exec_type" value="1"
                                            @if (isset($code))
                                                {{ ($policy['exec_type'] == 1)?"checked":"" }}
                                            @endif
                                            />
                                            <span></span>
                                            Cấp trên phê duyệt
                                        </label>

                                        <label class="radio radio-outline radio-outline-2x radio-primary">
                                            <input type="radio" name="exec_type" value="2"
                                            @if (isset($code))
                                                {{ ($policy['exec_type'] == 2)?"checked":"" }}
                                            @endif
                                                />
                                            <span></span>
                                            Kiểm tra chính sách tiếp theo
                                        </label>

                                        <label class="radio radio-outline radio-outline-2x radio-primary">
                                            <input type="radio" name="exec_type" value="3"
                                            @if (isset($code))
                                                {{ ($policy['exec_type'] == 3)?"checked":"" }}
                                            @endif
                                                />
                                            <span></span>
                                            Từ chối
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-form-label">Điều kiện<span class="required">*</span></label>
                                    <span>
                                        <div class="radio-inline">
                                            <label class="radio radio-outline radio-outline-2x radio-primary">
                                                <input type="radio" name="judgment_criteria" value="0"
                                                @if (isset($code))
                                                    {{ ($policy['judgment_criteria'] == 0 || !isset($code))?"checked":"" }}
                                                @else
                                                    checked
                                                @endif
                                                />
                                                <span></span>
                                                Phù hợp với điều kiện bất kì
                                            </label>
                                        </div>
                                        <div class="radio-inline">
                                            <label class="radio radio-outline radio-outline-2x radio-primary">
                                                <input type="radio" name="judgment_criteria" value="1"
                                                @if (isset($code))
                                                    {{ ($policy['judgment_criteria'] == 1)?"checked":"" }}
                                                @endif
                                                />
                                                <span></span>
                                                Phù hợp với tất cả điều kiện
                                            </label>
                                        </div>
                                        <div class="radio-inline">
                                            <label class="radio radio-outline radio-outline-2x radio-primary">
                                                <input type="radio" name="judgment_criteria" value="2"
                                                    @if (isset($code))
                                                    {{ ($policy['judgment_criteria'] == 2)?"checked":"" }}
                                                    @endif
                                                />
                                                <span></span>
                                                Tổng số điểm là <p style="margin: 0px"><input type="number" class="form-control" name="judgment_criteria_value" min="1" value="{{(isset($code))?$policy['judgment_criteria_value']:"" }}" style="width: 115px; margin: 0px 10px;"></p> trở lên
                                            </label>
                                        </div>
                                        <div class="fv-plugins-message-container error-judgment_criteria_value">
                                            <div class="fv-help-block error-field" id="error-judgment_criteria_value"></div>
                                        </div>
                                    </span>
                                </div>
                                <div class="form-group row">
                                    <label for="username" class="col-form-label">Checkpoint</label>
                                    <span>
                                        <div class="multier_wrapper">
                                            @if (isset($code))
                                                @foreach(json_decode($policy['checkpoint']) as $checkpoint_key => $policy_value)
                                                <div class="wrap_check_point">
                                                <div class="check_point_row">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Check point</font></label>
                                                    <select id="policy_{{$checkpoint_key}}[check_type]" name="check_point[{{$checkpoint_key}}][check_type]" onchange="CheckItemChange(this, '_{{$checkpoint_key}}')" class="">
                                                        @foreach ($select_check_points as $key => $check_point)
                                                            <option value="{{$key}}" {{($key == $policy_value->check_type)? " selected":""}} >{{$check_point}}</option>
                                                        @endforeach
                                                    </select>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_check_type_{{$checkpoint_key}}"></span>
                                                </div>
                                                <div id="policy_keyword_logic_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Từ khóa</font></label>
                                                    <label>
                                                        <input name="check_point[{{$checkpoint_key}}][andor]" value="0" type="radio" {{(isset($policy_value->condition_and_or) && $policy_value->condition_and_or == 0)?'checked':""}}/>
                                                        <span style="margin-right: 20px">AND</span>
                                                    </label>
                                                    <label>
                                                        <input name="check_point[{{$checkpoint_key}}][andor]" value="1" type="radio" {{(isset($policy_value->condition_and_or) && $policy_value->condition_and_or == 1)?'checked':""}}/>
                                                        <span style="margin-right: 20px">OR</span>
                                                    </label>
                                                </div>
                                                <div id="policy_keyword_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"></label>
                                                    <textarea name="check_point[{{$checkpoint_key}}][keyword]" rows="4" cols="40"
                                                              style="width: 80%; resize: vertical">{{(isset($policy_value->keyword_data))?$policy_value->keyword_data:""}}</textarea>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_keyword_{{$checkpoint_key}}"></span>
                                                </div>
                                                <div id="policy_regular_expression_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><span style="vertical-align: inherit;">Biểu thức chính quy<a class="reg_explain" href="#" onclick="openRegExplain();">?</a></span></label>
                                                    <textarea rows="3" name="check_point[{{$checkpoint_key}}][pattern]" id="policy_pattern_{{$checkpoint_key}}" cols="50"
                                                              style="width: 80%; resize: vertical">{{(isset($policy_value->pattern))?$policy_value->pattern:""}}</textarea>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="">* Lưu ý phải kiểm tra biểu thức chính quy trước khi đăng kí.</span>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_pattern_{{$checkpoint_key}}"></span>
                                                    <br/><br/>
                                                    <label class="check_point_label"></label>
                                                    <input type="button" name="regex_checker" value="Kiểm tra biểu thức chính quy"
                                                           onclick="funcOpenRegexChecker('_{{$checkpoint_key}}')">

                                                </div>
                                                <div id="policy_match_count_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Số lượng</font></label>
                                                    <input type="text" name="check_point[{{$checkpoint_key}}][match_count]" value="{{(isset($policy_value->match_count))?$policy_value->match_count:""}}"
                                                           size="10"/><span style="margin-right: 20px">Phần tử</span>
                                                    <label for="duplicate_a_{{$checkpoint_key}}" style="margin-right: 20px">
                                                        <input type="radio" name="check_point[{{$checkpoint_key}}][match_pattern]" id="duplicate_a_{{$checkpoint_key}}" value="0"
                                                               @if (isset($policy_value->match_pattern))
                                                                   @if (!$policy_value->match_pattern)
                                                                   checked
                                                                   @endif>
                                                               @endif
                                                        Không tính các từ lặp lại
                                                    </label>
                                                    <label for="duplicate_b_{{$checkpoint_key}}">
                                                        <input type="radio" name="check_point[{{$checkpoint_key}}][match_pattern]" id="duplicate_b_{{$checkpoint_key}}" value="1"
                                                               @if (isset($policy_value->match_pattern))
                                                                       @if ($policy_value->match_pattern)
                                                                       checked
                                                                       @endif>
                                                                @endif
                                                        Tính các từ lặp lại
                                                    </label>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_match_count_{{$checkpoint_key}}"></span>
                                                </div>
                                                <div id="policy_target_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Mục tiêu</font></label>
                                                    <label for="policy[{{$checkpoint_key}}][file_name]" style="margin-right: 20px">
                                                        <input type="checkbox" name="check_point[{{$checkpoint_key}}][file_name]" id="policy[{{$checkpoint_key}}][file_name]" value="1"
                                                        @if (isset($policy_value->check_file_name))
                                                            @if ($policy_value->check_file_name)
                                                            checked
                                                            @endif
                                                        @endif
                                                        >
                                                        Tên file
                                                    </label>
                                                    <label for="policy[{{$checkpoint_key}}][data]">
                                                        <input type="checkbox" name="check_point[{{$checkpoint_key}}][data]" id="policy[{{$checkpoint_key}}][data]" value="1"
                                                        @if (isset($policy_value->check_data))
                                                           @if ($policy_value->check_data)
                                                           checked
                                                            @endif
                                                        @endif
                                                        >
                                                        Dữ liệu
                                                    </label>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_target_{{$checkpoint_key}}"></span>
                                                </div>
                                                <div id="policy_capacity_{{$checkpoint_key}}" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Kích thước tập tin</font></label>
                                                    <input type="number" name="check_point[{{$checkpoint_key}}][min_capacity_transition]" value="{{(isset($policy_value->min_capacity_transition))?$policy_value->min_capacity_transition:""}}"
                                                           size="10"/>MB trở lên
                                                    <input type="number" name="check_point[{{$checkpoint_key}}][max_capacity_transition]" value="{{(isset($policy_value->max_capacity_transition))?$policy_value->max_capacity_transition:""}}"
                                                           size="10"/>MB trở xuống
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_min_capacity_transition_{{$checkpoint_key}}"></span>
                                                </div>
                                                <div id="policy_weight_{{$checkpoint_key}}" class="check_point_row check_hidden" hidden>
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Điểm</font></label>
                                                    <input type="text" name="check_point[{{$checkpoint_key}}][weight]" value="{{(isset($policy_value->weight))?$policy_value->weight:""}}"
                                                           size="8"/>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_weight_{{$checkpoint_key}}"></span>
                                                </div>

                                                <div class="pagination_move">
                                                    <span class="pagination_minusIcon" style="vertical-align: middle; display: none;" onclick="removeMultier(this)"></span>
                                                </div>
                                                <span id='error_port_{{$checkpoint_key}}' class='error_message'></span>
                                            </div>
                                                @endforeach
                                            @else
                                            <div class="wrap_check_point">
                                                <div class="check_point_row">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Check point</font></label>
                                                    <select id="policy_0[check_type]" name="check_point[0][check_type]" onchange="CheckItemChange(this, '_0')" class="">
                                                        @foreach ($select_check_points as $key => $check_point)
                                                            <option value="{{$key}}">{{$check_point}}</option>
                                                        @endforeach
                                                    </select>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_check_type_0"></span>
                                                </div>
                                                <div id="policy_keyword_logic_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Từ khóa</font></label>
                                                    <label>
                                                        <input name="check_point[0][andor]" value="0" type="radio" checked/>
                                                        <span style="margin-right: 20px">AND</span>
                                                    </label>
                                                    <label>
                                                        <input name="check_point[0][andor]" value="1" type="radio"/>
                                                        <span style="margin-right: 20px">OR</span>
                                                    </label>
                                                </div>
                                                <div id="policy_keyword_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"></label>
                                                    <textarea name="check_point[0][keyword]" rows="4" cols="40"
                                                              style="width: 80%; resize: vertical"></textarea>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_keyword_0"></span>
                                                </div>
                                                <div id="policy_regular_expression_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><span style="vertical-align: inherit;">Biểu thức chính quy<a class="reg_explain" href="#" onclick="openRegExplain();">?</a></span></label>
                                                    <textarea rows="3" name="check_point[0][pattern]" id="policy_pattern_0" cols="50"
                                                              style="width: 80%; resize: vertical"></textarea>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="">* Lưu ý phải kiểm tra biểu thức chính quy trước khi đăng kí.</span>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_pattern_0"></span>
                                                    <br/><br/>
                                                    <label class="check_point_label"></label>
                                                    <input type="button" name="regex_checker" value="Kiểm tra biểu thức chính quy"
                                                           onclick="funcOpenRegexChecker('_0')">

                                                </div>
                                                <div id="policy_match_count_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Số lượng</font></label>
                                                    <input type="text" name="check_point[0][match_count]"
                                                           size="10"/><span style="margin-right: 20px">Phần tử</span>
                                                    <label for="duplicate_a_0" style="margin-right: 20px">
                                                        <input type="radio" name="check_point[0][match_pattern]" id="duplicate_a_0" value="0" checked>
                                                        Không tính các từ lặp lại
                                                    </label>
                                                    <label for="duplicate_b_0">
                                                        <input type="radio" name="check_point[0][match_pattern]" id="duplicate_b_0" value="1">
                                                        Tính các từ lặp lại
                                                    </label>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_match_count_0"></span>
                                                </div>
                                                <div id="policy_target_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Mục tiêu</font></label>
                                                    <label for="policy[0][file_name]" style="margin-right: 20px">
                                                        <input type="checkbox" name="check_point[0][file_name]" id="policy[0][file_name]" value="1">
                                                        Tên file
                                                    </label>
                                                    <label for="policy[0][data]">
                                                        <input type="checkbox" name="check_point[0][data]" id="policy[0][data]" value="1">
                                                        Dữ liệu
                                                    </label>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_target_0"></span>
                                                </div>
                                                <div id="policy_capacity_0" class="check_point_row" style="display: none">
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Kích thước tập tin</font></label>
                                                    <input type="number" name="check_point[0][min_capacity_transition]" value="{$policy_value.min_capacity_transition}"
                                                           size="10"/>MB trở lên
                                                    <input type="number" name="check_point[0][max_capacity_transition]" value="{$policy_value.max_capacity_transition}"
                                                           size="10"/>MB trở xuống
                                                    <br/>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_min_capacity_transition_0"></span>
                                                </div>
                                                <div id="policy_weight_0" class="check_point_row check_hidden" hidden>
                                                    <label class="check_point_label"><font style="vertical-align: inherit;">Điểm</font></label>
                                                    <input type="text" name="check_point[0][weight]"
                                                           size="8"/>
                                                    <br>
                                                    <label class="check_point_label"></label>
                                                    <span class="attention error_field" id="error_weight_0"></span>
                                                </div>

                                                <div class="pagination_move">
                                                    <span class="pagination_minusIcon" style="vertical-align: middle; display: none;" onclick="removeMultier(this)"></span>
                                                </div>
                                                <span id='error_port_0' class='error_message'></span>
                                            </div>
                                            @endif
                                        </div>
                                        <div id="btplus_port" onclick="addMultier(this)" class="pagination_move target_range" style="width: 100px;">
                                            <span class="pagination_plusIcon" style="/*vertical-align: middle;*/ margin-left: 0px"></span>
                                        </div>

                                    </span>
                                    <div class="fv-plugins-message-container error-username">
                                        <div class="fv-help-block error-field" id="error-username">
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
    <template id="smoothfile_process_condition_dummy" data-template-id="{{(isset($policy['checkpoint']) && count(json_decode($policy['checkpoint'])) > 0)?count(json_decode($policy['checkpoint'])):1}}">
        <div class="wrap_check_point">
            <div class="check_point_row">
                <label class="check_point_label"><font style="vertical-align: inherit;">Check point</font></label>
                <select id="policy_0[check_type]" name="check_point[0][check_type]" onchange="CheckItemChange(this, '_0')">
                    @foreach ($select_check_points as $key => $check_point)
                        <option value="{{$key}}">{{$check_point}}</option>
                    @endforeach
                </select>
                <br/>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_check_type_0"></span>
            </div>
            <div id="policy_keyword_logic_0" class="check_point_row" style="display: none">
                <label class="check_point_label"><font style="vertical-align: inherit;">Từ khóa</font></label>
                <label>
                    <input name="check_point[0][andor]" value="0" type="radio" checked/>
                    <span style="margin-right: 20px">AND</span>
                </label>

                <label>
                    <input name="check_point[0][andor]" value="1" type="radio"/>
                    <span style="margin-right: 20px">OR</span>
                </label>
            </div>
            <div id="policy_keyword_0" class="check_point_row" style="display: none">
                <label class="check_point_label"></label>
                <textarea name="check_point[0][keyword]" rows="4" cols="40"
                          style="width: 80%; resize: vertical"></textarea>
                <br/>
                <label class="check_point_label"></label>
                <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                <br/>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_keyword_0"></span>
            </div>
            <div id="policy_regular_expression_0" class="check_point_row" style="display: none">
                <label class="check_point_label"><span style="vertical-align: inherit;">Biểu thức chính quy<a class="reg_explain" href="#" onclick="openRegExplain();">?</a></span></label>
                <textarea rows="3" name="check_point[0][pattern]" id="policy_pattern_0" cols="50"
                          style="width: 80%; resize: vertical"></textarea>
                <br/>
                <label class="check_point_label"></label>
                <span>* Bạn có thể chỉ định nhiều giá trị bằng cách xuống dòng.</span>
                <br/>
                <label class="check_point_label"></label>
                <span class="">* Lưu ý phải kiểm tra biểu thức chính quy trước khi đăng kí.</span>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_pattern_0"></span>
                <br/><br/>
                <label class="check_point_label"></label>
                <input type="button" name="regex_checker" value="Kiểm tra biểu thức chính quy"
                       onclick="funcOpenRegexChecker('_0')">

            </div>
            <div id="policy_match_count_0" class="check_point_row" style="display: none">
                <label class="check_point_label"><font style="vertical-align: inherit;">Số lượng</font></label>
                <input type="text" name="check_point[0][match_count]"
                       size="10"/><span style="margin-right: 20px">Phần tử</span>
                <label for="duplicate_a_0" style="margin-right: 20px">
                    <input type="radio" name="check_point[0][match_pattern]" id="duplicate_a_0" value="0" checked>
                    Không tính các từ lặp lại
                </label>

                <label for="duplicate_b_0">
                    <input type="radio" name="check_point[0][match_pattern]" id="duplicate_b_0" value="1">
                    Tính các từ lặp lại
                </label>
                <br>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_match_count_0"></span>
            </div>
            <div id="policy_target_0" class="check_point_row" style="display: none">
                <label class="check_point_label"><font style="vertical-align: inherit;">Mục tiêu</font></label>
                <label for="policy[0][file_name]" style="margin-right: 20px">
                    <input type="checkbox" name="check_point[0][file_name]" id="policy[0][file_name]" value="1">
                    Tên file
                </label>
                <label for="policy[0][data]">
                    <input type="checkbox" name="check_point[0][data]" id="policy[0][data]" value="1">
                    Dữ liệu
                </label>
                <br>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_target_0"></span>
            </div>
            <div id="policy_capacity_0" class="check_point_row" style="display: none">
                <label class="check_point_label"><font style="vertical-align: inherit;">Kích thước tập tin</font></label>
                <input type="number" name="check_point[0][min_capacity_transition]" value="{$policy_value.min_capacity_transition}"
                       size="10"/>MB trở lên
                <input type="number" name="check_point[0][max_capacity_transition]" value="{$policy_value.max_capacity_transition}"
                       size="10"/>MB trở xuống
                <br/>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_min_capacity_transition_0"></span>
            </div>
            <div id="policy_weight_0" class="check_point_row check_hidden" hidden>
                <label class="check_point_label"><font style="vertical-align: inherit;">Điểm</font></label>
                <input type="text" name="check_point[0][weight]"
                       size="8"/>
                <br>
                <label class="check_point_label"></label>
                <span class="attention error_field" id="error_weight_0"></span>
            </div>

            <div class="pagination_move">
                <span class="pagination_minusIcon" style="vertical-align: middle; display: none;" onclick="removeMultier(this)"></span>
            </div>
            <span id='error_port_0' class='error_message'></span>
        </div>
    </template>
    <!--end: entry -->
    <script>
        $(document).ready(function () {
            setJudgmentCriteriaWeight();

            @if (isset($code))
            var policy_check_count = {{count(json_decode($policy['checkpoint']))}};
            for (i = 0; i < policy_check_count; i++){
                CheckItemChange(document.getElementById("policy_"+i+"[check_type]"), "_"+i);
            }
            @endif
        })
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });


        $("#cancel-add").on("click", function(){
            window.location.href = '{{ route('policy_show') }}';
        });

        $("#add-policy").submit(function(e) {
            $('input').removeClass('is-invalid');
            var exec_url ="";
            @if (isset($code))
                exec_url = "{{ route('policy_update') }}";
            @else
                exec_url = "{{ route('policy_store') }}";
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
                        window.location = '{{ route('policy_show') }}';
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
    <script src="/js/policy.js"></script>

@stop
