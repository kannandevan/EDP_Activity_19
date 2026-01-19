$(document).ready(function () {
  let startTime = Date.now();
  let dropCount = 0;

  // --- Level Flow ---

  // 1. Intro -> Roadmap (Auto after 5s)
  setTimeout(function () {
    $('.level_1_01').fadeOut(500, function () {
      $('.level_1_02').removeClass('d-none').hide().fadeIn(500);
    });
  }, 5000);

  // 2. Roadmap -> Scene 3 (Click Start)
  // Trying both ID and class to be safe based on HTML inspection
  $('#start-arrow, .start-arrow, .start-arrow-text').click(function () {
    $('.level_1_02').fadeOut(500, function () {
      $('.level_1_03').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // 3. Scene 3 -> Game (Click Next)
  $('.next-1').click(function () {
    $('.level_1_03').fadeOut(500, function () {
      $('.level_1_04').removeClass('d-none').hide().fadeIn(500);
      startTime = Date.now(); // Reset timer when game starts
    });
  });

  // Function to manage draggable state based on drop count
  function updateDraggableState() {
    let filledCount = 0;
    if ($('#bubble-1').hasClass('invisible-bubble') === false) filledCount++;
    if ($('#bubble-2').hasClass('invisible-bubble') === false) filledCount++;
    if ($('#bubble-3').hasClass('invisible-bubble') === false) filledCount++;

    dropCount = filledCount;

    if (dropCount >= 3) {
      // Disable all nondropped cards
      $('.card').each(function () {
        if (!$(this).hasClass('dropped-successfully')) {
          $(this).draggable('disable');
          // $(this).css('opacity', '0.5'); // REMOVED: User enabled cards to stay visible
        }
      });
    } else {
      // Enable all nondropped cards
      $('.card').each(function () {
        if (!$(this).hasClass('dropped-successfully')) {
          $(this).draggable('enable');
          $(this).css('opacity', '1');
        }
      });
    }
  }

  $('.card').draggable({
    revert: function (droppableObj) {
      if (!droppableObj) return true;
      let hasSpace = $('#bubble-1').hasClass('invisible-bubble') ||
        $('#bubble-2').hasClass('invisible-bubble') ||
        $('#bubble-3').hasClass('invisible-bubble');
      if (droppableObj.hasClass('box-div') && !hasSpace) return true;
      return false;
    },
    helper: 'clone',
    cursor: 'move',
    cursorAt: { top: 20, left: 20 },
    start: function (event, ui) {
      $(this).css("opacity", "0.5");
      setTimeout(() => { ui.helper.addClass("card-dragged"); }, 10);
    },
    stop: function (event, ui) {
      if (!$(this).hasClass('dropped-successfully')) {
        $(this).css("opacity", "1");
      }
    },
  });

  $('.box-div').droppable({
    accept: ".card",
    tolerance: "touch",
    drop: function (event, ui) {
      let targetBubble = null;
      if ($('#bubble-1').hasClass('invisible-bubble')) targetBubble = $('#bubble-1');
      else if ($('#bubble-2').hasClass('invisible-bubble')) targetBubble = $('#bubble-2');
      else if ($('#bubble-3').hasClass('invisible-bubble')) targetBubble = $('#bubble-3');

      if (targetBubble) {
        let draggedCard = ui.draggable;
        let badgeText = draggedCard.find('.badge').text();

        draggedCard.addClass('dropped-successfully');
        draggedCard.css('opacity', '0.5');
        draggedCard.draggable('disable');

        let helperClone = ui.helper.clone();
        helperClone.css({ "position": "absolute", "top": ui.offset.top, "left": ui.offset.left, "z-index": 100, "opacity": 1 });
        $('body').append(helperClone);

        helperClone.animate({
          top: targetBubble.offset().top, left: targetBubble.offset().left, width: targetBubble.width(), height: targetBubble.height()
        }, 400, "swing", function () {
          helperClone.remove();
          targetBubble.text(badgeText);
          targetBubble.removeClass('invisible-bubble');
          updateDraggableState(); // Check if we need to disable others
        });

        let uniqueClass = "";
        if (draggedCard.hasClass("card-1")) uniqueClass = "card-1";
        if (draggedCard.hasClass("card-2")) uniqueClass = "card-2";
        if (draggedCard.hasClass("card-3")) uniqueClass = "card-3";
        if (draggedCard.hasClass("card-4")) uniqueClass = "card-4";
        if (draggedCard.hasClass("card-5")) uniqueClass = "card-5";
        if (draggedCard.hasClass("card-6")) uniqueClass = "card-6";

        targetBubble.data('card-class', uniqueClass);
      }
    }
  });

  $('.bubble').click(function () {
    let uniqueClass = $(this).data('card-class');
    if (uniqueClass) {
      let card = $("." + uniqueClass);
      // Only enable if we are not currently locked? No, removing one always unlocks the pool.
      card.removeClass('dropped-successfully');

      $(this).text("");
      $(this).addClass('invisible-bubble');
      $(this).removeData('card-class');

      updateDraggableState(); // Re-evaluate logic (will enable cards since count < 3)
    }
  });

  $('.level-1-submit-btn').click(function () {
    let collectedAnswers = [];
    $('.box-div .bubble').each(function () {
      if (!$(this).hasClass('invisible-bubble') && $(this).data('slot')) {
        collectedAnswers.push($(this).text().trim());
      }
    });

    if (collectedAnswers.length < 3) {
      $('#validation-modal').addClass('active');
      return;
    }

    // --- Scoring & Data ---
    const cardData = {
      'A': {
        text: "Riya starts an online thrift store after noticing college students’ demand for budget fashion.",
        status: 'correct',
        icon: '✅'
      },
      'B': {
        text: "Amit designs an app for his school after seeing issues in attendance tracking, though he knows it may need upgrades later.",
        status: 'correct',
        icon: '✅'
      },
      'C': {
        text: "Neha waits until her uncle gives her advice before finalizing her shop idea.",
        status: 'warning',
        icon: '⚠️'
      },
      'D': {
        text: "Raj keeps postponing his website launch because he wants it perfect before showing anyone.",
        status: 'warning',
        icon: '⚠️'
      },
      'E': {
        text: "Simran begins selling handmade soaps when neighbors request them, planning to refine her product as demand grows.",
        status: 'correct',
        icon: '✅'
      },
      'F': {
        text: "Arjun ignores a friend’s call about discussing a business idea since he feels it may not be serious.",
        status: 'wrong',
        icon: '❌'
      }
    };

    let score = 0;
    let correctSet = new Set(['A', 'B', 'E']);

    collectedAnswers.forEach(ans => {
      if (correctSet.has(ans)) {
        score += 5;
      } else {
        score -= 1;
      }
    });

    // Time Bonus
    let endTime = Date.now();
    let timeTaken = (endTime - startTime) / 1000;
    let gotBonus = false;
    if (timeTaken < 30) {
      score += 5;
      gotBonus = true;
    }

    if (score > 20) score = 20;
    if (score < 0) score = 0;

    // console.log("score1 = " + score);

    // --- UI Transition ---
    $('.level_1_04').addClass('d-none');
    $('.level-1-submit-btn').addClass('d-none');
    $('.level_1_05').removeClass('d-none');

    // --- Populate Score Chart ---
    $('.score-chart .point span').text(score);

    if (gotBonus) {
      $('.bonus-point').show();
    } else {
      $('.bonus-point').hide();
    }

    // Stars
    let starsHtml = "⭐";
    if (score >= 20) starsHtml = "⭐⭐⭐";
    else if (score >= 10) starsHtml = "⭐⭐";

    // Target the span that contains 'star,star,star' (it is the last span child usually or exact match)
    // Based on HTML: <span>100</span> ... <span>star,star,star</span>
    // I made a specific selector logic:
    $('.score-chart span').each(function () {
      if ($(this).text().includes('star')) {
        $(this).text(starsHtml);
      }
    });

    // --- Populate Review Cards & Bubbles ---
    // Fill Box Bubbles (level_1_05 box)
    $('#bubble-1_1').text(collectedAnswers[0]);
    $('#bubble-2_1').text(collectedAnswers[1]);
    $('#bubble-3_1').text(collectedAnswers[2]);

    // Fill Cards
    let cards = [$('.card-big-1'), $('.card-big-2'), $('.card-big-3')];

    collectedAnswers.forEach((ans, index) => {
      let cardEl = cards[index];
      let data = cardData[ans];

      // Left Badge (Letter)
      cardEl.find('.badge').first().text(ans);

      // Text
      cardEl.find('p').text(data.text);

      // Right Badge (Icon)
      cardEl.find('.badge-r').text(data.icon);

      // Background Color for badge-r
      if (data.status === 'correct') cardEl.find('.badge-r').css('background', '#19a974');
      else if (data.status === 'warning') cardEl.find('.badge-r').css('background', '#f1c40f');
      else if (data.status === 'wrong') cardEl.find('.badge-r').css('background', '#e74c3c');
    });
  });




  // --- Wheel Rotation & Menu Navigation Logic ---
  let currentWheelAngle = 0;
  let currentOptionIndex = 0;
  const $options = $('.roulette-options li');
  const totalOptions = $options.length;

  // Initialize first option as active
  $options.removeClass('active');
  $($options[currentOptionIndex]).addClass('active');

  function updateActiveOption() {
    $options.removeClass('active');
    $($options[currentOptionIndex]).addClass('active');
  }

  $('.round-arrow-left').click(function () {
    // Rotation
    currentWheelAngle += 45;
    $('.wheel').css({
      'transform': 'rotate(' + currentWheelAngle + 'deg)',
      'transition': 'transform 0.5s ease'
    });

    // Navigation: Left arrow = Previous Option (A -> H -> G...)
    currentOptionIndex--;
    if (currentOptionIndex < 0) {
      currentOptionIndex = totalOptions - 1;
    }
    updateActiveOption();
  });

  $('.round-arrow-right').click(function () {
    // Rotation
    currentWheelAngle -= 45;
    $('.wheel').css({
      'transform': 'rotate(' + currentWheelAngle + 'deg)',
      'transition': 'transform 0.5s ease'
    });

    // Navigation: Right arrow = Next Option (A -> B -> C...)
    currentOptionIndex++;
    if (currentOptionIndex >= totalOptions) {
      currentOptionIndex = 0;
    }
    updateActiveOption();
  });

  // --- Level 1 to Level 2 Transition ---
  $('.next-level-1').click(function () {
    $('.level_1_05').fadeOut(500, function () {
      $('.level_2_01').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // --- Level 2 Navigation ---
  // Roadmap (level_2_01) -> Intro (level_2_02)
  // Roadmap (level_2_01) -> Intro (level_2_02)
  $('.level_2_01 .btn-go').click(function () {
    $('.level_2_01').fadeOut(500, function () {
      $('.level_2_02').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // Intro (level_2_02) -> Wheel Game (level_2_03)
  $('.next-2').click(function () {
    $('.level_2_02').fadeOut(500, function () {
      $('.level_2_03').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // --- Level 2 Submit Logic ---
  $('.btn-submit').click(function () {
    // Options are mapped by index:
    // 0: A (Haste)
    // 1: B (Smart)
    // 2: C (Cautious)
    // 3: D
    // 4: E
    // 5: F
    // 6: G
    // 7: H

    let selectedOptionIndex = currentOptionIndex;
    let score = 0;
    let feedback = "";
    let feedbackClass = ""; // correct, good, wrong

    // Remove existing classes
    $('#l2-feedback').removeClass('correct good wrong');

    if (selectedOptionIndex === 1) {
      // OPTION B: Smart
      score = 10;
      feedback = "Smart! Risks must be calculated, not blind.";
      feedbackClass = "correct";
    } else if (selectedOptionIndex === 2) {
      // OPTION C: Cautious
      score = 5;
      feedback = "Too cautious—sometimes you must explore.";
      feedbackClass = "good";
    } else {
      // OPTION A and others (D-H): Fear or Haste
      score = 0;
      feedback = "Fear or haste both hurt business.";
      feedbackClass = "wrong";
    }

    // Populate Modal
    $('#l2-score').text(score);
    $('#l2-feedback').text(feedback);
    $('#l2-feedback').addClass(feedbackClass);

    // Show Modal
    $('#level-2-result-modal').addClass('active');
  });


  // --- Close Modal ---
  $('.close-btn').click(function () {
    $('.btn-submit').hide(); // Hides the submit button after result is shown
    $('#level-2-result-modal').removeClass('active');

    // Level 2 Transition: Show Next Level Button if we are in Level 2
    if ($('.level_2_03').is(':visible')) {
      $('.next-level-2').removeClass('d-none').hide().fadeIn(500);
    }
  });

  // --- Level 1 to Level 2 Transition Trigger (Already in code but ensure flow) ---
  // Managed by .next-level-1 click

  // --- Level 2 Extra Logic ---
  // Hide arrows on submit
  $('.btn-submit').click(function () {
    $('.round-arrow').addClass('d-none');
    $('.btn-submit').addClass('d-none'); // Hide submit immediately too? User said "after submitting hide".
    // Existing handler handles logic and modal. 
  });

  // --- Level 2 -> Level 3 Transition ---
  $('.next-level-2').click(function () {
    $('.level_1').addClass('d-none');
    $('.level_2').fadeOut(500, function () {
      // Show L3 Roadmap
      $('.level_3_01').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // --- Level 3 Navigation ---
  // Roadmap (level_3_01) -> Intro (level_3_02)
  // Note: HTML uses generic .btn-go. We need to target specific context or ensure .btn-go handles it.
  // The L3 HTML I added has: <button class="btn-go btn">GO</button>
  // Let's add specific handler for L3 context if generic one doesn't cover or to be safe.
  // Roadmap (level_3_01) -> Intro (level_3_02)
  // Specific handler for Level 3
  $('#go-level-3-btn').click(function () {
    $('.level_3_01').fadeOut(500, function () {
      $('.level_3_02').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // Intro -> Game
  $('.next-3').click(function () {
    $('.level_3_02').fadeOut(500, function () {
      $('.level_3_03').removeClass('d-none').hide().fadeIn(500);
      loadL3Story(0);
    });
  });

  // --- Level 3 Game Logic (Adapted to Radio Buttons) ---
  const l3Stories = [
    {
      text: "Your product didn’t sell well in the first month.",
      options: [
        { text: "Stop business immediately.", score: 0, img: "images/LEVEL_03/BOX03.gif", feedback: "Giving up too soon!" },
        { text: "Blame customers for not buying.", score: -2, img: "images/LEVEL_03/BOX02.gif", feedback: "Blaming others won't help." },
        { text: "Survey customers and improve the product.", score: 10, img: "images/LEVEL_03/BOX01.gif", feedback: "Great! Adaptation is key." }
      ]
    },
    {
      text: "A key customer left a negative review online.",
      options: [
        { text: "Delete the review and block them.", score: 0, img: "images/LEVEL_03/BOX03.gif", feedback: "Ignoring feedback is risky." },
        { text: "Reply angrily defending your product.", score: -2, img: "images/LEVEL_03/BOX02.gif", feedback: "Anger damages reputation." },
        { text: "Apologize and ask how to fix it.", score: 10, img: "images/LEVEL_03/BOX01.gif", feedback: "Excellent! Customer service matters." }
      ]
    },
    {
      text: "You missed a major project deadline due to poor planning.",
      options: [
        { text: "Pretend it didn't happen.", score: 0, img: "images/LEVEL_03/BOX03.gif", feedback: "Denial solves nothing." },
        { text: "Blame your team members.", score: -2, img: "images/LEVEL_03/BOX02.gif", feedback: "Leaders take responsibility." },
        { text: "Admit mistake and propose a new timeline.", score: 10, img: "images/LEVEL_03/BOX01.gif", feedback: "Honesty builds trust." }
      ]
    },
  ];

  let l3CurrentStory = 0;
  let l3TotalScore = 0;

  function loadL3Story(index) {
    if (index >= l3Stories.length) {
      showL3Result();
      return;
    }

    // Reset UI
    $('input[name="level3"]').prop('checked', false);

    // Load Content
    const story = l3Stories[index];
    $('.subDiv').text(story.text); // Question Text

    // Update Cards
    const cardDivs = $('.card-Container > div');
    story.options.forEach((opt, i) => {
      if (cardDivs[i]) {
        $(cardDivs[i]).find('.cardgif').attr('src', opt.img);
        $(cardDivs[i]).find('.bottomDiv').text(opt.text);
        $(cardDivs[i]).find('input').val(i);
      }
    });
  }

  // Handle Level 3 Submit
  $('.level-3-submit-btn').click(function () {
    const selectedRadio = $('input[name="level3"]:checked');
    if (selectedRadio.length === 0) {
      $('#validation-modal p').text("Please select an option!");
      $('#validation-modal').addClass('active');
      return;
    }

    const selectedIndex = parseInt(selectedRadio.val());
    const story = l3Stories[l3CurrentStory];
    const selectedOption = story.options[selectedIndex];

    l3TotalScore += selectedOption.score;

    // Optional: Show immediate feedback? User requirements say "Feedback: That's how entrepreneurs grow" etc. 
    // which is shown in the FINAL result screen based on the prompt "after submitting... go to next level".
    // The user prompt "Feedback: ..." seems to imply final result message.

    l3CurrentStory++;
    loadL3Story(l3CurrentStory);
  });

  function showL3Result() {
    if (l3TotalScore > 20) l3TotalScore = 20;
    if (l3TotalScore < 0) l3TotalScore = 0;

    let feedback = "";
    if (l3TotalScore >= 15) feedback = "That’s how entrepreneurs grow! ✅";
    else feedback = "Blaming never solves problems. ❌";

    $('.level_3_03').fadeOut(500, function () {
      $('.level_3_05').removeClass('d-none').hide().fadeIn(500);

      // Update Result UI
      $('.level_3_05 .score').text(l3TotalScore);
      $('.level_3_05 .msgDiv .div2').text(feedback);

      // Icon logic
      if (l3TotalScore >= 15) {
        $('.level_3_05 .wrongimg').eq(0).addClass('d-none'); // Hide Wrong
        $('.level_3_05 .wrongimg').eq(1).removeClass('d-none'); // Show Tick
      } else {
        $('.level_3_05 .wrongimg').eq(0).removeClass('d-none'); // Show Wrong
        $('.level_3_05 .wrongimg').eq(1).addClass('d-none'); // Hide Tick
      }
    });
  }

  // --- Level 3 Result -> Level 4 Transition ---
  $(document).on('click', '.next-level-3', function () {
    $('.level_3_05').fadeOut(500, function () {
      $('.level_4_01').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // --- Level 4 Navigation ---
  // Roadmap -> Intro
  $('.go-level-4').click(function () {
    $('.level_4_01').fadeOut(500, function () {
      $('.level_4_02').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // Intro -> Game
  $('.next-4').click(function () {
    $('.level_4_02').fadeOut(500, function () {
      $('.level_4_03').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // --- Level 4 Game Logic ---

  // Selection Logic
  $('.option-bar').click(function () {
    const dot = $(this).find('.radio-dot');

    if (dot.hasClass('selected')) {
      dot.removeClass('selected');
    } else {
      // Count current selected
      const currentSelected = $('.radio-dot.selected').length;
      if (currentSelected < 3) {
        dot.addClass('selected');
      }
    }
  });

  // Submit Logic
  $('.level-4-submit-btn').click(function () {
    const selectedDots = $('.radio-dot.selected');

    if (selectedDots.length !== 3) {
      // Use generic modal or alert
      $('#validation-modal p').text("Please select exactly 3 statements.");
      $('#validation-modal').addClass('active');
      return;
    }

    let score = 0;

    // Scoring Map
    const scoreMap = {
      "I believe in my ideas and will work hard.": 5,
      "I should quit because others are better.": -2,
      "Every failure is a step to success.": 5,
      "I’ll wait for someone to push me.": -2,
      "I can achieve my goals with persistence.": 5,
      "I doubt my abilities.": -2
    };

    selectedDots.each(function () {
      // Find the text in the sibling span
      const text = $(this).siblings('span').text().trim();
      if (scoreMap.hasOwnProperty(text)) {
        score += scoreMap[text];
      }
    });

    // Bonus Logic (Max 20)
    // If they got all 3 correct (5+5+5=15), give bonus 5 to make it 20? 
    // "Max = 20". Let's assume perfect selection gets max score.
    if (score === 15) {
      score = 20;
    }

    // Clamp
    if (score < 0) score = 0;

    // Show Result
    $('.level_4_03').fadeOut(500, function () {
      $('.level_4_last').removeClass('d-none').hide().fadeIn(500);

      // Update Score
      $('.level_4_last .score-value').text(score);

      // Update Progress Bar
      const percentage = (score / 20) * 100;
      $('.progress-fill').css('height', percentage + '%');

      // Add Next Level button if missing
      if ($('.next-level-4').length === 0) {
        $('.level_4_last').append('<button class="next-btn next-level-4" style="position:absolute; bottom: 20px; right: 20px;">NEXT LEVEL</button>');
      }
    });
  });

  // --- Level 5 Navigation ---

  // L4 Result -> L5 Map
  $(document).on('click', '.next-level-4', function () {
    $('.level_4_last').fadeOut(500, function () {
      $('.level_5_01').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // Map -> Intro
  $('.go-level-5').click(function () {
    $('.level_5_01').fadeOut(500, function () {
      $('.level_5_02').removeClass('d-none').hide().fadeIn(500);
    });
  });

  // Intro -> Game
  $('.next-5').click(function () {
    $('.level_5_02').fadeOut(500, function () {
      $('.level_5_03').removeClass('d-none').hide().fadeIn(500);
      resetL5Game();
    });
  });

  // --- Level 5 Game Logic ---

  function resetL5Game() {
    $('.l5-option').removeClass('selected');
  }

  // Selection
  $('.l5-option').click(function () {
    $('.l5-option').removeClass('selected');
    $(this).addClass('selected');
  });

  // Submit
  $('.level-5-submit-btn').click(function () {
    const selected = $('.l5-option.selected');
    if (selected.length === 0) {
      $('#validation-modal p').text("Please select an option!");
      $('#validation-modal').addClass('active');
      return;
    }

    const choiceId = parseInt(selected.data('option'));
    let score = 0;
    let feedbackText = "";
    let isCorrect = false;

    // Scoring Logic
    if (choiceId === 1) { // Wait more
      score = -2;
      feedbackText = "Delays cost money and trust. ❌";
      isCorrect = false;
    } else if (choiceId === 2) { // Alternative supplier
      score = 10;
      feedbackText = "Right on time—decisive action keeps business alive. ✅";
      isCorrect = true;
    } else if (choiceId === 3) { // Stop production
      score = 0;
      feedbackText = "Stopping production halts progress. ❌";
      isCorrect = false;
    }

    const scoreDisplay = (score > 0) ? "+" + score : score;

    // Update Result UI
    $('.l5-score-val').text(scoreDisplay);
    $('.l5-fb-text').text(feedbackText);

    if (isCorrect) {
      $('.l5-points-pill').css('background', '#f1c40f'); // Yellow
      $('.l5-fb-icon.correct').removeClass('d-none');
      $('.l5-fb-icon.wrong').addClass('d-none');
    } else {
      if (score < 0) $('.l5-points-pill').css('background', '#e74c3c'); // Red
      else $('.l5-points-pill').css('background', '#95a5a6'); // Grey

      $('.l5-fb-icon.correct').addClass('d-none');
      $('.l5-fb-icon.wrong').removeClass('d-none');
    }

    // Transition: Fade out options, Fade in Result
    $('.level-5-options').fadeOut(500, function () {
      $('.level-5-result').removeClass('d-none').css('display', 'flex').hide().fadeIn(500);

      // Show Next Last button after 4 seconds
      setTimeout(function () {
        $('.next-last').removeClass('d-none').hide().fadeIn(500);
      }, 4000);
    });
  });

  // --- Final Scene Logic ---
  $('.next-last').click(function () {
    // Hide Level 5
    $('.level_5').fadeOut(500, function () {
      $('.scene.last').removeClass('d-none').hide().fadeIn(500);
    });

    // Calculate Total Score
    let s1 = parseInt($('.score-chart .point span').text()) || 0;
    let s2 = parseInt($('#l2-score').text()) || 0;
    let s3 = (typeof l3TotalScore !== 'undefined') ? l3TotalScore : 0;
    let s4 = parseInt($('.level_4_last .score-value').text()) || 0;
    let s5 = parseInt($('.level-5-result .l5-score-val').text().replace('+', '')) || 0;

    let totalScore = s1 + s2 + s3 + s4 + s5;

    // Cap at 100? (20*5 = 100 max presumably)
    if (totalScore < 0) totalScore = 0;

    // Display in Final Scoreboard
    $('.scene.last .l5-score-val').text(totalScore);

    // Update specific text for final scene
    $('.scene.last .l5-score-header').text("TOTAL SCORE");
    $('.scene.last .l5-fb-text').text("Outstanding! You have mastered the qualities of an entrepreneur.");

    // Hide icons logic for final scene if needed, or ensure tick is shown
    $('.scene.last .l5-fb-icon').addClass('d-none');
    $('.scene.last .l5-fb-icon.correct').removeClass('d-none');

    // Hide close button in final result board
    $('.scene.last .l5-close-btn').hide();
  });

  // Redo Button
  $(document).on('click', '.redo-btn', function () {
    location.reload();
  });
});