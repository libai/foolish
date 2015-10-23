$('#launch_modal').click(function(ev) {
    ev.preventDefault();
    var modal = $('.overlay').clone();
    $(modal).removeAttr('style');
    $(modal).find('button, .close-button').click(function() {
        $(modal).addClass('transparent');
        setTimeout(function() {
            $(modal).remove();
        }, 1000);
    });

    $(modal).click(function() {
        $(modal).find('.page').addClass('pulse');
        $(modal).find('.page').on('webkitAnimationEnd', function() {
            $(this).removeClass('pulse');
        });
    });
    $(modal).find('.page').click(function(ev) {
        ev.stopPropagation();
    });
    $('body').append(modal);
});