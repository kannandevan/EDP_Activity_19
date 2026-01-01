var dropValue = 0;
var dropScore = 0;
let dropStartTime = null;
let timeTaken = 0;
let bonusGiven = false;
var droppedCount = 0;
var Phase2allcorrect = false;
let selectionQueue = [];
const quizData = [
  {
    question:
      "Your parents are concerned and ask you to take a government job instead of launching your online service idea.",
    options: [
      {
        text: "I’ll discuss my plan with them and show my research",
        score: 10,
        feedback: "Great! Transparent communication builds trust",
      },
      {
        text: "I’ll drop the idea to avoid conflict",
        score: 0,
        feedback: "Avoiding conflict is easy, but growth needs courage",
      },
      {
        text: "I’ll go ahead in secret and tell them later",
        score: -2,
        feedback: "Keeping secrets may lead to bigger problems",
      },
    ],
  },
  {
    question:
      "You’ve got your plan ready, but suddenly you feel unsure if it will work",
    options: [
      {
        text: "Let me start small and test the waters",
        score: 10,
        feedback: "Smart thinking! Small steps lead to big wins",
      },
      {
        text: "I think I’ll wait until I’m fully confident",
        score: 5,
        feedback: "Preparation is good, but don't let doubt delay you",
      },
      {
        text: "I can’t do this anymore",
        score: 0,
        feedback: "Don’t let fear block your dream. You’re not alone!",
      },
    ],
  },
  {
    question:
      "You keep thinking about everything that could go wrong—what if you lose money, what if no one buys, what if…?",
    options: [
      {
        text: "Let me create a backup plan in case things go wrong",
        score: 10,
        feedback: "Backup plans reduce fear. Well done!",
      },
      {
        text: "I’ll keep planning and wait for the perfect time",
        score: 5,
        feedback: "There’s no such thing as the perfect time.",
      },
      {
        text: "There are too many risks. I’ll drop the idea",
        score: 0,
        feedback: "Risk is part of the journey. Learn and improve.",
      },
    ],
  },
];

// Final section

const correctProfiles = ["Riya", "Salma"]; // correct teammate choices

const feedbackData = {
  Riya: "Riya’s creativity and teamwork is a great asset!",
  Aryan: "Skills matter, but collaboration is key.",
  Salma: "Reliability and willingness to learn are crucial!",
  Rahul: "Leadership is good, but dominating isn't teamwork.",
};
const imageData = {
  Riya: "images/level5/ICON1.png",
  Aryan: "images/level5/ICON3.png",
  Salma: "images/level5/ICON2.png",
  Rahul: "images/level5/ICON4.png",
};

// --- LIMIT SELECTION TO 2 ---
$(".QuestionRadiobtnfinal").on("change", function () {
  let selected = $(".QuestionRadiobtnfinal:checked");

  if (selected.length > 2) {
    this.checked = false; // prevent selecting more than 2
    return;
  }
});

const MAX_SELECTION = 3;
const MAX_SCORE = 20;

// Feedback messages
const feedbackMessages = {
  positive: {
    "I believe in my idea.":
      "Believing in your idea is the first step to success!",
    "I will start small and grow.": "Exactly! Starting small is smart.",
    "I will learn from my mistakes.": "Mistakes are the best teachers!",
  },
  negative: {
    "I’m not good enough.":
      "Don't be harsh on yourself. Every entrepreneur learns along the way!",
    "Others are better than me.":
      "Comparison steals your joy. Focus on your journey.",
    "I might as well give up now.":
      "Every challenge is an opportunity. Don’t give up!",
  },
};

// GLOBAL VARIABLES
let currentQuestion = 0;
let totalScore = 0;

// Scene 2

const correctOrder = {
  1: "scene3orderimg4", // Identify the business idea
  2: "scene3orderimg5", // Research the market
  3: "scene3orderimg1", // Create a business plan
  4: "scene3orderimg3", // Arrange funding and team
  5: "scene3orderimg2", // Launch business
};

let draggedTile = null;

