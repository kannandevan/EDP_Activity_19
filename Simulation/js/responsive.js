
/* 
Item : Olabs New Responsive template 
Author : Devanand G
Developed in : 2022 
*/


var fullScreenFlag = false;

$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function () {
    var isFullScreen = document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen || (document.msFullscreenElement != null);
    executeFullScreenEvents();

});

$(window).resize(function () {
    removeTrip();
    if ($(window).width() < 992 && fullScreenFlag == false) {
        setAspectRatio(800, 482, ".sim-body");
    } else if ($(window).width() > 992 && fullScreenFlag == false) {
        $(".sim-body").css({
            width: "90vw",
            height: "90vh"
        })
    } else {
        setAspectRatio(800, 482, ".sim-body");
    }

})

function pauseTrip() {
    if (tripFlag == true) {
        $('.trip-block').hide();
        trip.pause();
    }
}
function resumeTrip() {
    if (trip.isLast()) {
        trip.stop();
    }
    else {
        trip.next();
    }
}


$(document).ready(function () {
    $("#simReset").click(function(){
        $(".sim-alert-overlay").fadeIn();
    })
    $("#simResetCancel").click(function(){
        $(".sim-alert-overlay").fadeOut();
    });
    $("#simResetCancel").click(function(){
        $(".sim-alert-overlay").fadeOut(1000);
    });

    if (window.innerWidth == screen.width && window.innerHeight == screen.height) {

        if (localStorage.getItem('fs') == "true") {
            fullScreenFlag = false;
            executeFullScreenEvents();
        }
    } else {
        if (localStorage.getItem('fs') == "true") {

        } else {
            // applyCss();

        }
    }
    $("#reset,.reset").click(function () {

        window.location.reload();

    });

    var components = getData("#mainDiv");
    if ($(window).width() < 992 && fullScreenFlag == false) {
        setAspectRatio(800, 482, ".sim-body");
    } else if ($(window).width() > 992 && fullScreenFlag == false) {
        $(".sim-body").css({
            width: "800px",
            height: "482px"
        })
    } else {
        fullScreenFlag = false;
        toggleFullScreen();
        setAspectRatio(800, 482, ".sim-body");
    }

    $('.sim-body').show();

    $("#changeScreenBtn").click(function () {
        document.body.style.zoom = 1.0;
        toggleFullScreen();

    });
    // applyCss();


})


function applyCss() {
    componentsData.forEach(function (component) {

        let { id, wP, hP, lP, tP } = component;
        if (wP == "0%" || hP == "0%") {
            if (wP == "0%" && hP == "0%") {
                $(id).css({
                    left: lP,
                    top: tP
                });
            }
            else if (wP == "0%" && hP != wP) {
                $(id).css({
                    height: hP,
                    left: lP,
                    top: tP

                });
            }
            else if (wP != "0%" && hP == "0%") {
                $(id).css({
                    width: wP,
                    left: lP,
                    top: tP

                });
            }
        } else {
            $(id).css({
                width: wP,
                height: hP,
                left: lP,
                top: tP

            });
        }



    });

}






/*
 getData : run this after placing the ui elements(such as images and divs).
 this will return all details (css props ) of every ui elements  inside the canvas .
 save / copy the json object.
  */
var i = 1;
var components = [];
function getData(container, flag) {

    var mainWidth = 562;
    var mainHeight = 337;

    $(container).children().each(function () {
        var FLAG = true;
        if ($(this).attr('id') == "bgCanvas1" || $(this).attr('id') == "bg") {
            FLAG = false;
        }
        else if ($(this).attr('id') && FLAG) {

            var id = "#" + $(this).attr('id');

            var w = $(id).width();
            var h = $(id).height();
            if (w == 0 && h == 0) {
                let { parentWidth, parentHeight } = getDimensionOfParent(id);
                w = parentWidth;
                h = parentHeight;
            }
            var wP, hP;
            var l, t;
            var L, T, lPos, tPos, lS, tS;

            if (flag) {

                let { parentWidth, parentHeight } = getDimensionOfParent(id);
                mainHeight = parentHeight;
                mainWidth = parentWidth;

            }
            if (mainWidth == 0 && mainHeight == 0) {
                mainWidth = $(id).width();
                mainHeight = $(id).height();
            }

            wP = (w / mainWidth) * 100;
            hP = (h / mainHeight) * 100;
            if (id != "#undefined") {
                L = $(id).css("left");
                lPos = L.search("px");
                lS = L.slice(0, lPos);

                l = parseInt(lS);

                T = $(id).css("top");
                tPos = T.search("px");
                tS = T.slice(0, tPos);

                t = parseInt(tS);

                lP = l * 100 / mainWidth;
                tP = t * 100 / mainHeight;
            }


            var component;

            if (flag) {

                component = {
                    id: id,
                    wP: wP + "%",
                    hP: hP + "%",
                    lP: lP + "%",
                    tP: tP + "%",

                };
            }
            else {
                component = {
                    id: id,

                    lP: lP + "%",

                    tP: tP + "%",

                };
            }
            component = {
                id: id,
                wP: wP + "%",
                hP: hP + "%",
                lP: lP + "%",
                tP: tP + "%",

            };
            components.push(component);
            if ($(id).children().length > 0) {
                flag = true;
                getData(id, flag);
            }
        }

    });
    return components;
}

