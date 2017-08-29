<script>vex.defaultOptions.className = 'vex-theme-os'</script>

<script type="text/javascript">

$(document).ready(function(){

    //warn user before logging out
    $(document).on("click", "#logoutButton", function(){

        vex.dialog.defaultOptions.showCloseButton = true;
        vex.dialog.defaultOptions.escapeButtonCloses = true;
        vex.dialog.defaultOptions.overlayClosesOnClick = true;

        vex.dialog.buttons.YES.text = 'Yes'
        vex.dialog.buttons.NO.text = 'No, thank you!'

        vex.dialog.confirm({
            message: 'Are you sure you want to log out?',
            callback: function (value) {

                if(value == true)
                    window.location = "/logout";

            }
        });

    });


    //warn user before deleting an item
    $(document).on("click", ".delete_form button", function(){

        var but = $(this)

        vex.dialog.defaultOptions.showCloseButton = true;
        vex.dialog.defaultOptions.escapeButtonCloses = true;
        vex.dialog.defaultOptions.overlayClosesOnClick = true;

        vex.dialog.buttons.YES.text = 'Yes'
        vex.dialog.buttons.NO.text = 'No, thank you!'

        vex.dialog.confirm({
            message: 'Are you sure you want to delete this item!?',
            callback: function (value) {

                if(value == true)
                    but.parents("form.delete_form").submit()

            }
        });

    });

});
</script>