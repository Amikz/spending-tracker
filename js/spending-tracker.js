$(document).ready(function() {

    $('.categoryBudget').hide();
    $('#setCategoryBudget').click(function() {
        $('.categoryBudget').toggle();

        if($(this).is(":checked")) {
            $('.addEditCategories').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
        } else {
            $('.addEditCategories').css('grid-template-rows', 'repeat(3, [inputField] max-content) [buttons] auto [end]');
        }
    });

    //$('.addEditCategories').hide();
});