// scene 2 ends
$(document).ready(function () {
  // FourthPhase();
  // FinalStage();

  // thirdPhaseArea();
  // Second screen working dumb
  // SecondPhaseshuffledrag();
  $("#PhaseTwoStarting").click(function () {
    $(this).fadeOut();
    $(".sectionfinalMessage").hide();
    $(".starBlinking").fadeIn();
    $(".starBlinking").fadeOut(1500);
    $(".theStopper").fadeTo(500, 0.3, function () {
      $(this).css("display", "none");
    });

    setTimeout(() => {
      $(".secondScreen").hide();
      $(".ThirdScreen").fadeIn();
      $("#SecondVideo").fadeIn();
      $(".personWalking").hide();
      var video = $("#SecondVideo").get(0); // Get the video element
      video.play();
      video.onended = function () {
        secondPhaseStart();
      };
    }, 1300);
  });

  // ends here

  responsiveVoice.cancel();

  // Welcome to The Hurdle Race to Entrepreneurship! You're about to go on a fun journey where you’ll help an aspiring entrepreneur overcome 5 common barriers that every young business founder faces.Are you ready to run the race? Let’s begin!
  // responsiveVoice.speak(".", "UK English Male", {
  //   rate: 0.9,
  //   pitch: 1.1,
  //   onend: function () {
  //     $("#firstButton").fadeIn();
  //   },
  // });

  $("#firstButton").click(function () {
    $(this).fadeOut();
    $(".welcomewindow").fadeOut();
    $("#Mainbg").fadeOut();
    $(".standingMan").fadeOut();
    $(".firstVideotag").fadeIn();
    var video = $("#FirstVideo").get(0); // Get the video element
    video.play();
    video.onended = function () {
      //   $("#Firstbutton").fadeIn();
      $(".firstPage").hide();
      $(".secondScreen").fadeIn();

      responsiveVoice.speak(
        "Understand the importance of matching appropriate resources for a startup based on its type",
        "UK English Male",
        {
          rate: 0.9,
          pitch: 1.1,
          onend: function () {
            $("#secondButton").fadeIn();
          },
        }
      );

      setTimeout(function () {
        // $("#secondButton").fadeIn();
      }, 1500);

      $("#secondButton").click(function () {
        $(this).fadeOut();
        $(".secondScreenIntro").fadeOut();
        $(".secondScreenWelcomeimage").css("display", "flex");
        responsiveVoice.speak("Start a Tailoring Business", "UK English Male", {
          rate: 0.9,
          pitch: 1.1,
          onend: function () {
            $("#thirdButton").fadeIn();
          },
        });
        $("#thirdButton").click(function () {
          $(this).fadeOut();
          responsiveVoice.speak(
            "Drag and drop correct icons into the Startup Basket",
            "UK English Male",
            {
              rate: 0.9,
              pitch: 1.1,
              onend: function () {},
            }
          );
          $(".dragaNddropGameobjet").css("display", "flex");
          $(".secondScreenWelcomeimage").hide();
          // Start the main simulation or next part here
          // For example, you can show the game screen or load the next level

          DragElement("#firstIcon", "", "", 0, 0, 9, 16);
          DragElement("#secondIcon", "", "", 0, 0, 8, 56);
          DragElement("#thirdIcon", "", "", 0, 0, 34, 4);
          DragElement("#fourthIcon", "", "", 0, 0, 75, 54);
          DragElement("#fifthIcon", "", "", 0, 0, 55, 0);
          DragElement("#sixthIcon", "", "", 0, 0, 75, 3);

          // $(".DropareaFirst").droppable({
          //   drop: function (event, ui) {
          //     var droppedItemId = ui.draggable.attr("id");
          //     console.log("Dropped item ID:", droppedItemId);
          //     dropValue++;
          //     console.log("Drop Value:", dropValue);
          //      if (dropStartTime === null) {
          //       dropStartTime = new Date().getTime();
          //       console.log("Timer started");
          //     }
          //     if (dropValue == 3) {
          //       $("#PhaseOnesubmit").fadeIn();

          //       const dropEndTime = new Date().getTime();
          //       const timeTaken = (dropEndTime - dropStartTime) / 1000; // in seconds
          //       console.log("Time taken to drop 3 items:", timeTaken, "seconds");

          //     }

          //     $("#PhaseOnesubmit").click(function () {
          //       if (timeTaken <= 30){
          //         dropScore = dropScore + 5; // Bonus for completing quickly
          //       }
          //       alert("Your Score: " + dropScore + " out of 15");
          //     });

          //     console.log("Drop Score before:", dropScore);
          //     // Correct one
          //     if (droppedItemId === "firstIcon") {
          //       dropScore = dropScore + 5;
          //       $(".firstIcon").animate(
          //         { left: "42%", top: "64%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(347deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     } else if (droppedItemId === "fourthIcon") {
          //       dropScore = dropScore + 5;
          //       $(".fourthIcon").animate(
          //         { left: "39%", top: "64%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(347deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     } else if (droppedItemId === "sixthIcon") {
          //       dropScore = dropScore + 5;
          //       $(".sixthIcon").animate(
          //         { left: "47%", top: "64%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(347deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     }
          //     //
          //     else if (droppedItemId === "secondIcon") {
          //       dropScore = dropScore - 1;
          //       $(".secondIcon").animate(
          //         { left: "50%", top: "63%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(11deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     } else if (droppedItemId === "thirdIcon") {
          //       dropScore = dropScore - 1;
          //       $(".thirdIcon").animate(
          //         { left: "39%", top: "66%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(347deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     } else if (droppedItemId === "fifthIcon") {
          //       dropScore = dropScore - 1;
          //       $(".fifthIcon").animate(
          //         { left: "47%", top: "68%", width: "11%" },
          //         500,
          //         function () {
          //           $(this).css("transform", "rotate(347deg)");
          //           $(this).css("animation", "none");
          //           $(this).draggable("disable");
          //           $(this).removeClass("ui-draggable");
          //         }
          //       );
          //       drop = true;
          //     }
          //     console.log("Drop Score finale:", dropScore);
          //   },
          // });

          $(".DropareaFirst").droppable({
            drop: function (event, ui) {
              var droppedItemId = ui.draggable.attr("id");
              console.log("Dropped item ID:", droppedItemId);

              dropValue++;
              console.log("Drop Value:", dropValue);

              // Start timer on first drop
              if (dropStartTime === null) {
                dropStartTime = new Date().getTime();
                console.log("Timer started");
              }

              // ✅ Show submit button & calculate time after 3 drops
              if (dropValue === 3) {
                $("#PhaseOnesubmit").fadeIn();

                const dropEndTime = new Date().getTime();
                timeTaken = (dropEndTime - dropStartTime) / 1000; // seconds
                console.log(
                  "Time taken to drop 3 items:",
                  timeTaken,
                  "seconds"
                );
              }

              console.log("Drop Score before:", dropScore);

              // ✅ Correct answers
              if (droppedItemId === "firstIcon") {
                dropScore += 5;
                $(".firstIcon").animate(
                  { left: "42%", top: "64%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(347deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              } else if (droppedItemId === "fourthIcon") {
                dropScore += 5;
                $(".fourthIcon").animate(
                  { left: "39%", top: "64%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(347deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              } else if (droppedItemId === "sixthIcon") {
                dropScore += 5;
                $(".sixthIcon").animate(
                  { left: "47%", top: "64%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(347deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              }
              // ❌ Wrong answers
              else if (droppedItemId === "secondIcon") {
                dropScore -= 1;
                $(".secondIcon").animate(
                  { left: "50%", top: "63%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(11deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              } else if (droppedItemId === "thirdIcon") {
                dropScore -= 1;
                $(".thirdIcon").animate(
                  { left: "39%", top: "66%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(347deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              } else if (droppedItemId === "fifthIcon") {
                dropScore -= 1;
                $(".fifthIcon").animate(
                  { left: "47%", top: "68%", width: "11%" },
                  500,
                  function () {
                    $(this).css({
                      transform: "rotate(347deg)",
                      animation: "none",
                    });
                    $(this).draggable("disable").removeClass("ui-draggable");
                  }
                );
                drop = true;
              }
              console.log("Drop Score finale:", dropScore);
            },
          });

          $("#PhaseOnesubmit").click(function () {
            if (!bonusGiven) {
              if (timeTaken > 0 && timeTaken <= 30 && dropScore == 15) {
                dropScore += 5;
                bonusGiven = true;
              }
            }

            if (dropScore < 10) {
              showFinalScore({
                resultText:
                  "Hmm!<br>that tool may not be essential for this kind of business!",
                scoreValue: dropScore,
                starImage: "images/Level1/EMOJI.png",
                showBonus: bonusGiven,
              });
            }

            if (dropScore >= 10) {
              showFinalScore({
                resultText: "Awesome!<br>You’re ready to roll!",
                scoreValue: dropScore,
                starImage: "images/Level1/STAR1.png",
                showBonus: bonusGiven,
              });
              $("#PhaseOnefinish").fadeIn();
              $("#PhaseOnesubmit").hide();
            }
            if (dropScore == 20) {
              $("#PhaseOnefinish").fadeIn();
              $("#PhaseOnesubmit").hide();
              showFinalScore({
                resultText:
                  "Perfect match!<br>The right resources power a startup to success!",
                scoreValue: dropScore,
                starImage: "images/Level1/STAR.png",
                showBonus: bonusGiven,
              });
            }

            $("#PhaseOnefinish").click(function () {
              $(this).fadeOut();

              $(".commonResultWindow").fadeOut();
              $(".dragaNddropGameobjet").hide();
              $(".sectionfinalMessage").fadeIn();
              $(".theStopper").fadeIn();
              $(".personWalking").fadeIn();
              responsiveVoice.speak(
                "Great job You’ve chosen the right resources.Now, let’s move on to the next challenge planning!",
                "UK English Male",
                {
                  rate: 0.9,
                  pitch: 1.1,
                  onend: function () {
                    $("#PhaseTwoStarting").fadeIn();
                  },
                }
              );

              $("#PhaseTwoStarting").click(function () {
                $(this).fadeOut();
                $(".sectionfinalMessage").hide();
                $(".starBlinking").fadeIn();
                $(".starBlinking").fadeOut(1500);
                $(".theStopper").fadeTo(500, 0.3, function () {
                  $(this).css("display", "none");
                });

                setTimeout(() => {
                  $(".secondScreen").hide();
                  $(".ThirdScreen").fadeIn();
                  $("#SecondVideo").fadeIn();
                  $(".personWalking").hide();
                  var video = $("#SecondVideo").get(0); // Get the video element
                  video.play();
                }, 1300);
              });
            });
          });
        });
      });
    };
  });
});

function DragElement(
  id,
  shadowid,
  rotatepos,
  dragdegree,
  dropdegree,
  settimeLeft,
  settimeTop
) {
  $(id).draggable({
    revert: function () {
      if (!drop) {
        drop = true;
        $(shadowid).fadeIn();
        $(rotatepos).css({ transform: "rotate(" + dragdegree + "deg)" });
        setTimeout(function () {
          $(id).animate({ left: settimeLeft + "%", top: settimeTop + "%" });
        }, 600);
        return true;
      }
    },
    drag: function () {
      drop = false;
      $(rotatepos).css({ transform: "rotate(" + dropdegree + "deg)" });
      $(shadowid).fadeOut();
    },
  });
}
function showFinalScore({
  resultText,
  scoreValue,
  starImage,
  showBonus = false,
} = {}) {
  $(".commonResultWindow").fadeIn();
  $(".resultText").html(resultText);
  $(".scoreValue").html(scoreValue);
  $(".starIcon").attr("src", starImage);
  if (showBonus) {
    $(".Bonuztext").fadeIn();
  } else {
    $(".Bonuztext").hide();
  }
  $(".closeIcon")
    .off("click")
    .on("click", function () {
      $(".commonResultWindow").hide();
    });
}

function secondPhaseStart() {
  $(".thirdScreenIntro").fadeIn();

  responsiveVoice.speak(
    "Understand the sequence of key steps involved in starting a business",
    "UK English Male",
    {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        $("#ThirdScreenBtn1").fadeIn();
      },
    }
  );

  setTimeout(() => {}, 600);

  $("#ThirdScreenBtn1").click(function () {
    $(this).hide();
    $(".thirdScreenIntro").hide();
    $(".thirdScreenWelcomeimage").css("display", "flex");
    responsiveVoice.speak(
      "Every business needs a solid plan.The steps may seem jumbled at first, but putting them in the right order can make a big difference.Ready to organize the perfect business plan? Let’s go!",
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {
          $("#ThirdScreenBtn2").fadeIn();
        },
      }
    );
  });

  $("#ThirdScreenBtn2").click(function () {
    $(this).hide();
    $(".thirdScreenWelcomeimage").hide();

    responsiveVoice.speak(
      "Rearrange the 5 shuffled tile into the correct logical order",
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {},
      }
    );

    $(".orderDatapage").css("display", "flex");

    SecondPhaseshuffledrag();
  });
}

function SecondPhaseshuffledrag() {
  let draggedTile = null;

  // Correct Order (YOU MUST DEFINE THIS OUTSIDE)
  // Example:
  // const correctOrder = {1:"tile1", 2:"tile2", 3:"tile3", 4:"tile4", 5:"tile5"};

  // ENABLE DRAG
  document.querySelectorAll(".draggableTile").forEach((tile) => {
    tile.addEventListener("dragstart", (e) => {
      draggedTile = e.target;
    });
  });

  // ENABLE DROP
  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());

    zone.addEventListener("drop", (e) => {
      if (!draggedTile) return;

      const slot = zone.dataset.slot;
      const bubble = document.getElementById("num" + slot);

      // CHECK IF ZONE HAS IMAGE
      let existingTile = zone.querySelector(".draggableTile");

      if (existingTile && existingTile !== draggedTile) {
        // SWAP LOGIC
        let fromZone = draggedTile.parentElement;

        fromZone.appendChild(existingTile); // move old tile back
        zone.appendChild(draggedTile); // place dragged tile
      } else {
        zone.appendChild(draggedTile);
      }

      // Check correctness of this slot
      if (draggedTile.id === correctOrder[slot]) {
        bubble.style.background = "#2ecc71"; // green
        bubble.style.color = "#fff";
        droppedCount++;

        if (droppedCount <= 2) {
          $("#PhasetwoSubmitbtn").fadeIn();
        }

        console.log("Dropped Count:", droppedCount);
      } else {
        bubble.style.background = "#e74c3c"; // red
        bubble.style.color = "#fff";
      }

      // After placing, check if all correct
      checkAllCorrect();
    });
  });

  // CHECK IF ALL 5 ARE CORRECT
  function checkAllCorrect() {
    let allCorrect = true;

    for (let i = 1; i <= 5; i++) {
      const zone = document.querySelector('.dropzone[data-slot="' + i + '"]');
      const tile = zone.querySelector(".draggableTile");

      if (!tile || tile.id !== correctOrder[i]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      // TURN ALL BUBBLES GREEN
      for (let i = 1; i <= 5; i++) {
        const bubble = document.getElementById("num" + i);
        bubble.style.background = "#2ecc71";
        bubble.style.color = "#fff";
      }
      showFinalScore({
        resultText:
          "You nailed the plan! That’s exactly how a business is built.”",
        scoreValue: 20,
        starImage: "images/Level1/STAR.png",
        showBonus: false,
      });
      $("#PhasetwoSubmitbtn").hide();
      $("#PhasetwonextBtn").fadeIn();
      // SHOW SCORE ALERT
      // setTimeout(() => {
      //   alert("🎉 Excellent! All answers correct!\n\nYour Score: 20/20");
      // }, 300);
    }

    $("#PhasetwonextBtn").click(function () {
      $(this).hide();
      $(".scoreScoreArea").hide();
      $(".CommonfinalsSection").fadeIn();
      $(".orderDatapage").hide();
      $(".finalSetmainDiv").fadeIn();
      $(".commonResultWindow").hide();

      responsiveVoice.speak(
        "Nice work! Planning is half the battle.But what about those inner fears and family expectations?Time to face the personal barrier next",
        "UK English Male",
        {
          rate: 0.9,
          pitch: 1.1,
          onend: function () {
            responsiveVoice.cancel();
            $("#PhasethreenextBtn").fadeIn();
          },
        }
      );

      $("#PhasethreenextBtn").click(function () {
        $(this).hide();
        responsiveVoice.cancel();
        $(".starBlinkingcommon").stop(true, true).fadeIn(0).fadeOut(1500);
        // $(".starBlinkingcommon").show();
        $(".CommonfinalsSection").hide();
        // $(".starBlinkingcommon").fadeOut(1500);
        $(".theStopperCommon").fadeTo(500, 0.3, function () {
          $(this).css("display", "none");
        });

        setTimeout(() => {
          $(".starBlinkingcommon").hide();
          $(".ThirdScreen").hide();
          $(".FourthScreen").fadeIn();
          $("#ThirdVideo").fadeIn();
          $(".personWalkingcommon").hide();
          var video = $("#ThirdVideo").get(0); // Get the video element
          video.play();
          video.onended = function () {
            thirdPhaseArea();
            //  alert("Third Phase Starts");
          };
        }, 1300);
        //
      });
    });
  }

  $("#PhasetwoSubmitbtn").click(function () {
    $(".commonResultWindow").fadeIn();

    if (droppedCount <= 3) {
      showFinalScore({
        resultText: "Almost there! Recheck your order next time",
        scoreValue: 15,
        starImage: "images/Level1/STAR.png",
        showBonus: false,
      });
    }
    if (droppedCount <= 2) {
      showFinalScore({
        resultText:
          "Planning is key – take time to understand the right steps.”",
        scoreValue: 10,
        starImage: "images/Level1/EMOJI.png",
        showBonus: false,
      });
    }
  });
}

function thirdPhaseArea() {
  $("#FourthBG").fadeIn();
  $("#ThirdVideo").hide();
  $(".fourthIntro").fadeIn();

  responsiveVoice.speak(
    "Students will reflect on personal and social barriers such as fear of failure, family/societal pressure, overthinking, and build problem-solving and resilience strategies",
    "UK English Male",
    {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        $("#PhathreeStarting").fadeIn();
      },
    }
  );

  $("#PhathreeStarting").click(function () {
    $(this).fadeOut();
    $(".fourthIntro").fadeOut();
    $(".thirdscreenWelcomenote").css("display", "flex");
    responsiveVoice.speak(
      "Now we’re entering a tricky stretch — the Personal Barrier.As a young entrepreneur, doubts and pressures from friends and family can feel overwhelming. Butmaking thoughtful decisions can help you stay true to your vision.Let’s see how you handle it!",
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {
          $("#Phathreesecondbtn").fadeIn();
        },
      }
    );
  });

  $("#Phathreesecondbtn").click(function () {
    $(this).fadeOut();
    $(".thirdscreenWelcomenote").css("display", "none");
    $(".Commonscreenfourassessmentintro").css("display", "flex");

    responsiveVoice.speak($("#CommonassessmenH1").text(), "UK English Male", {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        responsiveVoice.speak(
          $("#CommonassessmenH2").text(),
          "UK English Male",
          {
            rate: 0.9,
            pitch: 1.1,
            onend: function () {
              $("#Phathreesecondbtnassess1").fadeIn();
            },
          }
        );
      },
    });

    setTimeout(() => {
      // $("#Phathreesecondbtnassess1").fadeIn();
    }, 400);
  });

  $("#Phathreesecondbtnassess1").click(function () {
    $(this).fadeOut();
    $(".Commonscreenfourassessmentintro").css("display", "none");
    $(".commonQuestionandanswerareaphase3").css("display", "flex");
    loadQuestion(quizData[0]);
  });
}

// questions load

// LOAD QUESTION// LOAD QUESTION
function loadQuestion(q) {
  $("#questionText").text(q.question);
  responsiveVoice.speak(q.question, "UK English Male", {
    rate: 0.9,
    pitch: 1.1,
  });
  const container = $("#optionsContainer");
  container.empty();
  q.options.forEach((opt) => {
    const div = $("<div>").addClass("QuestionDiv");
    const p = $("<p>").addClass("QuestionDivQuestions").text(opt.text);
    const label = $("<label>").addClass("radio-wrapper");
    const input = $("<input>")
      .attr("type", "radio")
      .attr("name", "option")
      .addClass("QuestionRadiobtn")
      .data("score", opt.score)
      .data("feedback", opt.feedback)
      .on("change", optionSelected);
    const span = $("<span>").addClass("custom-radio");
    label.append(input).append(span);
    div.append(p).append(label);
    container.append(div);
  });
}

// WHEN OPTION IS SELECTED
function optionSelected() {
  // alert("");
  // Prevent selecting again
  $("input[name='option']").prop("disabled", true);
  totalScore += Number($(this).data("score"));
  $("#feedbackText").text($(this).data("feedback"));
  $(".resultText").text($(this).data("feedback"));
  $(".scoreValue").text($(this).data("score"));
  $(".commonResultWindow").css("display", "flex");

  if ($(this).data("score") >= 7) {
    $(".starIcon").attr("src", "images/level3/STARS.png");
  } else {
    $(".starIcon").attr("src", "images/level3/EMOJI.png");
  }

  // Auto-close popup after 3 seconds
  setTimeout(() => {
    $(".commonResultWindow").hide();
    goToNextStep();
  }, 3000);
}

// SEQUENCE HANDLER
function goToNextStep() {
  if (currentQuestion === 0) {
    $(".commonQuestionandanswerareaphase3").hide();
    $("#questionSection").hide();
    $(".Commonscreenfourassessmentintro").css("display", "flex");
    $("#CommonassessmentImg").attr("src", "images/level3/BOX3.gif");
    $("#CommonassessmentImg").removeClass("width60");
    $("#CommonassessmenH1").text("Fear of Failure");
    $("#CommonassessmenH2").text("What if I fail?");
    responsiveVoice.speak($("#CommonassessmenH1").text(), "UK English Male", {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        responsiveVoice.speak(
          $("#CommonassessmenH2").text(),
          "UK English Male",
          {
            rate: 0.9,
            pitch: 1.1,
            onend: function () {
              $("#Phathreesecondbtnassess2").fadeIn();
            },
          }
        );
      },
    });
    $("#CommonassessmenH3").text("Scenario 2");
    // Auto move after 3 seconds

    $("#Phathreesecondbtnassess2").click(function () {
      $(this).hide();
      $(".Commonscreenfourassessmentintro").hide();
      $("#questionSection").show();
      $(".commonQuestionandanswerareaphase3").css("display", "flex");
      currentQuestion = 1;
      loadQuestion(quizData[1]);
    });
  } else if (currentQuestion === 1) {
    $("#questionSection").hide();
    $(".commonQuestionandanswerareaphase3").hide();
    $(".Commonscreenfourassessmentintro").css("display", "flex");

    $("#CommonassessmentImg").attr("src", "images/level3/BOX4.gif");
    $("#CommonassessmentImg").css({ width: "37%" });
    $("#CommonassessmenH1").text("Overthinking the Outcome");
    $("#CommonassessmenH2").text("Too Many What-Ifs");
    $("#CommonassessmenH3").text("Scenario 3");
    responsiveVoice.speak($("#CommonassessmenH1").text(), "UK English Male", {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        responsiveVoice.speak(
          $("#CommonassessmenH2").text(),
          "UK English Male",
          {
            rate: 0.9,
            pitch: 1.1,
            onend: function () {
              $("#Phathreesecondbtnassess3").fadeIn();
            },
          }
        );
      },
    });

    $("#Phathreesecondbtnassess3").click(function () {
      $(this).hide();
      $(".Commonscreenfourassessmentintro").hide();
      $("#questionSection").show();
      currentQuestion = 2;
      loadQuestion(quizData[2]);
      $(".commonQuestionandanswerareaphase3").css("display", "flex");
    });
    // Auto move after 3 seconds
    // setTimeout(() => {
    //   $("#screen2").hide();
    //   $("#questionSection").show();
    //   currentQuestion = 2;
    //   loadQuestion(quizData[2]);
    // }, 3000);
  } else if (currentQuestion === 2) {
    showFinalScorze();
  }
}
// FINAL SCORE
function showFinalScorze() {
  // $("#PhathreeFinishBtn").fadeIn();
  $(".commonQuestionandanswerareaphase3").hide();
  $("#questionSection").hide();
  $(".CommonfinalsSection").show();
  $(".finalSetmainDiv").fadeIn();
  // console.log("Total Score:", totalScore);
  // $("#finalScore").text("Final Score: " + totalScore);
  $(".CommonfinalsSection").css({ height: "40%" });
  $(".theStopperCommon").show();
  $(".theStopperCommon").css("opacity", "1");
  $(".personWalkingcommon").fadeIn();
  $(".CommonfinalsSectionContent").html(
    "<b>Impressive!</b> <br>You stood your ground and made bold, thoughtful choices.Every entrepreneur faces tough moments — and you’re learning how to face them with confidence.<br>Next up: let’s work on building your self-belief"
  );

  responsiveVoice.speak(
    "Impressive!You stood your ground and made bold, thoughtful choices.Every entrepreneur faces tough moments — and you’re learning how to face them with confidence.Next up: let’s work on building your self-belief",
    "UK English Male",
    {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        $("#PhathreeFinishBtn").fadeIn();
      },
    }
  );

  $("#PhathreeFinishBtn").click(function () {
    $(this).hide();
    $(".starBlinkingcommon").stop(true, true).fadeIn(0).fadeOut(1500);
    // $(".starBlinkingcommon").show();
    $(".CommonfinalsSection").hide();
    // $(".starBlinkingcommon").fadeOut(1500);
    $(".theStopperCommon").fadeTo(500, 0.3, function () {
      $(this).css("display", "none");
    });
    setTimeout(() => {
      $(".starBlinkingcommon").hide();
      $(".Fifthscreen").fadeIn();
      $(".FourthScreen").hide();
      $("#FourthVideo").fadeIn();
      $(".personWalkingcommon").hide();
      var video = $("#FourthVideo").get(0); // Get the video element
      video.play();
      video.onended = function () {
        // thirdPhaseArea();
        FourthPhase();
      };
    }, 1300);
  });
  // FourthScreen
}

