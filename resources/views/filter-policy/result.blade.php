
<style>
    .policy-detail-table {
        border-collapse: collapse;
        font-size: 14px;
    }
    .policy-detail-table th, .policy-detail-table td {
        border: 1px solid #afabab;
        height: 30px;
        padding: 10px;
        min-width: 200px;
    }
    .policy-detail-table th{
        text-align: center;
    }
</style>

@if (FilterPolicy::hasViolation())
    <div class="row">
        <table class="policy-detail-table">
            <thead>
            <tr>
                <th>File</th>
                <th colspan="2">Chi tiết vi phạm</th>
            </tr>
            </thead>
            <tbody>
            <?php $check_policy_result = FilterPolicy::getResultAdapter()["files"];?>
            @foreach ($check_policy_result as $result_key=>$result_value)
                <tr>
                    <td rowspan="{{ count($result_value) }}">
                        {{ $file_data[$result_key]['file_name'] }}
                    </td>
                @foreach ($result_value as $policy_key => $policy_value)
                    @if ($policy_key > 0)
                    <tr>
                    @endif
                    <td>
                        {{ $policy_value['filter_policy_list_name'] }}
                    </td>
                    <td>
                        @if ($policy_value['detail_matches'][0]['check_type'] == 0)
                            {{ $policy_value['detail_matches'][0]['policy_name']  }}
                        @else
                            {{ $policy_value['detail_matches'][0]['policy_name'] . " - " .  $policy_value['detail_matches'][0]['violated_count'] . " Phần tử - Tên tập tin/ dữ liệu"}}
                        @endif
                    </td>
                </tr>
                @endforeach
            @endforeach
            </tbody>
        </table>
    </div>
    <div class="row" style="margin-top: 5px; padding: 20px">
        <span style="padding-right: 5px">Kết quả quá trình:</span>
        @if (FilterPolicy::getLastExecutionMethod() == 1)
            <span class="badge badge-warning">Cấp trên phê duyệt</span>
        @elseif (FilterPolicy::getLastExecutionMethod() == 3)
            <span class="badge badge-danger">Từ chối gửi</span>
        @else
            <span class="badge badge-success">Cho phép gửi</span>
        @endif
    </div>
@else
    <span class="badge badge-success">Không vi phạm policy</span>
@endif
