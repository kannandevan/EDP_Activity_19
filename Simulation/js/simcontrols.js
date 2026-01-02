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
  $('.next-btn').click(function () {
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
});