function FourthPhase() {
  $(".Fifthscreen").fadeIn();
  $(".fifthIntro").fadeIn();

  responsiveVoice.speak(
    "Help students reflect on their internal self-talk and choose empowering thoughts to build entrepreneurial confidence",
    "UK English Male",
    {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        $("#fifthScreenFirstbtn").fadeIn();
      },
    }
  );

  $("#fifthScreenFirstbtn").click(function () {
    $(this).fadeOut();
    $(".fifthIntro").hide();
    $(".fourthscreenWelcomenote").css("display", "flex");

    responsiveVoice.speak(
      "It’s time to beat the Self-Doubt Barrier.Fear of failure can slow down even the best ideas.Your mindset can make or break your journey — so choose your thoughts wisely!",
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {
          $("#fifthScreenSecondbtn").fadeIn();
        },
      }
    );

    $("#fifthScreenSecondbtn").click(function () {
      $(this).fadeOut();
      $(".fourthscreenWelcomenote").css("display", "none");

      $(".phaseFourMainActivityAreas").css("display", "flex");
      $(".titleBar").fadeIn();
      responsiveVoice.speak(
        "  Select 3 suitable self-statements out of 6 that help to build confidence.",
        "UK English Male",
        {
          rate: 0.9,
          pitch: 1.1,
          onend: function () {},
        }
      );

      $("#FourthBG").css("filter", "brightness(0.5)");
      phase4Activity();
    });
  });
}

