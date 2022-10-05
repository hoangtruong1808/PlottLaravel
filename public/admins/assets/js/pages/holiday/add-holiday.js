// Class definition

var KTBootstrapDaterangepicker = function () {

    // Private functions
    var demos = function () {

        // minimum setup
        $('#holiday-range').daterangepicker({
            // startDate: $(this).val(),
            // endDate: $(this).val(),
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-dark',
            // minDate: moment().startOf('day'),
            // startDate: new Date(),
            // endDate: moment().startOf('day'),
            autoUpdateInput: false,
            locale: {
                cancelLabel: arrDatas['clear'],
                format: 'DD/MM/YYYY',
                applyLabel:arrDatas['save'],
            }
        });

        $('#holiday-range').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        });

        $('#holiday-range').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });

        // if($('#holiday-range').val() == '')
    }

    return {
        // public functions
        init: function() {
            demos();
        }
    };
}();

jQuery(document).ready(function() {
    KTBootstrapDaterangepicker.init();
});
$("#cancel-add").on("click", function(){
    window.history.go(-1);
});