let timeRemaining = 300;
    let score = 0;
    let hintCount = 0;
    const maxHints = 4;
    let correctSuspect = Math.floor(Math.random() * 8); // Randomly choose one of 8 suspects
    let currentClueIndex = 0;

    const backstory = `
    The night of the grand gala at the prestigious Metropolitan Art Museum was meant to be a celebration of culture and creativity. Crowds of wealthy patrons, renowned critics, and art enthusiasts gathered to admire the museum’s most prized possession: Picasso’s The Dreamer.

    As the evening progressed, the lights suddenly flickered, and a security alarm echoed through the grand hall. When order was restored, a chilling discovery was made—the Picasso was gone, leaving behind an empty display case and a trail of tantalizing clues.

    The theft was executed with precision, leaving law enforcement baffled. Eight individuals, each with a possible motive and a suspicious history, were at the gala that evening. Could one of them have orchestrated the daring heist? As time runs out, it's up to you to piece together the clues and unmask the culprit before the masterpiece vanishes forever.`;

    document.getElementById("story").textContent = backstory;

    // Suspect data
    const suspects = [
      {
        name: "Isabella Montague",
        backstory: "A wealthy heiress and art collector with a notorious reputation for acquiring masterpieces at any cost. Her private gallery is rumored to contain rare works obtained through questionable means.  With her resources, she could easily smuggle it into her private collection.  Her repeated inquiries about the painting's security protocol raised eyebrows.",
        clues: [
          "A silk glove matching her gown was found near the display case.",
          "Security footage shows her lingering around the vault moments before the power outage.",
          "A receipt for a private jet charter to a remote island was discovered in her purse.",
          "Her fingerprints were found on the glass of the now-empty display case."
        ]
      },
      {
        name: "Leonard DuPont",
        backstory: "A cynical art critic known for his biting reviews and disdain for modern museum practices. His latest exposé targeted the museum’s inadequate security measures, sparking controversy.  Leonard’s public criticism of the museum may have been a smokescreen for planning the heist. Some believe he wanted to embarrass the institution and prove his theories right.",
        clues: [
          "Traces of ink, matching the type used in his fountain pen, were found on the vault keypad.",
          "A piece of paper with a schematic of the vault was found in his coat pocket.",
          "A torn page from an art review journal was discovered near the control room.",
          "Witnesses heard him discussing Picasso's works in suspicious detail."
        ]
      },
      {
        name: "Sophia Trevino",
        backstory: "A former gallery assistant who was dismissed under murky circumstances. Sophia has always claimed she was framed for a theft she didn’t commit.  Her termination left her bitter and vengeful. Sophia was seen lurking near restricted areas throughout the evening and seemed unusually nervous when questioned by security.",
        clues: [
          "She was seen nervously pacing near the vault.",
          "A small sketch of *The Dreamer* was found in her discarded belongings.",
          "Her employee badge was used to access restricted areas.",
          "Security logs show unauthorized access from her old credentials."
        ]
      },
      {
        name: "Victor Kane",
        backstory: "A suave and charismatic philanthropist with a dark past. Victor has been implicated in several high-profile art thefts but has never been convicted.   Victor’s charm allowed him to manipulate staff and guests alike, but his unexplained interactions with a black-market art dealer are hard to ignore.",
        clues: [
          "A rare tool used to bypass locks was found in his car.",
          "Witnesses reported seeing him 'accidentally' bump into a security guard.",
          "A cufflinks were found near the empty display.",
          "An encrypted message on his phone hinted at a meeting with a black-market dealer."
        ]
      },
      {
        name: "Eleanor King",
        backstory: "A brilliant but eccentric art historian obsessed with Picasso’s work. Eleanor has published dozens of papers on The Dreamer and once argued it belonged in her research collection.  Eleanor’s heated argument with the curator earlier in the evening raised suspicions, as did her repeated mentions of The Dreamer's 'historical importance.'",
        clues: [
          "Her glasses were left behind near the crime scene.",
          "Security footage shows her arguing with the museum curator earlier that night.",
          "A fragment of a handwritten research paper about *The Dreamer* was found in her bag.",
          "A torn magazine article about the Dreamer was found in the vault."
        ]
      },
      {
        name: "Marco Rivera",
        backstory: "A seasoned security guard with a spotless record—until now. Marco’s involvement in previous museum incidents has always been dismissed as coincidence.  Marco’s financial troubles and recent disciplinary actions might have pushed him to make a desperate move.  Marco left his post during the blackout and was seen exiting the building shortly before the Picasso was discovered missing.",
        clues: [
          "Witnesses saw him leaving the gala unusually early.",
          "The keycard logs show unauthorized access from his ID.",
          "His uniform had traces of paint matching the stolen frame.",
          "His bank account received a sudden large deposit after the theft."
        ]
      },
      {
        name: "Beatrix Lang",
        backstory: "A rising star in the art world, Beatrix has gained fame for her provocative works critiquing institutional art culture. She has accused the museum of neglecting contemporary artists.  Beatrix’s public feud with the museum made her a prime suspect. She claimed stealing The Dreamer would force the institution to “acknowledge true artistry.”  Beatrix was seen carrying an oversized bag, and her cryptic comments about “making history” have fueled speculation.",
        clues: [
          "A gallery invitation marked with her name was found near the control room.",
          "A paintbrush was found in the suspect's bag.",
          "Witnesses overheard her muttering, 'They'll finally notice me now.'",
          "Security footage showed her carrying a suspiciously large bag."
        ]
      },
      {
        name: "Richard Beaumont",
        backstory: "A rival museum director with a deep rivalry against the Metropolitan Art Museum. Richard has often expressed envy over their superior collection.  Stealing The Dreamer would deal a devastating blow to his competitors and elevate the prestige of his own museum.  Richard’s late-night meetings with unidentified individuals and his access to blueprints of the museum make him a strong suspect.",
        clues: [
          "A copy of the vault’s layout was found in his briefcase.",
          "His shoes had traces of paint and dust from the vault area.",
          "Witnesses reported hearing him say, 'It's a shame this masterpiece is wasted here.'",
          "His car was parked near an unauthorized exit."
        ]
      }
    ];
    

    const suspectsList = document.getElementById("suspects-list");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score");
    const hintText = document.getElementById("hint-text");
    const endScreen = document.getElementById("end-screen");
    const endMessage = document.getElementById("end-message");
    const mainMenu = document.getElementById("game-container");
    const suspectsPage = document.getElementById("suspects-page");
    const suspectsButton = document.getElementById("suspects-button");
    const backButton = document.getElementById("back-button");
    const restartButton = document.getElementById("restart-button");
    const hintButton = document.getElementById("hint-button");
    let timer;

    // Populate suspects
    suspects.forEach((suspect, index) => {
      const suspectDiv = document.createElement("div");
      suspectDiv.classList.add("suspect");
      suspectDiv.innerHTML = `
        <h4>${suspect.name}</h4>
        <p>${suspect.backstory}</p>
        <button class="suspect-button" data-index="${index}">Accuse</button>
      `;
      suspectsList.appendChild(suspectDiv);
    });

    // Timer function
    function startTimer() {
      if (!timer) {
        timer = setInterval(() => {
          if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
          } else {
            clearInterval(timer);
            endGame(false);
          }
        }, 1000);
      }
    }

    startTimer();

    // Show suspects page
    suspectsButton.addEventListener("click", () => {
      mainMenu.classList.add("hidden");
      suspectsPage.classList.remove("hidden");
    });

    // Back to main menu
    backButton.addEventListener("click", () => {
      suspectsPage.classList.add("hidden");
      mainMenu.classList.remove("hidden");
    });

    // Handle hints
    hintButton.addEventListener("click", () => {
      if (hintCount < maxHints) {
        const hint = suspects[correctSuspect].clues[currentClueIndex];
        hintText.textContent = `Hint ${hintCount + 1}: ${hint}`;
        currentClueIndex = (currentClueIndex + 1) % suspects[correctSuspect].clues.length;
        hintCount++;
        score -= 5;
        scoreDisplay.textContent = score;
      } else {
        hintText.textContent = "No more hints available!";
      }
    });

    // Handle accusations
    document.querySelectorAll(".suspect-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const suspectIndex = parseInt(event.target.dataset.index);
        if (suspectIndex === correctSuspect) {
          score += 15;
          endGame(true);
        } else {
          score -= 10;
          scoreDisplay.textContent = score;
          alert("Incorrect suspect! Try again.");
        }
      });
    });

    // End game
    function endGame(won) {
      clearInterval(timer);
      timer = null; // Reset the timer for replay
      mainMenu.classList.add("hidden");
      suspectsPage.classList.add("hidden");
      endScreen.classList.remove("hidden");

      const suspect = suspects[correctSuspect];
      endMessage.innerHTML = won
        ? `Congratulations! You solved the mystery! The culprit was ${suspect.name}. <br> Final Score: ${score}`
        : `Time's up! The culprit was ${suspect.name}. <br> Final Score: ${score}`;
    }

    // Restart game
    restartButton.addEventListener("click", () => {
      location.reload(); // Reload the game
    });
