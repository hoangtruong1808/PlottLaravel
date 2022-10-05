let language = arrLanguage;
"use strict";
// Class definition
$(document).ready(function (){
    $('[data-toggle="tooltip"]').tooltip();
})
var KTDatatableJsonRemoteDemo = function() {
    // Private functions

    // basic demo
    var demo = function() {
        var datatable = $('#kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                // source: HOST_URL + '/api/?file=datatables/datasource/default.json',
                source: baseURL + 'category/employee-list',
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false ,// display/hide footer
                spinner:{
                    type: 'loader',
                    message: language['loading']
                }
            },

            // column sorting
            sortable: true,

            pagination: true,
            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch'
            },
            translate:{
                records:{
                    noRecords: language['no_data'],
                    processing:language['loading']
                },
                toolbar:{
                    pagination: {
                        item:{
                            info: 'Displaying {{start}} - {{end}} of {{total}} records'
                        }
                    }
                }

            },
            // columns definition
            columns: [
                {
                    field: 'RecordID',
                    title: '#',
                    sortable: 'asc',
                    width: 40,
                    type: 'number',
                    selector: false,
                    textAlign: 'center',
                },
                {
                    field: 'OrderID',
                    title: language['information'],
                    width: 250,
                    autoHide: false,
                    template: function(data) {
                        var user_img = 'background-image:url(\'/files/photo/'+data.avatar+'\')';

                        var output = '';
                        output = '<div class="d-flex align-items-center">\
								<div class="symbol symbol-40 flex-shrink-0">\
									<div class="symbol-label" style="' + user_img + '"></div>\
								</div>\
								<div class="ml-2">\
									<div class="text-dark-75 font-weight-bold line-height-sm">' + data.fullname + '</div>\
									<span  class="font-size-sm text-dark-50 text-hover-primary">' +
                                data.employee_email + '</span>\
								</div>\
							</div>';
                        return output;
                    },
                },
                {
                    field: 'Gender',
                    title: language['gender'],
                    width: 80,
                },
                {
                    field: 'DateOfBirth',
                    title: language['date_of_birth'],
                    // type: 'date',
                    // format: 'MM/DD/YYYY',
                    textAlign: 'right',
                },
                {
                    field: 'Province',
                    title: language['nationality'],
                    width: 180,
                    template: function(data) {
                        var output = '';
                        output = '<div class="d-flex align-items-center">\
								<div class="ml-2">\
									<div class="text-dark-75 font-weight-bold line-height-sm">' + data.Country + '</div>\
									<span  class="font-size-sm text-dark-50 text-hover-primary">' +
                            data.Province + '</span>\
								</div>\
							</div>';
                        return output;
                    },
                },
                {
                    field: 'Education',
                    title: language['certificate']
                },
                {
                    field: 'Position',
                    title: language['POSITION']
                },
                {
                field: 'Actions',
                title: language['action'],
                sortable: false,
                autoHide: false,
                overflow: 'visible',
                template: function(data) {
                    return '\
                        <a href="/admin/users/employee/'+ data.id +'" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="tooltip"  data-placement="top" title="'+language['edit']+'">\
                            <span class="svg-icon svg-icon-md">\
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                        <rect x="0" y="0" width="24" height="24"/>\
                                        <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero"\ transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>\
                                        <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>\
                                    </g>\
                                </svg>\
                            </span>\
                        </a>\
                    ';
                },
            }
            ],

        });

    };

    return {
        // public functions
        init: function() {
            demo();
        }
    };
}();

jQuery(document).ready(function() {
    KTDatatableJsonRemoteDemo.init();
});
