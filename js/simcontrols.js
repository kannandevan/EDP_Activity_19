$(document).ready(function () {
  setTimeout(() => {
    MaximumScreenIframe();
  }, 500);

  // Full screen
  window.addEventListener("message", function (event) {
    if (event.data === "maximizeIframe") {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  });
  let quizData = [];
  let answerArr = [];
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let score = 0; // Global score variable

  function addQuestion(
    questionText,
    options,
    correctAnswer,
    isImageOnly = false,
    optionImages = null,
    dataId = null,
    matchPairs = null,
    requiredMatches = null // NEW: Explicitly specify required matches
  ) {
    quizData.push({
      questionText,
      options,
      correctAnswer,
      isImageOnly,
      optionImages,
      dataId,
      matchPairs,
      requiredMatches, // NEW
    });
    userAnswers.push(null);
  }

  function renderCurrentQuestion() {
    const $quiz = $("#quiz");
    $quiz.empty();

    const question = quizData[currentQuestionIndex];

    const questionNumberHTML = `<p class="QuestionOutofNumber">Question ${
      currentQuestionIndex + 1
    } of ${quizData.length}</p>`;
    $quiz.append(questionNumberHTML);

    let questionHTML = "";

    // 1. MATCH THE FOLLOWING (drag and drop)
    if (question.matchPairs) {
      // Render only valid pairs (non-empty 'left') on the left
      const validPairs = question.matchPairs.filter(pair => pair.left !== "");
      const leftItems = validPairs
        .map(
          (pair, i) =>
            `<div class="match-left" data-index="${question.matchPairs.indexOf(pair)}">${pair.left}</div>`
        )
        .join("");

      // Render all pairs on the right (draggable, including dummies)
      const rightItems = question.matchPairs
        .map(
          (pair, i) =>
            `<div class="match-right" draggable="true" data-index="${i}">${pair.right}</div>`
        )
        .sort(() => Math.random() - 0.5)
        .join("");

      questionHTML = `
      <div class="question match-question">
        <p style="" class="fontsizeassessment"><b>${question.questionText}</b></p>
        <div class="match-container displayandgap">
          <div class="match-column w-48">${leftItems}</div>
          <div class="arrow text-3xl font-bold text-gray-600">←</div>
          <div class="match-column w-48">${rightItems}</div>
        </div>
      </div>
    `;

      $quiz.append(questionHTML);

      $(".match-right").on("dragstart", function (e) {
        e.originalEvent.dataTransfer.setData(
          "text/plain",
          $(this).data("index")
        );
      });

      $(".match-left").on("dragover", function (e) {
        e.preventDefault();
        $(this).css("background-color", "");
      });

      $(".match-left").on("dragleave", function () {
        $(this).css("background-color", "");
      });

      $(".match-left").on("drop", function (e) {
        e.preventDefault();
        const leftIndex = $(this).data("index");
        const rightIndex = e.originalEvent.dataTransfer.getData("text/plain");

        if (!userAnswers[currentQuestionIndex]) {
          userAnswers[currentQuestionIndex] = {};
        }
        userAnswers[currentQuestionIndex][leftIndex] = parseInt(rightIndex);
        // Update UI with match
        const isCorrect = parseInt(leftIndex) === parseInt(rightIndex);
        $(this).text(
          `${question.matchPairs[leftIndex].left} ➝ ${question.matchPairs[rightIndex].right}`
        );
        $(this).css({
          "background-color": isCorrect ? "#1e8827" : "#bb2124",
          "pointer-events": isCorrect ? "none" : "auto",
        }); // green or red
      });
    }

    // 2. IMAGE QUESTION
    else if (question.isImageOnly) {
      questionHTML = `
      <div class="question">
        <p class="fontsizeassessment"><b>${question.questionText}</b></p>
        <img src="images/Assessmentimg/BG-01.png" class="assessmentbgimg"/>
        <div class="optionsimg">
          ${question.optionImages
            .map(
              (image, i) => `
            <div class="tooltip-wrapper">
              <img 
                src="${image}" 
                alt="Option ${i + 1}" 
                class="option-image" 
                id="option-image${i + 1}"
                data-index="${i}"
                data-value="${question.dataId[i]}"
                style="cursor: pointer; ${
                  userAnswers[currentQuestionIndex]?.includes(i)
                    ? "border: 2px solid blue;"
                    : ""
                }"
              >
              <div class="custom-tooltip">${question.dataId[i]}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

      $quiz.append(questionHTML);

      $(".option-image")
        .off("click")
        .on("click", function () {
          const index = parseInt($(this).data("index"));
          if (!userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex] = [];
          }
          const currentSelections = userAnswers[currentQuestionIndex];
          if (currentSelections.includes(index)) {
            userAnswers[currentQuestionIndex] = currentSelections.filter(
              (i) => i !== index
            );
            $(this).css("transform", "scale(1)");
          } else {
            if (currentSelections.length >= 2) {
              const removedIndex = currentSelections.shift();
              $(`.option-image[data-index="${removedIndex}"]`).css(
                "transform",
                "scale(1)"
              );
            }
            currentSelections.push(index);
            $(this).css("transform", "scale(1.2)");
          }
        });
    }

    // 3. TEXT / MULTI-ANSWER QUESTION
    else {
      const maxSelectable = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.length
        : 1;

      questionHTML = `
      <div class="question">
        <p class="fontsizeassessment"><b>${question.questionText}</b></p>
        <div class="options">
          ${question.options
            .map((option, i) => {
              const inputId = `checkbox-${currentQuestionIndex}-${i}`;
              const isChecked = userAnswers[currentQuestionIndex]?.includes(i)
                ? "checked"
                : "";
              return `
                <label class="checkdestyles">
                  <div class="checkbox-wrapper-18 marginright">
                    <div class="round">
                      <input 
                        type="checkbox" 
                        id="${inputId}" 
                        class="checkboxBtn" 
                        name="question-${currentQuestionIndex}" 
                        value="${i}" 
                        ${isChecked}
                      />
                      <label for="${inputId}"></label>
                    </div>
                  </div>
                  ${option}
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
      $quiz.append(questionHTML);

      $(`input[name="question-${currentQuestionIndex}"]`)
        .off("change")
        .on("change", function () {
          const selectedValue = parseInt($(this).val());
          if (!userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex] = [];
          }

          let currentSelections = userAnswers[currentQuestionIndex];

          if ($(this).is(":checked")) {
            if (currentSelections.length >= maxSelectable) {
              const removed = currentSelections.shift();
              $(
                `input[name="question-${currentQuestionIndex}"][value="${removed}"]`
              ).prop("checked", false);
            }
            currentSelections.push(selectedValue);
          } else {
            currentSelections = currentSelections.filter(
              (val) => val !== selectedValue
            );
          }

          userAnswers[currentQuestionIndex] = currentSelections;
        });
    }

    // Navigation buttons
    $("#prev").toggle(currentQuestionIndex > 0);
    $("#next").toggle(currentQuestionIndex < quizData.length - 1);
    $("#submit").toggle(currentQuestionIndex === quizData.length - 1);

    if (currentQuestionIndex > 0) {
      $(".assessmentButtons").css("justify-content", "space-between");
    } else {
      $(".assessmentButtons").css("justify-content", "flex-end");
    }
  }

  function initializeQuiz() {
    if (quizData.length > 0) {
      renderCurrentQuestion();
    } else {
      $("#quiz").html("<h3>No questions available</h3>");
    }
  }

  // Event listeners for navigation
  $("#next")
    .off("click")
    .on("click", function () {
      const question = quizData[currentQuestionIndex];
      const isImageOnly = question.isImageOnly || false;
      const isMatchPairs = !!question.matchPairs; // Check if it's a match-pairs question

      if (isImageOnly) {
        // Existing image-only validation
      }
      // Check for Match-the-Pairs validation
      else if (isMatchPairs) {
        const userMatchAnswers = userAnswers[currentQuestionIndex] || {};
        const expectedPairs = question.requiredMatches || question.matchPairs.filter(pair => pair.left !== "").length;
        const matchedCount = Object.keys(userMatchAnswers).length;

        if (matchedCount !== expectedPairs) {
          alert(`Please match all ${expectedPairs} items before proceeding.`);
          return; // Prevent navigation
        }
      }
      // Original logic for Text / Multi-Answer Questions
      else {
        const selectedAnswers = $(
          `input[name="question-${currentQuestionIndex}"]:checked`
        )
          .map(function () {
            return parseInt($(this).val());
          })
          .get();

        const maxSelectable = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.length
          : 1;

        if (selectedAnswers.length !== maxSelectable) {
          alert(`Select exactly ${maxSelectable} answer(s)`);
          return;
        }
        userAnswers[currentQuestionIndex] = selectedAnswers;
      }

      // Proceed to the next question
      if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
      }
    });

  $("#prev")
    .off("click")
    .on("click", function () {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });

  $("#submit")
    .off("click")
    .on("click", function () {
      const question = quizData[currentQuestionIndex];
      const isImageOnly = question.isImageOnly || false;

      // --- Validation Section (Ensures submission requirements are met) ---
      if (isImageOnly) {
        if (
          !userAnswers[currentQuestionIndex] ||
          userAnswers[currentQuestionIndex].length !== 2
        ) {
          alert("Please select exactly two images.");
          return;
        }
      } else {
        if (question.matchPairs) {
          const userMatchAnswers = userAnswers[currentQuestionIndex] || {};
          const expectedPairs = question.requiredMatches || question.matchPairs.filter(pair => pair.left !== "").length;
          const matchedCount = Object.keys(userMatchAnswers).length;

          if (matchedCount < expectedPairs) {
            alert(`Please match at least ${expectedPairs} items`);
            return;
          }
        } else {
          const selectedAnswers = $(
            `input[name="question-${currentQuestionIndex}"]:checked`
          )
            .map(function () {
              return parseInt($(this).val());
            })
            .get();

          const maxSelectable = Array.isArray(question.correctAnswer)
            ? question.correctAnswer.length
            : 1;

          if (selectedAnswers.length !== maxSelectable) {
            alert(`Select exactly ${maxSelectable} answer(s)`);
            return;
          }

          userAnswers[currentQuestionIndex] = selectedAnswers;
        }
      }

      // --- Scoring Section (Where the score tally happens) ---
      answerArr = [];
      score = 0;

      quizData.forEach((question, index) => {
        const userSelection = userAnswers[index];
        let isCorrect = false;

        // Match Pairs Scoring
        if (question.matchPairs) {
          const correctPairs = question.correctAnswer;
          const requiredCorrectMatches = question.requiredMatches || question.matchPairs.filter(pair => pair.left !== "").length;
          let correctMatchCount = 0;

          if (userSelection) {
            for (let i = 0; i < requiredCorrectMatches; i++) {
              if (
                userSelection.hasOwnProperty(i) && 
                parseInt(userSelection[i]) === parseInt(correctPairs[i])
              ) {
                correctMatchCount++;
              }
            }
          }
          
          isCorrect = correctMatchCount === requiredCorrectMatches;
        
          if (isCorrect) {
            score++;
            answerArr.push(true);
          } else {
            answerArr.push(false);
          }
        
        // Multi-answer/Image-only Scoring
        } else if (Array.isArray(question.correctAnswer)) {
          const correctAnswers = question.correctAnswer;
          isCorrect =
            Array.isArray(userSelection) &&
            userSelection.length === correctAnswers.length &&
            userSelection.every((sel) => correctAnswers.includes(sel)) &&
            correctAnswers.every((ans) => userSelection.includes(ans));

          if (isCorrect) {
            score++;
            answerArr.push(true);
          } else {
            answerArr.push(false);
          }

        // Single-answer Scoring
        } else {
          const correctAnswer = question.correctAnswer;
          if (userSelection === correctAnswer) {
            score++;
            answerArr.push(true);
          } else {
            answerArr.push(false);
          }
        }
      });
      
      const TotalScore = score;
      const TotalQuestion = quizData.length;

      $("#quiz").html(`
        <h3>Your Score: ${score}/${TotalQuestion}</h3>
        <h4>Thanks for completing the quiz!</h4>
        
        <div id="result" class="container-fluid">
          <div class="row d-flex justify-content-evenly">
            <div class="col-md-6 col-12">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <canvas id="myBarChart2" class="styled-canvas"></canvas>
                </div>
                <div class="col-md-4 col-sm-6 col-12 mx-auto">
                  <div class="chart-container text-center">
                    <div class="progress-circle" style="--percentage: ${FinalAnswerPercentage(
                      score,
                      TotalQuestion
                    )};">
                      <p id="UnitNumber">${score}</p>
                      <span>${FinalAnswerPercentage(
                        score,
                        TotalQuestion
                      ).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-12 text-center">
              <div class="finalVivaAnimationsection">
                <div class="animationGifForviva">
                  <div class="ScoreForviva"><p class="scoreText">Score</p> <p class="scoreText" id="ScoreText"></p></div>
                  <img src="images/SCORE-CONGRATS.gif" id="AssessmentGifanim" class="w-100"></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      chartPlot2(TotalScore, TotalQuestion);
      FinalAnswerPercentage(TotalScore, TotalQuestion);
      $("#myBarChart2").fadeIn();

      $("#prev, #next, #submit").hide();
      console.log(answerArr);
    });

  function chartPlot2(TotalScore, TotalQuestion) {
    console.log("the answers: " + answerArr);
    var numericData = [];
    var labels = [];
    answerArr.forEach(function (val, index) {
      labels.push(index + 1);
      if (val) {
        numericData.push(1);
      } else {
        numericData.push(0);
      }
    });
    const canvas = document.getElementById("myBarChart2");
    canvas.width = 400; // Set width dynamically
    canvas.height = 200; // Set height dynamically
    const config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Right Answers",
            data: numericData,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };
    const ctx = document.getElementById("myBarChart2").getContext("2d");
    new Chart(ctx, config);
  }

  function FinalAnswerPercentage(TotalScore, TotalQuestion) {
    let percentage = (TotalScore / TotalQuestion) * 100;
    $(".progress-circle").css("--percentage", percentage);
    $("#UnitNumber").text("Unit 1");
    $(".progress-circle span").text(percentage.toFixed(0) + "%");
    $("#ScoreText").text(percentage.toFixed(0) + "%");
    var FinalScoreAssessment = parseInt(percentage.toFixed(0));
    activateConfetti(FinalScoreAssessment);
    if (FinalScoreAssessment > 60) {
      $("#AssessmentGifanim").attr("src", "images/SCORE-CONGRATS.gif");
    } else {
      $("#AssessmentGifanim").attr("src", "images/SCORE-TRY-AGAIN.gif");
    }
    return percentage;
  }

  function activateConfetti(percentage) {
    if (percentage > 60) {
      var confetteInterval = 0;
      var colors = [
        "#124297",
        "#EB128C",
        "#6BC6E7",
        "#81724A",
        "#528681",
        "#1C4E40",
        "#CA3D02",
        "#D1AC84",
        "#190BB7",
        "#9905CD",
        "#870F00",
        "#A7D883",
        "#43C9FD",
        "#95FBE0",
        "#D1F3A3",
        "#5F1240",
        "#280B9E",
        "#BD849C",
        "#27B7C0",
        "#7BED0C",
        "#5BFA84",
        "#EC25AE",
        "#390632",
        "#6C461C",
        "#0FEEA1",
        "#15BB44",
        "#BA8CCE",
        "#ED1399",
        "#AAFFBB",
        "#E9F6F5",
        "#EED4A6",
        "#88D90D",
        "#923BFF",
        "#C3803E",
        "#DA6D85",
        "#0BD740",
        "#DD6040",
        "#36922C",
        "#CFE414",
        "#C662F0",
        "#249A6B",
        "#E8A543",
        "#4D2AF7",
        "#A57EC5",
        "#7015C0",
        "#001B10",
        "#2D13DA",
        "#1A886E",
        "#79781C",
        "#B6705C",
        "#CA200C",
        "#A85C96",
        "#FA3FF3",
        "#E3027F",
        "#B04F7A",
        "#88B63B",
        "#ED31A4",
        "#F7698B",
        "#A6FD84",
        "#88028D",
        "#9EDAEB",
        "#A44A15",
        "#068584",
        "#4D3BB6",
        "#979355",
        "#1290B3",
        "#6A5ED3",
        "#83EFC1",
        "#82B331",
        "#9EC62A",
        "#26A05A",
        "#E84716",
        "#690FE8",
        "#103694",
        "#6635CC",
        "#4B8CB1",
        "#466522",
      ];
      const frame = () => {
        confetti({
          particleCount: 20,
          angle: 360,
          spread: 1000,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 30,
          angle: 180,
          spread: 1000,
          origin: { x: 1 },
          colors: colors,
        });
      };
      confetteInterval = setInterval(function () {
        requestAnimationFrame(frame);
      }, 100);
      setTimeout(() => {
        clearInterval(confetteInterval);
      }, 5000);
    }
  }

  // Example questions
  addQuestion(
    "Arun is in the process of calculating the start up cost for his business idea. Help him with identifying the cost components and most importantly the prospective ways for reducing their respective cost figures:",
    [
      "App development",
      "Land & building",
      "Data acquisition",
      "Initial marketing & user acquisition",
      "Furniture and office equipment",
      "Server costs",
      "Legal & compliance",
    ],
    [0, 2, 3, 5, 6]
  );

  addQuestion(
    "When the user successfully selects all the cost components, make the COST BREAKUP OF ARUN’S STARTUP button active for selection. When the user clicks on it, show 5 empty slots below it and indicate the user to drag the selected cost components to these slots. Every time a cost component is dragged and placed in each of the empty slots, show the corresponding description and the associated cost of that component in that slot. The description and cost details to be shown is listed below,Match the activities to the correct feasibility types.",
    [],
    {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
    },
    false,
    null,
    null,
    [
      {
        left: "A mobile app development with medium features in india can cost to an average of 45 lakhs depending on the chosen development team's location and experience. Highlight 45 lakhs in the slot",
        right: "App development",
      },
      {
        left: "A private data provider charges an average of 1 lakh per year as subscription fee for a granular air quality data in india. Highlight 1 lakh in the slot",
        right: "Data acquisition",
      },
      {
        left: "Paid advertising in established social media websites can cost an average of 2 lakhs per year based on the content and period of usage. Highlight 2 lakhs in the slot",
        right: "Initial marketing & user acquisition",
      },
      {
        left: "Indian cloud providers can charge an average of 2.5 lakhs per year based on the user base. Highlight 2.5 lakhs in the slot",
        right: "Server cost",
      },
      {
        left: "The consultation fee of an indian startup lawyer for entity formation, contracts, and data privacy compliance specific to indian regulations can cost to an average of 2 lakhs. Highlight 2 lakhs in the slot.",
        right: "Legal & compliance",
      },
    ],
    5
  );

  addQuestion(
    "Which of the components are not possible to reduce cost?",
    [],
    {
      0: 0,
      1: 1,
      2: 2,
    },
    false,
    null,
    null,
    [
      {
        left: "Government resources",
        right: "Data acquisition",
      },
      {
        left: "Local developer & freelancers",
        right: "App development",
      },
      {
        left: "Local marketing strategies",
        right: "Initial marketing & user acquisition",
      },
      {
        left: "",
        right: "Server cost",
      },
      {
        left: "",
        right: "Legal & compliance",
      },
    ],
    3
  );

  initializeQuiz();

  // Feedback.js page
  const stars = document.querySelectorAll(".star");
  const rating = document.getElementById("rating");
  const reviewText = document.getElementById("review");
  const submitBtn = document.getElementById("Reviewsubmit");
  const reviewsContainer = document.getElementById("reviews");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = parseInt(star.getAttribute("data-value"));
      rating.innerText = value;
      stars.forEach((s) =>
        s.classList.remove("one", "two", "three", "four", "five")
      );
      stars.forEach((s, index) => {
        if (index < value) {
          s.classList.add(getStarColorClass(value));
        }
      });
      stars.forEach((s) => s.classList.remove("selected"));
      star.classList.add("selected");
    });
  });

  submitBtn.addEventListener("click", () => {
    const review = reviewText.value;
    const userRating = parseInt(rating.innerText);
    if (!userRating || !review) {
      alert("Please select a rating and provide a review before submitting.");
      return;
    }

    if (userRating > 0) {
      $("#Reviewsubmit").css("pointer-events", "none");
      $(".ratingArea").css("pointer-events", "none");
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("review");
      reviewElement.innerHTML = `<p><strong>Thanks for the Feedback</strong></p>`;
      reviewsContainer.appendChild(reviewElement);
      stars.forEach((s) =>
        s.classList.remove("one", "two", "three", "four", "five", "selected")
      );
    }
  });

  function getStarColorClass(value) {
    switch (value) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      default:
        return "";
    }
  }
});

function MaximumScreenIframe() {
  document.addEventListener("DOMContentLoaded", function () {
    const maximizeButton = document.getElementById("FullScreenButton");
    const iframe = document.getElementById("SimulationIframe");

    maximizeButton.addEventListener("click", function () {
      console.log("Button clicked");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage("maximizeIframe", "*");
      } else {
        console.error("Iframe not found or not loaded yet.");
      }
    });
  });
}