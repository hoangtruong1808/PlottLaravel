"use strict";
var KTDatatablesSearchOptionsAdvancedSearch = function () {
	var minDate, maxDate;
	var filterParams = [];
	$.fn.dataTable.Api.register('column().title()', function () {
		return $(this.header()).text().trim();
	});

	$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

			const dat = $('#kt_daterangepicker_6 .form-control').val();
			const two = dat.split(" - ");

			let min = moment(two[0], 'DD/MM/YYYY');
			let max = moment(two[1], 'DD/MM/YYYY');
			if ($('#kt_daterangepicker_6 .form-control').val() === '') return true;

			// compare from
			let from = moment(data[1], "DD/MM/YYYY");
			let diffFrom = from.diff(min) >= 0;

			// compare to
			let to = moment(data[2], "DD/MM/YYYY");
			let a = to.diff(max);
			let diffTo = to.diff(max) <= 0;

			if (
				(min === null && max === null) ||
				(diffFrom && diffTo)
			) {
				return true;
			}
			return false;
		}
	);


	var initTable1 = function () {
		// begin first table
		var table = $('#kt_datatable').DataTable({
			responsive: true,
			// Pagination settings
			dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
			pageLength: 10,
			language: {
				'lengthMenu': 'Display _MENU_',
			},
			searchDelay: 500,
			processing: true,
			serverSide: false,
			ajax: {
				url: BASE_URL + '/vacation/teams-list',
				type: 'POST',
				data: {
					// parameters for custom backend script demo
					columnsDef: [
						'fullname', 'date_start', 'date_end', 'day_of_week', 'session',
						'leave_type', 'time_off', 'url',],
				},
			},
			columns: [
				{data: 'fullname'},
				{data: 'date_start'},
				{data: 'date_end'},
				{data: 'day_of_week'},
				{data: 'session'},
				{data: 'leave_type'},
				{data: 'time_off'},
				{data: 'reason'},
				{data: 'url'},
			],

			initComplete: function () {
				this.api().columns().every(function () {
					var column = this;

					switch (column.title()) {

					}
				});
			},

			columnDefs: [
				{
					targets: 0,
					title: 'Họ & Tên',
					// width: "200px"
				},
				{
					targets: 1,
					title: 'Ngày bắt đầu',
					render: function (data, type, full, meta) {
						return data ? moment(data, 'YYYY-MM-DD kk:mm:ss', true).format('DD/MM/YYYY kk:mm') : 'N/A';
					}
				},
				{
					targets: 2,
					title: 'Ngày kết thúc',
					render: function (data, type, full, meta) {
						return data ? moment(data, 'YYYY-MM-DD kk:mm:ss', true).format('DD/MM/YYYY kk:mm') : 'N/A';
					}
				},
				{
					targets: 3,
					data: "day_of_week",
					title: 'Thứ',
					type: 'string',
					render: function (data, type, full, meta) {
						const a = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
						return a[data];
					}
				},
				{
					targets: 4,
					title: 'Buổi',
					width: "100px",
					render: function (data, type, full, meta) {
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
						if (typeof sessionType[data] === 'undefined') {
							return data;
						}
						return '<span style="width: 80px" class="label font-weight-bold label-lg ' + sessionType[data].class + ' label-inline">' + sessionType[data].title + '</span>'
					},
				},
				{
					targets: 5,
					width: "200px",
					title: 'Loại nghỉ phép',
					render: function (data) {
						let leaveType = {
							0: {
								'title': 'Ngày nghỉ bù',
								'class': ' label-light-warning'
							},
							1: {
								'title': 'Ngày nghỉ: chúc mừng/chia buồn',
								'class': ' label-light-success'
							},
							2: {
								'title': 'Ngày nghỉ được trả lương',
								'class': ' label-light-warning'
							},
							3: {
								'title': 'Vắng mặt',
								'class': ' label-light-success'
							},
						};
						return '<span style="height: auto" class="label font-weight-bold label-lg ' + leaveType[data].class + ' label-inline">' + leaveType[data].title + '</span>';
					}
				},
				{
					targets: 6,
					title: 'Số ngày nghỉ',
					render: function (data) {
						return `<div class="text-right">${data}</div>`
					}
				},
				{
					targets: 7,
					title: 'Lý do',
					width: "150px",
					render: function (data) {
						return `<p data-toggle="tooltip" title="${data}" class="reason-tooltip ellipsis" style='width: 150px'>${data}</p>`
					}
				},
				{
					targets: 8,
					title: 'Kintone URL',
					render: function (data) {
						return data ? `<a title="Kintone URL" target="_blank" href="${data}">🔗</a>` : 'N/A';
					}
				},
			],
			fnDrawCallback: function (oSettings) {
				$('.reason-tooltip[data-toggle="tooltip"]').tooltip();
			}
		});

		$('#kt_search').on('click', function (e) {
			e.preventDefault();
			minDate = moment($('#kt_datatable_search_from').val(), 'YYYY-MM-DD');
			maxDate = moment($('#kt_datatable_search_to').val(), 'YYYY-MM-DD');

			var params = {};

			$('.datatable-input').each(function () {
				var i = $(this).data('col-index');
				if (params[i]) {
					params[i] += '|' + $(this).val();
				} else {
					params[i] = $(this).val();
				}
			});
			// filterParams = params
			filterParams = params;

			$.each(params, function (i, val) {
				// apply search params to datatable
				table.column(i).search(val ? val : '', false, false);
			});

			table.table().draw();
		});

		$('#kt_reset').on('click', function (e) {
			e.preventDefault();
			$('#kt_datatable_search_from').val('');
			$('#kt_datatable_search_to').val('')
			$('.datatable-input').each(function () {
				$(this).val('');
				table.column($(this).data('col-index')).search('', false, false);
			});


			$("#kt_daterangepicker_6 input[name='date_range']").val('')

			table.table().draw();
		});

		$('#kt_datepicker').datepicker({
			todayHighlight: true,
			templates: {
				leftArrow: '<i class="la la-angle-left"></i>',
				rightArrow: '<i class="la la-angle-right"></i>',
			},
		});

		var start = moment().subtract(29, 'days');
		var end = moment();

		$('#kt_daterangepicker_6').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',
			startDate: start,
			endDate: end,
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
				'This Year': [moment().startOf('year'), moment().endOf('year')],
			}
		}, function (start, end, label) {
			console.log(start, end, label)
			$("#kt_daterangepicker_6 .date_type").val(label)
			$('#kt_daterangepicker_6 .form-control').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
		});

		$('#vacation-download').click(function (e) {
			let formData = $('form#vacation-form-filter').serialize();
			e.preventDefault();  //stop the browser from following
			const url = '/vacation/download?' + formData;
			console.log('url', 'http://192.168.20.27/vacation/download?' + formData)
			window.location.href = url
		})

	};

	return {

		//main function to initiate the module
		init: function () {
			initTable1();
		},

	};

}();

jQuery(document).ready(function () {
	KTDatatablesSearchOptionsAdvancedSearch.init();
});

