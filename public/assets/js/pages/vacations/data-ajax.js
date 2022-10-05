"use strict";
// Class definition
var KTDatatableRemoteAjaxVacations = function () {
	// Private functions
	// basic demo
	var demo = function () {
		var datatable = $('#kt_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: BASE_URL + '/vacation/teams-list',
						map: function (raw) {
							// sample data mapping
							let dataSet = raw;
							if (typeof raw.data !== 'undefined') {
								dataSet = raw.data;
							}
							return dataSet;
						},
					},
				},
				pageSize: 10,
				serverPaging: false,
				serverFiltering: false,
				serverSorting: false,
			},

			// layout definition
			layout: {
				scroll: false,
				footer: false,
			},

			// column sorting
			sortable: true,
			pagination: true,
			search: {
				// input: $('#kt_datatable_search_query'),
				// key: 'generalSearch'
			},

			// columns definition
			columns: [
				{
					field: 'fullname',
					title: 'Họ & Tên',
				},
				{
					field: 'date_start',
					title: 'Ngày bắt đầu',
					type: 'date',
					sortable: 'asc',
					template: function (row) {
						return row.date_start ? moment(row.date_start, 'YYYY-MM-DD', true).format('DD/MM/YYYY') : 'N/A';
					},
					// format: 'MM/DD/YYYY',
				},
				{
					field: 'date_end',
					title: 'Ngày kết thúc',
					type: 'date',
					format: 'YYYY-MM-DD',
					template: function (row) {
						return row.date_end ? moment(row.date_end, 'YYYY-MM-DD', true).format('DD/MM/YYYY') : 'N/A';
					}
				},
				{
					field: 'day_of_week',
					title: 'Thứ',
					template: function (row) {
						let dayOfWeek = {
							0: {
								'title': 'Chủ nhật'
							},
							1: {
								'title': 'Thứ 2'
							},
							2: {
								'title': 'Thứ 3'
							},
							3: {
								'title': 'Thứ 4'
							},
							4: {
								'title': 'Thứ 5'
							},
							5: {
								'title': 'Thứ 6'
							},
							6: {
								'title': 'Thứ 7'
							}
						};
						return dayOfWeek?.[row.day_of_week] ? dayOfWeek[row.day_of_week].title : 'N/A';
					}
				},
				{
					field: 'session',
					title: ' Buổi',
					template: function (row) {
						let sessionType = {
							0: {
								'title': 'Buổi sáng',
								'class': ' label-light-info'
							},
							1: {
								'title': 'Buổi trưa',
								'class': ' label-light-primary'
							},
							2: {
								'title': 'Cả ngày',
								'class': ' label-light-success'
							}
						};
						return '<span class="label font-weight-bold label-lg ' + sessionType[row.session].class + ' label-inline">' + sessionType[row.session].title + '</span>'
					}
				},
				{
					field: 'leave_type',
					title: ' Phép năm',
					template: function (row) {
						let leaveType = {
							0: {
								'title': 'Không',
								'class': ' label-light-warning'
							},
							1: {
								'title': 'Có',
								'class': ' label-light-success'
							},
						};
						return '<span class="label font-weight-bold label-lg ' + leaveType[row.leave_type].class + ' label-inline">' + leaveType[row.leave_type].title + '</span>';
					}
				},
				{
					field: 'time_off',
					title: 'Thời gian nghỉ(ngày)',
					type: 'number'
				},
				{
					field: 'reason',
					title: 'Lý do',
					width: 100,
					class: 'ellipsis'
				},
				{
					field: 'url',
					title: 'Kintone URL',
					template: function (row) {
						return row.url ? `<a title="Kintone URL" target="_blank" href="${row.url}">🔗</a>` : 'N/A';
					}
				}
			],

		});

		console.log(datatable.column(0))

		$('#kt_datatable_search_day_of_week').on('change', function () {
			datatable.search($(this).val().toLowerCase(), 'day_of_week');
		});

		$('#kt_datatable_search_session').on('change', function () {
			datatable.search($(this).val().toLowerCase(), 'session');
		});

		$('#kt_datatable_search_query').on('change', function () {
			// datatable.search($(this).val().toLowerCase(), 'fullname');
		});

		let da = '';

		$('#kt_datatable_search_from').on('change', function () {
			// let to = $('#kt_datatable_search_to').val();
			// to = moment(to, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
			da = moment($(this).val(), 'MM/DD/YYYY', true).format('YYYY-MM-DD');
			da = da + '|' + moment($('#kt_datatable_search_to').val(), 'MM/DD/YYYY', true).format('YYYY-MM-DD')
			console.log(da)

			datatable.search(da.toLowerCase(), 'date_start', false, false);
		});

		$('#kt_datatable_search_to').on('change', function () {
			let from = $('#kt_datatable_search_from').val();
			from = moment(from, 'MM/DD/YYYY', true).format('YYYY-MM-DD');

			let to = moment($(this).val(), 'MM/DD/YYYY', true).format('YYYY-MM-DD');

			da = from + '|' + to;
			console.log(da)

			datatable.search(da, 'date_start', false, false);
		});

		$('#kt_datepicker').datepicker({
			todayHighlight: true,
			templates: {
				leftArrow: '<i class="la la-angle-left"></i>',
				rightArrow: '<i class="la la-angle-right"></i>',
			},
		});

		$('#kt_search').on('click', function(e) {
			e.preventDefault();
			var params = {};
			$('.datatable-input').each(function() {
				var i = $(this).data('col-index');
				if (params[i]) {
					params[i] += '|' + $(this).val();
				}
				else {
					params[i] = $(this).val();
				}
			});
			console.log(params)
			$.each(params, function(i, val) {
				datatable.column(i).search(val ? val : '', false, false);
			});
		});

		$('#kt_reset').on('click', function(e) {
			e.preventDefault();
			$('.datatable-input').each(function() {
				$(this).val('');
				console.log($(this))
				datatable.column($(this).data('col-index')).search('', false, false);
			});
			datatable.search();
		});

		$('#kt_datepicker').datepicker({
			todayHighlight: true,
			templates: {
				leftArrow: '<i class="la la-angle-left"></i>',
				rightArrow: '<i class="la la-angle-right"></i>',
			},
		});

		// $('#kt_datatable_search_day_of_week, #kt_datatable_search_session').selectpicker();
	};

	return {
		// public functions
		init: function () {
			demo();
		},
	};
}();

jQuery(document).ready(function () {
	KTDatatableRemoteAjaxVacations.init();
});
