<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            'username' => [
                'required',
                'regex:/^[\w][^_\W]{4,20}$/',
                Rule::unique('tbl_user','username')->where(fn ($query) => $query->where('deleted_at', null))->ignore($this->id)
            ],
            'fullname' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('tbl_user','email')->where(fn ($query) => $query->where('deleted_at', null))->ignore($this->id)
            ],
            'phone' => [
                'required',
                'regex:/^0[0-9]{9}$/',
                Rule::unique('tbl_user','phone')->where(fn ($query) => $query->where('deleted_at', null))->ignore($this->id)
            ],
            'password' => 'required_with:password2',
            'password2' => 'required_with:password|same:password'
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Trường này bắt buộc nhập',
            'username.regex' => 'Nhập đúng định dạng',
            'username.unique' => 'Tên đăng nhập tồn tại',
            'fullname.required' => 'Trường này bắt buộc nhập',
            'email.required' => 'Trường này bắt buộc nhập',
            'email.email' => 'Nhập đúng định dạng',
            'email.unique' => 'Email tồn tại',
            'phone.required' => 'Trường này bắt buộc nhập',
            'phone.regex' => 'Nhập đúng định dạng',
            'phone.unique' => 'Số điện thoại tồn tại',
            'password2.same' => 'Mật khẩu mới và mật khẩu nhập lại phải trùng nhau',
            'password2.required_with' => 'Trường này bắt buộc nhập',
            'password.required_with' => 'Trường này bắt buộc nhập',
        ];
    }
}
