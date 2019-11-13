function MenuScroller(e) {
    e.preventDefault();
}

$('body').on('touchstart', VertTouchStart);
$('body').on('touchmove', VertTouchMove);

var yPosStart = "";
var xPosStart = "";
var yPosCur = "";
var xPosCur = "";
var menuOpen = false;
var scrollMenu = false;
var scrollAmt = 40;
var isScrolling = false;
var menuOffset = 0;

$(window).on("orientationchange", function () {
    scrollBound = 0;
    scrollBound = ($(window).innerHeight() > scrollLowerLimit) ? 0 : (scrollLowerLimit - $(window).innerHeight());
    menuOpen = false;
    scrollMenu = false;
    scrollBound = ($(window).innerHeight() > scrollLowerLimit) ? 0 : (scrollLowerLimit - $(window).innerHeight());
    $('#panel-02').animate({ 'left': '-=300px' }, 1);
    $('body').off('touchmove', MenuScroller);
    $('#panel-02').off('touchstart', StartTouch);
    $('#panel-02').off('touchmove', MoveTouch);
    $('#panel-02').off('touchend', EndTouch);

    $('#panel-02').on('touchstart', MenuClick);
});

function VertTouchStart(e) {
    yPosStart = e.originalEvent.touches[0].pageY;
    xPosStart = e.originalEvent.touches[0].pageX;

    if (menuOpen == true && xPosStart < 300) {
        scrollMenu = true;
    }
    else if (menuOpen == true) {
        menuOpen = false;
        scrollMenu = false;
        scrollBound = ($(window).innerHeight() > scrollLowerLimit) ? 0 : (scrollLowerLimit - $(window).innerHeight());

        $('#panel-02').animate({ 'left': '-=300px' }, 'slow');
        $('body').off('touchmove', MenuScroller);
        $('#panel-02').off('touchstart', StartTouch);
        $('#panel-02').off('touchmove', MoveTouch);
        $('#panel-02').off('touchend', EndTouch);

        $('#panel-02').on('touchstart', MenuClick);
    }
}

function VertTouchMove(e) {
    yPosCur = e.originalEvent.touches[e.originalEvent.touches.length - 1].pageY;
    xPosCur = e.originalEvent.touches[e.originalEvent.touches.length - 1].pageX;

    if (scrollMenu == false) {
        if ((Math.abs(yPosCur - yPosStart) > 30) && (Math.abs(xPosCur - xPosStart) < 30)) {
            if (yPosCur > yPosStart) {
                //window.scrollBy(0, -1 * scrollAmt);
                yPosStart = yPosCur;
            }
            else if (yPosCur < yPosStart) {
                //window.scrollBy(0, scrollAmt);
                yPosStart = yPosCur;
            }
        }
    }
    else {
        if (Math.abs(yPosCur - yPosStart) > 30) {
            isScrolling = true;
            if (yPosCur > yPosStart) {
                console.log(parseInt($('#panel-02').css('top')));
                if (parseInt($('#panel-02').css('top')) < (0 + menuOffset)) {
                    scrollBound += scrollAmt;
                    $('#panel-02').animate({ 'top': '+=40px' }, 1);
                }
                yPosStart = yPosCur;
            }
            else if (yPosCur < yPosStart) {
                console.log(parseInt($('#panel-02').css('top')));
                if (parseInt($('#panel-02').css('top')) <= (0 + menuOffset) && scrollBound > 0) {
                    scrollBound -= scrollAmt;
                    $('#panel-02').animate({ 'top': '-=40px' }, 1);
                }
                yPosStart = yPosCur;
            }
        }
    }
}

var PanelSlideFlag = false;
var xPosStart = "";
var xPosEnd = "";

$('#panel-button').on('click', MenuClick);

function MenuClick() {
    if (menuOpen == false) {
        menuOpen = true;
        console.log('Open Menu');
        $('#panel-02').css('opacity', '1.0');
        $('#panel-02').css('left', '-300px');
        $('#panel-02').css('top', '0px');
        $('#panel-02').animate({ 'left': '+=300px' }, 'slow');
        menuOffset = window.pageYOffset;
        $('#panel-02').css('top', menuOffset + 'px');

        $('#panel-02').on('touchstart', StartTouch);
        $('#panel-02').on('touchmove', MoveTouch);
        $('#panel-02').on('touchend', EndTouch);

        $('body').on('touchmove', MenuScroller);
    }
}

function StartTouch(e) {
    xPosStart = e.originalEvent.touches[0].pageX;
    yPosStart = e.originalEvent.touches[0].pageY;
    PanelSlideFlag = false;
    isScrolling = false;
}

function MoveTouch(e) {
    PanelSlideFlag = true;
}

function EndTouch(e) {
    xPosEnd = e.originalEvent.changedTouches[e.originalEvent.changedTouches.length - 1].pageX;
    yPosEnd = e.originalEvent.changedTouches[e.originalEvent.changedTouches.length - 1].pageY;
    if (PanelSlideFlag == true && isScrolling == false) {
        if ((xPosStart - xPosEnd) > 60) {
            $('#panel-02').animate({ 'left': '-=300px' }, 'slow');
            $('body').off('touchmove', MenuScroller);
            menuOpen = false;
            scrollMenu = false;
            scrollBound = ($(window).innerHeight() > scrollLowerLimit) ? 0 : (scrollLowerLimit - $(window).innerHeight());
            $('#panel-02').off('touchstart', StartTouch);
            $('#panel-02').off('touchmove', MoveTouch);
            $('#panel-02').off('touchend', EndTouch);
            $('#panel-02').on('touchstart', MenuClick);
        }
        PanelSlideFlag = false;
    }
    PanelSlideFlag = false;
}