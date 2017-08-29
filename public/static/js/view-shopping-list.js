$(document).ready(function(){

    $(document).on("click", "div.shopping-list .alert", function(){

        var shopping_list_id = $(this).attr("id");

        //visually show the list that has been chosen
        $("div.shopping-list .alert").removeClass("chosen-alert");
        $(this).addClass("chosen-alert");

        //allow a list item to be created now that a list has been chosen
        $("button.create-item").removeAttr("disabled");
        $("input[name='shopping_list']").val( shopping_list_id );

        //only show the items of the list that has been selected
        $(".shopping-list-items").hide()
        $(".shopping-list-items."+shopping_list_id).show()

        //visually show the name of the list that has been chosen in the list item panel
        $("#list-name").html(  $(this).children("strong").html()  );

        //on a mobile phone, completely hide the list panel and show the list items
        if( $(window).innerWidth() < 768){
            $("#list-items-panel").toggleClass("hidden-xs");
            $("#list-panel").toggle(500);
        }

    });

    //show and hide the shopping list item form when this button is pressed
    $(document).on("click", "#create-shopping-list-item", function(){
        $("#new-item-form").toggle(500);
    });

    $(document).on("click", "#back-to-lists", function(){
        $("#list-items-panel").toggleClass("hidden-xs");
        $("#list-panel").toggle(500);
    });

});