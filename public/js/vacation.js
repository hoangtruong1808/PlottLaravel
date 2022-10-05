$(document).ready(function () {

	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": true,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};


	if ($('form#vacation') != null) {
		/*custom validate end date*/
		const greaterThanDateFunc = function () {
			return {
				validate: function (input) {
					let start = moment($('[name=date_start]').datepicker('getDate'));
					let end = moment($('[name=date_end]').datepicker('getDate'));
					if (end.diff(start) < 0) {
						return {
							valid: false,
							message: `Date must be greater than ${start.format('DD/MM/YYYY')}`,
						};
					}

					return {
						valid: true,
					};
				},
			};
		};
		// hande validators
		FormValidation.validators.greaterThanDate = greaterThanDateFunc;


		// Validation Rules
		let validator = FormValidation.formValidation(
			document.getElementById('vacation'),
			{
				fields: {
					day_of_week: {
						validators: {
							notEmpty: {
								message: 'Day is required'
							},
							choice: {
								min: 0,
								max: 6,
								message: 'Please select at least 0 and maximum 6 options'
							}
						}
					},
					// session: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: 'Session is required'
					// 		},
					// 	}
					// },
					date_start: {
						validators: {
							notEmpty: {
								message: 'Ngày BẮT ĐẦU là bắt buộc'
							},
							callback: {
								message: 'Giờ BẮT ĐẦU phải là 8:00 hoặc 13:00',
								callback: function (input) {
									if (!input.value) return true;
									const startHour = $('#hour_start').val();
									const startHoursAllow = [8,13];
									return startHoursAllow.includes(+startHour)
								},
							},
						}
					},
					date_end: {
						validators: {
							notEmpty: {
								message: 'Ngày KẾT THÚC là bắt buộc'
							},
							callback: {
								message: 'Giờ KẾT THÚC phải là 12:00 hoặc 17:00',
								callback: function (input) {
									if (!input.value) return true;
									const endHour = $('#hour_end').val();
									const endHoursAllow = [12,17];
									return endHoursAllow.includes(+endHour)
								},
							},
						},

					},
					hour_end: {
						different: {
							compare: function () {
								return document.getElementById('vacation').querySelector('[name="hour_start"]').value;
							},
							message: 'Giờ bắt đầu và giờ kết thúc không được giống nhau',
						},
					},
					leave_type: {
						validators: {
							notEmpty: {
								message: 'Type of leave is required'
							},
						}
					},
					reason: {
						validators: {
							notEmpty: {
								message: 'Reason is required'
							},
							stringLength: {
								max: 200,
								message: 'Lý do phải dưới 200 ký tự',
							},
						}
					},
					url: {
						validators: {
							notEmpty: {
								message: 'URL is required'
							},
							uri: {
								allowLocal: true,
								message: 'Invalid URL'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					submitButton: new FormValidation.plugins.SubmitButton(),
					bootstrap: new FormValidation.plugins.Bootstrap({
						eleInvalidClass: '',
						eleValidClass: '',
					})
				}
			}
		).on('core.form.valid', function () {
			let submitBtn = $('form#vacation button[type=submit]');
			submitBtn.prop('disabled', 'disabled');
			let data = $('form#vacation').serializeArray();
			let rs = {};
			data.forEach((elm) => {
				if (elm.name === 'day_of_week') return;
				let value = elm.value;
				if (elm.name.indexOf('date') !== -1) {
					value = moment(value, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
				}
				rs[elm.name] = value;
			});
			// Send the form data to back-end
			// You need to grab the form data and create an Ajax request to send them
			$.ajax({
				url: '/vacation/register',
				type: 'POST',
				dataType: 'json',
				data: {data: rs},
				success: function (response) {
					// alert message here;

					if (response.status)
						toastr.success(response.message, "Thông báo");
					else
						toastr.error(response.message, "Thông báo");

					// reset form
					$('form#vacation').trigger("reset");
					clearDateStartAnDateEnd();
				},
			}
			).done(function (response) {
				submitBtn.removeAttr('disabled');
				if(response['result_id']){
					$.ajax({
						url: '/vacation/send-notification',
						type: 'POST',
						dataType: 'json',
						data: {response: response},
						success: function (response) {

						},
					})
				}
			});
		});

		// Datepicker handle
		// $('input.datepicker').datepicker({
		//     todayHighlight: true,
		//     format: 'dd/mm/yyyy',
		//     templates: {
		//         leftArrow: '<i class="la la-angle-left"></i>',
		//         rightArrow: '<i class="la la-angle-right"></i>'
		//     },
		//     autoclose: true,
		//     clearBtn: true
		// }).on('changeDate', function (e) {
		//     let target = $(e.target).prop('name');
		//     if (target.indexOf('date_start') !== -1) {
		//         // Setter: change min option
		//         let currentDate = $(this).val();
		//         let session = $("input[name=session]").val();
		//         if (session !== '2' && currentDate !== '') {
		//             $("input[name=date_end]").datepicker("setDate", currentDate);
		//         }
		//         $("input[name=date_end]").datepicker("setStartDate", currentDate);
		//     }
		//     // Revalidate field
		//     validator.revalidateField(target);
		// });

		$('#kt_vacation_from_date_start').change(function () {
			const day = $(this).val();
			const dayStart = moment(day, 'DD-MM-YYYY').days();
			const dayOfWeekText = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

			// $('input:radio[name="day_of_week"]').filter(`[value="${dayOfWeek}"]`).prop('checked', true);
			const dayEnd = $('#kt_vacation_from_date_end').val();
			const dayEndParse = moment(dayEnd, 'DD-MM-YYYY').days();

			$('input[name="day_of_week"]').val(dayStart);

			$('#date_start_parse').text(" " + dayOfWeekText[dayStart] + " • " + day);
			$('#date_end_parse').text(dayOfWeekText[dayEndParse] + " • " + dayEnd);

			const a = moment(day, 'DD-MM-YYYY')
			const b = moment(dayEnd, 'DD-MM-YYYY')
			const amountDays = b.diff(a, 'days') + 1; //include the day start
			$('#date_count').text("Tổng: " + amountDays + ' ngày');
		})

		$('#kt_vacation_from_date_end').change(function () {
			const dateStart = $('#kt_vacation_from_date_start').val();
			const dateStartConvert = moment(dateStart, 'DD-MM-YYYY').days();

			const dayEnd = $(this).val();
			const dateEndConvert = moment(dayEnd, 'DD-MM-YYYY').days();
			const dayOfWeekText = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

			// $('input:radio[name="day_of_week"]').filter(`[value="${dayOfWeek}"]`).prop('checked', true);

			$('#date_start_parse').text(" " + dayOfWeekText[dateStartConvert] + " • " + dateStart);
			$('#date_end_parse').text(dayOfWeekText[dateEndConvert] + " • " + dayEnd);

			const a = moment(dateStart, 'DD-MM-YYYY')
			const b = moment(dayEnd, 'DD-MM-YYYY')
			const amountDays = b.diff(a, 'days') + 1; //include the day start
			$('#date_count').text("Tổng: " + amountDays + ' ngày');
		})

		$("input[name=session]").on('change', function (e) {
			let selected = $(this).val();
			let tartDateStart = $("input[name=date_start]").val();
			if (selected !== '2' && tartDateStart !== '') {
				console.log(tartDateStart)
				$("input[name=date_end]").datepicker("setDate", tartDateStart);
			}
		});

		$('#kt_datepicker').datepicker({
			todayHighlight: true,
			format: 'dd/mm/yyyy',
			templates: {
				leftArrow: '<i class="la la-angle-left"></i>',
				rightArrow: '<i class="la la-angle-right"></i>',
			},
		});

		$('input[name="applying_after"]').change(function () {
			if ($(this).prop('checked')) {
				loadDayOffRangePicker();
			} else {
				const now = moment();
				const date_start = moment($('#date_start').val(), 'DD/MM/YYYY');
				const isSmallerNow = now.diff(date_start, 'days');

				if (isSmallerNow) {
					clearDateStartAnDateEnd();
				}
				loadDayOffRangePicker({minDate: moment().format('DD/MM/YYYY')})
			}
		});
		
		function loadDayOffRangePicker(additionalOptions) {
			const option = {
				buttonClasses: ' btn',
				applyClass: 'btn-primary',
				cancelClass: 'btn-secondary',
				timePicker: true,
				timePicker24Hour: true,
				timePickerIncrement: 60,
				locale: {
					format: 'DD/MM/YYYY kk:mm'
				},
			}
			$('#kt_daterangepicker_4').daterangepicker({...option, ...additionalOptions}, handleDateRangePicker);
		}

		loadDayOffRangePicker({minDate: moment().format('DD/MM/YYYY')});

		function handleDateRangePicker(start, end, label) {
			const startHour = start.hour();
			const endHour = end.hour();

			$('#hour_start').val(startHour);
			$('#hour_end').val(endHour);

			const startHoursAllow = [8,13];
			if (!startHoursAllow.includes(startHour)) {
				console.error('startHour ko hop le');
			}

			const endHoursAllow = [12,17];
			if (!endHoursAllow.includes(endHour)) {
				console.error('endHour ko hop le');
			}

			if (startHour === endHour) {
				console.error('startHour ko duoc bang endHour');
			}


			let a = 0;
			if (Number(startHour) >= 12) {
				a += 0.5
			}

			if (Number(endHour) <= 12) {
				a += 0.5
			}

			const startConvert = start.format('DD/MM/YYYY');
			const endConvert = end.format('DD/MM/YYYY');
			const b = moment(startConvert, 'DD/MM/YYYY');
			const c = moment(endConvert, 'DD/MM/YYYY');
			const amountDays = c.diff(b, 'days') + 1; //include the day start

			$('#date_start').val(start.format('DD/MM/YYYY'));
			$('#date_end').val(end.format('DD/MM/YYYY'));

			const total = amountDays - a
			console.log(amountDays + ' trừ đi ' + a + ' = ' + total);

			let session = Number(startHour) < 12 ? 0 : 1;
			if (total >= 1) {
				session = 2;
			}


			let html = 'Bắt đầu vắng từ ' + '<span class="label font-weight-bold label-lg label-light-info label-inline">'+ start.format('kk:mm DD/MM/YYYY') +'</span>';
			html += ' <i class="ki ki-long-arrow-next icon-sm"></i> ';
			html += '<span class="label font-weight-bold label-lg label-light-info label-inline">'+ end.format('kk:mm DD/MM/YYYY') +'</span>';
			html += ' = '
			html += ' <span class="label font-weight-bold label-lg label-light-success label-inline">'+ total +' ngày</span>';

			$('#kt_daterangepicker_4 #datetime_summarize').html(html);

			$('#time_off').val(total);
			$('#session').val(session);

			validator.revalidateField('date_start');
			validator.revalidateField('date_end');
			// validator.revalidateField('hour_start');
			validator.revalidateField('hour_end');
		}

		function clearDateStartAnDateEnd() {
			$('.daterangepicker .cancelBtn').click();
			$('#kt_daterangepicker_4 #datetime_summarize').html('Vui lòng chọn ngày bắt đầu và kết thúc');
			$('#hour_start').val('');
			$('#hour_end').val('');
			$('#date_start').val('');
			$('#date_end').val('');
			$('#time_off').val('');
			$('#leave_type').selectpicker("refresh");
		}
	}
});


const PlotAppsVacationListDatatable = function () {
	// Private functions
	const INIT_DATE_FORMAT = 'DD/MM/YYYY';
	const DATE_RANGE_TYPE = {
		TO_DAY: 'Hôm nay',
		THIS_MONTH: 'Tháng này',
		NEXT_MONTH: 'Tháng này',
		PREV_MONTH: 'Tháng này',
		THIS_YEAR: 'Năm nay',
	}
	const formFilter = getFormFilter();

	function getFormFilter() {
		const dateRangePickerTitle = $('#kt_dashboard_daterangepicker #kt_dashboard_daterangepicker_title');
		const dateRangePickerDate = $('#kt_dashboard_daterangepicker #kt_dashboard_daterangepicker_date');
		const monthsButtonList = $('#month_list');

		let date_start, date_end, export_type, months, month_select = '';
		const formData = {
			date_start, date_end, export_type, months, month_select
		}

		function init() {
			const local = JSON.parse(localStorage.getItem('kt_datatable-1-meta'));
			if (local && local.date_start !== undefined) {
				set('date_start', local.date_start);
				set('date_end', local.date_end);
				set('export_type', local.export_type);
				set('months', local.months);
				set('month_select', local.month_select);

			} else {
				export_type = DATE_RANGE_TYPE.THIS_MONTH;
				date_start = getMonthOfPlot('current-start').format(INIT_DATE_FORMAT);
				date_end = getMonthOfPlot('current-end').format(INIT_DATE_FORMAT);
				set('date_start', date_start);
				set('date_end', date_end);
				set('export_type', export_type);
			}
			return formData;
		}

		function set(key, value) {
			formData[key] = value;
			handleDisplayHtml();
		}

		function get(key = null) {
			if (key === null) {
				return formData;
			}

			return (formData[key] !== undefined) ? formData[key] : false;
		}

		function handleDisplayHtml() {
			monthsButtonList.toggleClass('d-none', formData.export_type !== DATE_RANGE_TYPE.THIS_YEAR);

			dateRangePickerTitle.text(formData.export_type + ':');
			dateRangePickerDate.text(get('date_start') + ' -> ' + get('date_end'));
		}

		return {
			init,
			set,
			get
		}
	}


	function formData() {
		let forms = {
			date_start: '', date_end: '', export_type: '', months: ''
		}

		function getFormData() {
			forms = {
				date_start: $('input[name="date_start"]').val(),
				date_end: $('input[name="date_end"]').val(),
				export_type: $('input[name="export_type"]').val(),
				months: $('input[name="months"]').val(),
			}
			return forms;
		}

		function setParams(key, value) {
			forms[key] = value;
			$(`input[name="${key}"]`).val(value)

		}

		return {
			getData: getFormData,
			setParams: setParams
		}
	}

	const form = formData();

	const _datatable = function () {
		const datatable = $('#kt_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: '/vacation/personal-list',
						params: formFilter.get()
					},
				},
				pageSize: 10, // display 20 records per page
				serverPaging: false,
				serverFiltering: false,
				serverSorting: false,
			},

			// layout definition
			layout: {
				scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
				footer: false, // display/hide footer
			},

			// column sorting
			sortable: true,

			pagination: true,

			search: {
				input: $('#kt_subheader_search_form'),
				delay: 400,
				key: 'generalSearch'
			},

			// columns definition
			columns: [
				{
					field: 'vacation_id',
					title: '#',
					sortable: false,
					width: 20,
					type: 'number',
					selector: false,
					textAlign: 'left',
					template: function (data, index, row) {
						const idx = 1 + index;
						return '<span class="d-flex text-muted w-100">' + idx + '</span>';
					}
				}, {
					field: 'fullname',
					title: 'Tên',
					// width: 100,
					template: function (data) {
						return '<div class="text-dark-75 font-weight-bolder font-size-lg mb-0">' + data.fullname + '</div>'
					}
				}, {
					field: 'date_start',
					title: 'Ngày nghỉ',
					width: 200,
					type: 'date',
					format: 'YYYY/MM/DD',
					template: function (data) {
						let states = [
							'danger',
							'danger',
							'danger',
						];
						const index = data.time_off <= 1 ? 0 : 1;
						let state = states[index];

						return '<div class="d-flex align-items-center">\
								<div class="symbol symbol-40 symbol-' + state + ' flex-shrink-0">\
									<span data-toggle="tooltip" title="Tổng số ngày nghỉ ' + data.time_off + '" class="cell_time_off symbol-label font-size-h4 font-weight-bold">' + data.time_off + '</span>\
								</div>\
								<div class="ml-4">\
									<div data-toggle="tooltip" title="Ngày bắt đầu văng" class="text-dark-75 font-size-lg mb-0 cell-date">' + data.date_start_convert + '</div>\
									<div data-toggle="tooltip" title="Ngày kết thúc vắng" class="text-dark-75 font-size-lg mb-0 cell-date">' + data.date_end_convert + '</div>\
								</div>\
							</div>';
					}
				}, {
					field: 'session',
					title: 'Buổi',
					width: 70,
					template: function (row) {
						const day_of_week = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
						const session_type = {
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

						let output = '';
						output += '<div class="font-weight-bolder font-size-lg mb-0">' + day_of_week[row.day_of_week] + '</div>';
						output += '<div class="font-weight-bold text-muted">' + session_type[row.session].title + '</div>';
						return output;
					}
				}, {
					field: 'leave_type',
					title: 'Loại nghỉ phép',
					// callback function support for column rendering
					template: function (row) {
						let status = {
							0: {'title': 'Nghỉ bù', 'class': ' label-outline-warning'},
							1: {'title': 'Chúc mừng', 'class': ' label-outline-primary'},
							2: {'title': 'Được trả lương', 'class': ' label-outline-info'},
							3: {'title': 'Vắng mặt', 'class': ' label-outline-success'},
						};
						return '<span class="w-100 h-100 label label-lg font-weight-bold ' + status[row.leave_type].class + ' label-inline">' + status[row.leave_type].title + '</span>';
					},
				}, {
					field: 'reason',
					title: 'Lý do',
					template: function (row) {
						return '<div class="text-ellipsis cell-detail" data-toggle="tooltip" title="' + row.reason + '">' + row.reason + '</div>'
					},
				}, {
					field: 'url',
					title: 'Kintone',
					width: 80,
					template: function (row) {
						return '<a data-toggle="tooltip" target="_blank" class="d-block text-center nav-link" title="' + row.url + '" href="' + row.url + '"><i class="flaticon2-clip-symbol icon-lg text-hover-primary"></i></a>'
					}
				},
			],

			rows: {
				afterTemplate: function (row) {
					$(row).find('.cell_time_off').tooltip();
					$(row).find('.cell-detail').tooltip();
					$(row).find('.cell-date').tooltip();
				},
			}
		});

		$('#vacation_datatable_search_input').on('keyup', function () {
			datatable.search($(this).val().toLowerCase(), 'fullname');
		});

		$('#kt_dashboard_daterangepicker').daterangepicker({
			ranges: {
				'Hôm nay': [moment(), moment()],
				'7 ngày trước': [moment().subtract(6, 'days'), moment()],
				'Tháng này': [getMonthOfPlot('current-start'), getMonthOfPlot('current-end')],
				'Tháng trước': [getMonthOfPlot('prev-start'), getMonthOfPlot('prev-end')],
				'Tháng tới': [getMonthOfPlot('next-start'), getMonthOfPlot('next-end')],
				'Năm nay': [moment().startOf('year'), moment().endOf('year')],
			}
		}, function (start, end, label) {
			formFilter.set('date_start', start.format(INIT_DATE_FORMAT))
			formFilter.set('date_end', end.format(INIT_DATE_FORMAT))
			formFilter.set('export_type', label)
			formFilter.set('months', label === DATE_RANGE_TYPE.THIS_YEAR ? 'all' : '');

			reloadData()
		});

		function reloadData() {
			const forms = formFilter.get();
			for (const index in forms) {
				datatable.setDataSourceParam(index, forms[index]);
			}
			datatable.load();
		}

		$('#btn-export').click(function () {
			const params = new URLSearchParams(formFilter.get());
			window.location.href = '/vacation/export?' + params.toString()
		});

		$('select.month-select-picker').change(function () {
			const selectType = $(this).val();
			formFilter.set('month_select', selectType);
			switch (selectType) {
				case 'all':
					$(`[data-month]`).addClass('active');
					formFilter.set('months', 'all');
					break;
				case 'only-one':
					$(`[data-month]`).removeClass('active');

					const oldMonths = "" + formFilter.get('months');
					if (oldMonths === 'all') {
						const firstMonth = $(`[data-month]`)[0];
						$(firstMonth).addClass('active');
						formFilter.set('months', $(firstMonth).data('month'))
					} else if (oldMonths.search(',') !== -1) {
						const oldMonthsConvert = oldMonths.split(',');
						let first = oldMonthsConvert[0]
						formFilter.set('months', first)
						$(`[data-month="${first}"]`).addClass('active');
					} else {
						$(`[data-month="${oldMonths}"]`).addClass('active');
					}

					break;
				case 'multiple':
					const months = formFilter.get('months').toString();
					let newMonths = [];
					if (months === 'all') {
						$(`[data-month]`).each(function () {
							newMonths.push($(this).data('month'));
							formFilter.set('months', newMonths.join(','))
						})
						break;
					}

					if (months.search(',') !== -1) {
						const monthsConvert = months.split(',');
						for (let i in monthsConvert) {
							$(`[data-month="${monthsConvert[i]}"]`).addClass('active');
						}
					}
					break;
			}
			reloadData();
		})

		$('#month_list li button.btn-months').click(function (e) {
			e.preventDefault();

			if ($(this).hasClass('.active')) {
				return;
			}

			const month = $(this).data('month');
			const selectType = $('select.month-select-picker').val();
			switch (selectType) {
				case 'all':
					return;
				case 'only-one':
					$(`[data-month]`).removeClass('active');
					$(this).addClass('active');
					formFilter.set('months', month);
					break;
				case 'multiple':
					$(this).addClass('active');
					let oldMonths = ""+formFilter.get('months');
					if (oldMonths.search(month) === -1) {
						oldMonths += ',' + month;
					}

					formFilter.set('months', oldMonths);
					break;
			}

			reloadData();
		});

		return datatable;
	};


	function getMonthOfPlot(type, format = 'DD/MM/YYYY') {
		const dateStartMonth = 16;
		const dateEndMonth = 15;

		function get(date, type = 'start') {
			const d = type === 'start' ? dateStartMonth : dateEndMonth
			return moment(`${d}/${date.format('MM')}/${date.format('YYYY')}`, format);
		}

		switch (type) {
			case 'current-start':
				const prevMonth = moment().subtract(1, 'month');
				return get(prevMonth);
			case 'current-end':
				return get(moment(), 'end');
			case 'prev-start':
				return get(moment().subtract(2, 'month'));
			case 'prev-end':
				return get(moment().subtract(1, 'month'), 'end');
			case 'next-start':
				return get(moment());
			case 'next-end':
				return get(moment().subtract(-1, 'month'), 'end');
		}
	}

	return {
		// public functions
		init: function () {
			const a = formFilter.init()
			_datatable();
			setTimeout(function () {
				$('select.month-select-picker').val(formFilter.get('month_select')).change();
			}, 500)
		},
	};
}();

jQuery(document).ready(function () {
	PlotAppsVacationListDatatable.init();
});