/*var timeout, crossover, longtouch;
$('.long-click-handler').css('user-select', 'none')
/*$('.long-click-handler').on('touchstart', function () {
    timeout = setTimeout(function () {
        longtouch = true;
    }, 750);
    crossover = false;
}).on('touchmove', function () {
    crossover = true;
}).on('touchend', function () {
    if (longtouch) {
        if (crossover == false) {
            console.log("Long Press");
            location.href = 'Schedule.html';
        }
    } else {
        console.log("Short Press");
        /*if (history.length === 1) {
            window.location = kwStartUpPage;
        } else {
            history.back();
        }
    }
});

/*var timeout, longtouch;

$(this).mousedown(function () {
    timeout = setTimeout(function () {
        longtouch = true;
    }, 1000);
}).mouseup(function () {
    if (longtouch) {
        alert('long touch');
    } else {
        alert('short touch');

    }
    longtouch = false;
    clearTimeout(timeout);
});*/