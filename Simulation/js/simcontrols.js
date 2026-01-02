$(document).ready(function () {
  let startTime = Date.now();
  let dropCount = 0;

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
    let selectedCards = []; // To look up full feedback if needed, but we can map from text.

    $('.bubble').each(function () {
      if (!$(this).hasClass('invisible-bubble')) {
        collectedAnswers.push($(this).text().trim());
      }
    });

    if (collectedAnswers.length < 3) {
      alert("Please select 3 items before submitting.");
      return;
    }

    // Scoring Logic
    let score = 0;
    let correctSet = new Set(['A', 'B', 'E']);
    let feedbackMsg = "";

    // Map for feedback quotes
    const feedbackData = {
      'A': "✅ Riya starts an online thrift store after noticing college students’ demand for budget fashion.\n(Clear proactive step, spotting demand and acting fast.)\n",
      'B': "✅ Amit designs an app for his school after seeing issues in attendance tracking, though he knows it may need upgrades later.\n(Shows initiative even with imperfections, balancing quick action + learning mindset.)\n",
      'C': "⚠️ Neha waits until her uncle gives her advice before finalizing her shop idea.\n(Some initiative shown, but slowed by over-dependence on others.)\n",
      'D': "⚠️ Raj keeps postponing his website launch because he wants it perfect before showing anyone.\n(Care about quality is good, but waiting too long shows missed opportunity.)\n",
      'E': "✅ Simran begins selling handmade soaps when neighbors request them, planning to refine her product as demand grows.\n(Takes action and tests the idea with real customers—initiative + adaptability.)\n",
      'F': "❌ Arjun ignores a friend’s call about discussing a business idea since he feels it may not be serious.\n(Missed opportunity, shows lack of initiative.)\n"
    };

    collectedAnswers.forEach(ans => {
      if (correctSet.has(ans)) {
        score += 5;
      } else {
        score -= 1;
      }
      if (feedbackData[ans]) {
        feedbackMsg += feedbackData[ans] + "\n";
      }
    });

    // Time Bonus
    let endTime = Date.now();
    let timeTaken = (endTime - startTime) / 1000;
    if (timeTaken < 30) {
      score += 5;
    }

    if (score > 20) score = 20;

    // Log Score
    console.log("score1 = " + score);

    // Show Feedback
    // alert(feedbackMsg);

    // Optional: Redirect or visual Success if score is good?
    // User request was simple: console score and show feedback quotes.
  });
});