function getDimensionOfParent(id) {
    var width, height;
    width = $(id).parent().width();
    height = $(id).parent().height();
    // console.log(id,width,height);
    var pId = '#' + $(id).parent().attr('id');

    if (width == 0 && height == 0) {
        getDimensionOfParent(pId);

    }


    return { parentWidth: width, parentHeight: height }
}


/* 
This function will return width,height,left,top of any html element  
it works only with ID's 

*/
function getProps(id) {
    let width, height, left, top, offsetLeft, offseTop;

    // if (isExist(id)) {
    width = $(id).width();
    height = $(id).height();
    offsetLeft = $(id).offset().left;
    offseTop = $(id).offset().top;
    left = $(id).position().left;
    top = $(id).position().top;
    // }
    return { width: width, height: height, left: left, top: top, offsetLeft: offsetLeft, offseTop: offseTop }
}
/* getPercentageWRT (Get Percentage with respect to )
this function will return a percentage vallue of first parameter with respect to second parameter
eg: getPercentageWRT(20,120) will return (24/120)*100 = 20 

*/
function getPercentageWRT(a, b) {
    return (a / b) * 100
}


/*
idExist(id);
 Check whether id is exist or not 

 if ID exist this function will return true
 otherwise it will return false

 example of id : #ID_NAME 
 
 */

function isExist(id) {
    if (typeof (id) == "string") {
        idPos = id.search("#");
        id = id.slice(idPos, id.length);
        if ($(id).length == 0) {

            this.flag = false;
            console.error("ID_NOT_EXIST: the id you're searching is missing or not exist");

        }
        else {
            this.flag = true;
        }
    } else {
        this.flag = false;
        console.error("DATA_TYPE_ERROR : the typeOf ID: " + id + " is not string")

    }
    return this.flag;
}





function calculateRatio(num_1, num_2) {
    for (num = num_2; num > 1; num--) {
        if ((num_1 % num) == 0 && (num_2 % num) == 0) {
            num_1 = num_1 / num;
            num_2 = num_2 / num;
        }
    }
    var ratio = {
        wR: num_1,
        hR: num_2
    }
    return ratio;
}


function setAspectRatio(width, height, div) {
    $(".sim-controls").css({
        height: $(".sim-body").height() - $(".sim-head").height() - $(".sim-button").height() - $(".sim-footer").height() + 15 + "px",
    });

    const getratio = calculateRatio(width, height);
    let {
        wR,
        hR
    } = getratio;
    var divWidth = $(div).width();
    var divHeight = $(div).height();

    var hVal, wVal;
    $(div).css({
        width: "100%",
        height: "100vh",
    });




    divHeight = $(div).height();
    divWidth = $(div).width();

    hVal = divWidth * hR / wR;

    $(div).css({
        width: "100%",
        height: hVal + "px"
    });
    if (hVal > divHeight) {
        hVal = "100vh";
        wVal = divHeight * wR / hR;
        $(div).css({
            height: "100vh",
            width: wVal + "px"
        });


    }
    divHeight = $(div).height();

    if (divHeight < $(window).height() && fullScreenFlag) {
        divWidth = $(div).width();
        divHeight = $(div).height();
        $(div).css({
            "top": ($(window).height() - divHeight) / 2 + "px"
        });
    } else {
        $(div).css({
            "top": "0px"
        });
    }



    $('.sim-interactive-area').css({
        "background-size": "14px " + $(".sim-head").height() + "px",
    })


}

function executeFullScreenEvents() {


    fullScreenFlag = !fullScreenFlag;
    // console.log(window.parent.document.body.style.zoom,"HAAAAAAAAAAAAAAA");
    // window.parent.document.body.style.zoom = "100%";
    // document.body.style.zoom = "100%";

    if (fullScreenFlag) {
        localStorage.setItem("fs", fullScreenFlag);
        $("#changeScreenBtn").text("MINIMIZE");
        setAspectRatio(800, 482, ".sim-body");
        $("body").addClass("x-bg-black");
    } else {
        localStorage.removeItem("fs");

        $("body").removeClass("x-bg-black");

        $("#changeScreenBtn").text("MAXIMIZE");

        if ($(window).width() < 992 && fullScreenFlag == false) {
            setAspectRatio(800, 482, ".sim-body");
        } else if ($(window).width() > 992 && fullScreenFlag == false) {
            $(".sim-body").css({
                width: "800px",
                height: "482px"
            })
        } else {
            setAspectRatio(800, 482, ".sim-body");
        }

    }

}


function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        localStorage.setItem("fs", "true");
        requestFullScreen.call(docEl);

    } else {
        localStorage.removeItem("fs");
        cancelFullScreen.call(doc);

    }
}