function phase4Activity() {
  let selectedItems = [];

  // LIVE UPDATE FEEDBACK (when clicking options)
  function updateLiveFeedback() {
    $(".FeedbackSlotareamain").empty();
    if (selectedItems.length >= 3) {
      $(".optionItem").css("pointer-events", "none");
    }
    selectedItems.forEach((item, index) => {
      const $item = $(item);
      const text = $item.find(".optionText").text();
      const fb = `
                <div class="feedbackSlot">
                    <div class="DroppedCircleNumber">${index + 1}</div>
                    <p class="feedbackSlotText">${text}</p>
                </div>
            `;

      $(".FeedbackSlotareamain").append(fb);
    });
  }

  // ===============================
  // OPTION CLICK
  // ===============================
  $(".optionItem")
    .off()
    .on("click", function () {
      const item = $(this);
      // Unselect
      $(".buttonArea").css("display", "flex");
      let inner = $(this).find(".optionItemInner");
      $(inner).css("background-color", "green");
      if (selectedItems.includes(this)) {
        item.removeClass("selected");
        selectedItems = selectedItems.filter((x) => x !== this);
        updateLiveFeedback();
        return;
      }
      // Allow only 3
      if (selectedItems.length >= MAX_SELECTION) {
        alert("You can select only 3 statements.");

        return;
      }
      item.addClass("selected");
      selectedItems.push(this);
      updateLiveFeedback();
    });

  // ===============================
  // SUBMIT BUTTON
  // ===============================
  $(".submitBtn")
    .off()
    .on("click", function () {
      if (selectedItems.length !== 3) {
        return;
      }

      let positiveCount = 0;
      let negativeCount = 0;
      let score = 0;

      selectedItems.forEach((item) => {
        const $item = $(item);
        const type = $item.data("type");
        const points = parseInt($item.data("points"));

        if (type === "positive") {
          positiveCount++;
        } else {
          negativeCount++;
        }

        score += points;
      });

      // Prevent negative score (optional)
      if (score < 0) score = 0;

      // Apply score to UI
      $(".scoreValuephase4").text(score);

      // ===== CASE 1: All 3 correct =====
      if (positiveCount === 3) {
        // Correct battery full
        $("#batteryFillCorrect").attr("src", "images/level4/BATTERY_GREEN.png");
        $("#correctPercent").text("100%");

        $("#PhaseFourSubmitbtn").fadeIn();
      }
      // ===== CASE 2: Any wrong selected =====
      else {
        // Wrong battery full
        $("#wrongPercent").text("100%");
        $("#batteryFillWrong").attr("src", "images/level4/BATTERY_RED.png");
      }

      $("#PhaseFourSubmitbtn").click(function () {
        $(this).hide();
        $(".phaseFourContainer").css("display", "none");
        $(".CommonfinalsSection").fadeIn();
        $(".finalSetmainDiv").fadeIn();
        $(".theStopperCommon").show();
        $(".theStopperCommon").css("opacity", "1");
        $(".personWalkingcommon").fadeIn();
        //  font-size: 1.6vw;
        $(".CommonfinalsSection").css({ height: "32%" });
        $(".CommonfinalsSectionContent").html(
          "Well done! With a strong mindset, you’re already halfway to success.Believing in yourself is the most powerful tool you have.Now, let’s head to the final challenge — building your dream team!"
        );

        responsiveVoice.speak(
          $(".CommonfinalsSectionContent").text(),
          "UK English Male",
          {
            rate: 0.9,
            pitch: 1.1,
            onend: function () {
              $("#finalPhasesimulationStarting").fadeIn();
            },
          }
        );
      });

      $("#finalPhasesimulationStarting").click(function () {
        $(this).hide();
        $(".starBlinkingcommon").stop(true, true).fadeIn(0).fadeOut(1500);
        // $(".starBlinkingcommon").show();
        $(".CommonfinalsSection").hide();
        // $(".starBlinkingcommon").fadeOut(1500);
        $(".theStopperCommon").fadeTo(500, 0.3, function () {
          $(this).css("display", "none");
        });

        setTimeout(() => {
          $(".starBlinkingcommon").hide();
          $(".Fifthscreen").hide();
          $(".SixthScreen").fadeIn();
          $("#FifthVideo").fadeIn();
          $(".personWalkingcommon").hide();
          var video = $("#FifthVideo").get(0); // Get the video element
          video.play();
          video.onended = function () {
            // thirdPhaseArea();
            FinalStage();
          };
        }, 1300);
      });
    });

  // ===============================
  // RESET BUTTON
  // ===============================
  $(".resetBtn")
    .off()
    .on("click", function () {
      selectedItems = [];
      $(".optionItemInner").css("background-color", "white");
      $(".optionItem").removeClass("selected");
      $(".FeedbackSlotareamain").empty();
      $(".scoreValuephase4").text("0");
      $("#batteryFillCorrect").attr("src", "images/level4/BATTERY_LEVEL.png");
      $("#batteryFillWrong").attr("src", "images/level4/BATTERY_LEVEL.png");
      $("#correctPercent").text("0%");
      $("#wrongPercent").text("0%");
      $(".optionItem").css("pointer-events", "auto");
    });
}

