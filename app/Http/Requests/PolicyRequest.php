<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'filter_policy_list_name' => 'required',
            'judgment_criteria_value' => 'required_if:judgment_criteria,==,2',
        ];
    }

    public function messages()
    {
        return [
            'filter_policy_list_name' => 'Trường này bắt buộc nhập',
            'judgment_criteria_value' => 'Trường này bắt buộc nhập',
        ];
    }

}