function FinalStage() {
  $("#FifthVideo").hide();
  $("#FinalBG").fadeIn();
  $(".finalIntro").fadeIn();

  responsiveVoice.speak(
    "Teach students to identify the value of collaboration and people skills in team selection",
    "UK English Male",
    {
      rate: 0.9,
      pitch: 1.1,
      onend: function () {
        $("#Finalphasebtn1").fadeIn();
      },
    }
  );

  $("#Finalphasebtn1").click(function () {
    $(this).hide();
    $(".finalScreenWelcomenote").css("display", "flex");

    responsiveVoice.speak(
      "You’ve come a long way — now it’s time to tackle the Team Building Barrier.Every successful startup needs the right people working together.Choose teammates who match your values and bring out your best.",
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {
          $("#Finalphasebtn2").fadeIn();
        },
      }
    );
    $(".finalIntro").hide();
    $("#Finalphasebtn2").click(function () {
      $(this).hide();
      $(".finalScreenWelcomenote").css("display", "none");
      $(".finalscreenActivitymain").css("display", "flex");
      responsiveVoice.speak(
        "Select 2 out of 4 teammate profiles who match your values and bring out your best",
        "UK English Male",
        {
          rate: 0.9,
          pitch: 1.1,
          onend: function () {
            //  $("#Finalphasebtn2").fadeIn();
          },
        }
      );
      $("#FinalBG").css("filter", "brightness(0.5)");
      $(".QuestionRadiobtnfinal").on("change", function () {
        // If user selected it
        if (this.checked) {
          selectionQueue.push(this);
          if (selectionQueue.length > 2) {
            let toUncheck = selectionQueue.shift(); // remove the oldest
            $(toUncheck).prop("checked", false); // unselect it
          }
        } else {
          // If user manually unchecks: remove from queue
          selectionQueue = selectionQueue.filter((btn) => btn !== this);
        }
        if (selectionQueue.length >= 2) {
          $("#Phase5assessmentSubmit").fadeIn();
        }
      });
      $("#Phase5assessmentSubmit").click(function () {
        submitFinalSelection();
      });
    });
  });
}
function submitFinalSelection() {
  let selectedProfiles = [];
  $(".ProfileMaindivSection").each(function () {
    let radio = $(this).find(".QuestionRadiobtnfinal");
    if (radio.is(":checked")) {
      let name = $(this).find("p:first .value").text().trim();
      selectedProfiles.push(name);
    }
  });
  if (selectedProfiles.length !== 2) {
    alert("Please select exactly 2 profiles.");
    return;
  }

  // SCORING
  let correctCount = 0;
  selectedProfiles.forEach((name) => {
    if (correctProfiles.includes(name)) {
      correctCount++;
    }
  });

  let finalScore = 10;
  if (correctCount === 2) {
    finalScore = 20;

    setTimeout(() => {
      $("#Closebtnfinal").hide();
      $("#Phase5assessmentSubmit").hide();
      $("#Phase5assessmentFinish").fadeIn();
    }, 600);
  } else if (correctCount === 1) {
    finalScore = 15;
  }
  // RESET avatar color states
  $("#Result1Img, #Result2Img").removeClass("correctAvatar wrongAvatar");
  // TOP PERSON
  $("#Result1Name").text(selectedProfiles[0]);
  $("#Result1sub").text('"' + feedbackData[selectedProfiles[0]] + '"');
  $("#Result1Img").attr("src", imageData[selectedProfiles[0]]);

  if (correctProfiles.includes(selectedProfiles[0])) {
    $("#Result1Img").addClass("correctAvatar");
  } else {
    $("#Result1Img").addClass("wrongAvatar");
  }

  // BOTTOM PERSON
  $("#Result2Name").text(selectedProfiles[1]);
  $("#Result2sub").text('"' + feedbackData[selectedProfiles[1]] + '"');
  $("#Result2Img").attr("src", imageData[selectedProfiles[1]]);
  if (correctProfiles.includes(selectedProfiles[1])) {
    $("#Result2Img").addClass("correctAvatar");
  } else {
    $("#Result2Img").addClass("wrongAvatar");
  }
  $(".FinalScoreareascore").text(finalScore + " Points");
  $(".commonPopupFinalScreen").css("display", "flex");
  $("#Closebtnfinal").click(function () {
    $(".commonPopupFinalScreen").css("display", "none");
  });
  $("#Phase5assessmentFinish").click(function () {
    $(this).hide();
    $(".finalscreenActivitymain").css("display", "none");
    $("#FinalBG").css("filter", "brightness(1)");
    $(".CommonfinalsSection").fadeIn();
    $(".finalSetmainDiv").fadeIn();
    $(".CommonfinalsSection").css({ height: "32%" });
    $(".theStopperCommon").show();
    $(".theStopperCommon").css("opacity", "1");
    $(".personWalkingcommon").fadeIn();
    $(".CommonfinalsSectionContent").html(
      "Fantastic! You picked a team with the right balance of skills and attitude.Collaboration is what takes a great idea all the way to success.You've completed all the hurdles — your entrepreneurial journey has begun!"
    );
    responsiveVoice.speak(
      $(".CommonfinalsSectionContent").text(),
      "UK English Male",
      {
        rate: 0.9,
        pitch: 1.1,
        onend: function () {
          responsiveVoice.cancel();
          setTimeout(() => {
            $(".starBlinkingcommon").stop(true, true).fadeIn(0).fadeOut(1500);
            // $(".starBlinkingcommon").show();
            $(".CommonfinalsSection").hide();
            // $(".starBlinkingcommon").fadeOut(1500);
            $(".theStopperCommon").fadeTo(500, 0.3, function () {
              $(this).css("display", "none");
            });
            setTimeout(() => {
              $(".finalSetmainDiv").hide();
              $(".SixthScreen").hide();
              $(".FinalScreenvideo").fadeIn();
              $("#FinalVideo").fadeIn();
              var video = $("#FinalVideo").get(0); // Get the video element
              video.play();
            }, 1700);
          }, 2600);
        },
      }
    );
  });
}
