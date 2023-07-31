// This function will display the exercise statistics on the stats page while ensuring the stats are placed in the correct exercise divs, under the correct dates, and in the correct order.

function displayStatistics() {
    var exerciseDivs = [
        { exerciseName: 'Incline Dumbbell Bench Press', divId: 'InclineDumbbellBenchPress' },
        { exerciseName: 'Barbell Row', divId: 'BarbellRow' },
        { exerciseName: 'Overhead Press', divId: 'OverheadPress' },
        { exerciseName: 'Lat Pulldown', divId: 'LatPulldown' },
        { exerciseName: 'Cable Fly', divId: 'CableFly' },
        { exerciseName: 'Lateral Dumbbell Raise', divId: 'LateralDumbbellRaise' },
        { exerciseName: 'Seated Incline Bicep Curl', divId: 'SeatedInclineBicepCurl' },
        { exerciseName: 'Cable Overhead Tricep Extension', divId: 'CableOverheadTricepExtension' },
        { exerciseName: 'Barbell Squat', divId: 'BarbellSquat'},
        { exerciseName: 'Romanian Deadlift', divId: 'RomanianDeadlift'},
        { exerciseName: 'Bulgarian Split-Squat', divId: 'BulgarianSplit-Squat'},
        { exerciseName: 'Lying Leg-Curl', divId: 'LyingLeg-Curl'},
        { exerciseName: 'Standing Calf-Raise', divId: 'StandingCalf-Raise'},
        { exerciseName: 'Seated Calf-Raise', divId: 'SeatedCalf-Raise'}
    ];

    exerciseDivs.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));

        var setsByDateAndExercise = {};

        for (var i = 0; i < exerciseDivs.length; i++) {
            var exerciseName = exerciseDivs[i].exerciseName;
            var spacelessExerciseName = exerciseName.split(" ").join("");
            var exerciseDiv = document.getElementById(exerciseDivs[i].divId);

            for (var j = 0; j < localStorage.length; j++) {
                var key = localStorage.key(j);
                var value = localStorage.getItem(key);

                if (key.toLowerCase().includes(spacelessExerciseName.toLowerCase())) {
                    var date = key.slice(0, 10);
                    var setNumberMatch = key.match(/Set: (\d+)/);
                    var setNumber = setNumberMatch ? parseInt(setNumberMatch[1]) : null;

                    if (!setsByDateAndExercise[date]) {
                        setsByDateAndExercise[date] = {};
                    }

                    if (!setsByDateAndExercise[date][exerciseName]) {
                        setsByDateAndExercise[date][exerciseName] = {};
                    }

                    setsByDateAndExercise[date][exerciseName][setNumber] = value;
                }
            }

            var dates = Object.keys(setsByDateAndExercise).sort((a, b) => new Date(b) - new Date(a));

            dates.forEach(function (date) {
                var setsForExerciseAndDate = setsByDateAndExercise[date][exerciseName];
                if (setsForExerciseAndDate) {
                    var dateOfExercise = document.createElement("div");
                    dateOfExercise.innerHTML = `<h2>${date}:</h2>`;

                    var sortedSets = Object.keys(setsForExerciseAndDate).map(Number).sort((a, b) => a - b);
                    sortedSets.forEach(function (setNumber) {
                        var exerciseStats = document.createElement("p");
                        exerciseStats.innerHTML = `<strong>Set ${setNumber}:</strong> ${setsForExerciseAndDate[setNumber]}`;
                        dateOfExercise.appendChild(exerciseStats);
                    });

                    exerciseDiv.appendChild(dateOfExercise);
                }
            });
        }
    }

// This function allows the active page to show the correct information and forms, while the non active pages stay hidden

let activePage = 1;

function showWorkoutForms() {
    const currentPage = document.querySelector('.workout.is-active');
    if (currentPage) {
        currentPage.classList.remove('is-active');
    }

    const nextPage = document.querySelector(`.workout[data-page="${activePage}"]`);
    if (nextPage) {
        nextPage.classList.add('is-active');
    }
}

// This function switches between workout after clicking on the appropriate tab

window.addEventListener('DOMContentLoaded', () => {
    const tabSwitchers = document.querySelectorAll('[data-switcher]');

    for (let i = 0; i < tabSwitchers.length; i++) {
        const tabSwitcher = tabSwitchers[i];
        const pageId = tabSwitcher.dataset.tab;

        tabSwitcher.addEventListener("click", () => {
            document.querySelector('.tabs .tab.is-active').classList.remove('is-active');
            tabSwitcher.parentNode.classList.add('is-active');

            switchPage(pageId);
        });
    }

});

// This function switches between exercise tabs and displays the relevant information and forms

function switchPage(pageId) {
    activePage = pageId;
    showWorkoutForms();
}

// This function retrieves the number of reps for a given set

function getRepsData(exerciseName, setNumber) {
    var exerciseDiv = document.getElementById(exerciseName);
    var form = exerciseDiv.querySelector(`form[data-set="${setNumber}"]`);
    var repsInput = form.querySelector('.repsData');
    return repsInput.value;
}

// This function retrieves the weight lifted for a given set

function getWeightData(exerciseName, setNumber) {
    var exerciseDiv = document.getElementById(exerciseName);
    var form = exerciseDiv.querySelector(`form[data-set="${setNumber}"]`);
    var weightInput = form.querySelector('.weightData');
    return weightInput.value;
}

// This function validates the reps input

function validateInput(reps) {
    return reps > 0;
}

// This function formats the reps and weight into a string

function formatStats(reps, weight) {
    return `Reps: ${reps}. Weight: ${weight}kg.`;
}

// This functions finds the next set number for the current exercise on the current date

function getNextSetNumber(formattedDate, exerciseName) {
    var exerciseSets = [];
    for (var j = 0; j < localStorage.length; j++) {
        var key = localStorage.key(j);
        if (key.toLowerCase().includes(`${formattedDate} ${exerciseName.toLowerCase()}`)) {
            var setNumberMatch = key.match(/Set: (\d+)/);
            var currentSetNumber = setNumberMatch ? parseInt(setNumberMatch[1]) : null;
            if (currentSetNumber) {
                exerciseSets.push(currentSetNumber);
            }
        }
    }
    return exerciseSets.length > 0 ? Math.max(...exerciseSets) + 1 : 1;
}

// This function saves the statistics in local storage

function saveStatsToLocalStorage(formattedDate, exerciseName, setNumber, stats) {
    var key = `${formattedDate} ${exerciseName} Set: ${setNumber}`;
    localStorage.setItem(key, stats);
}

// This function displays the set number, reps, and weights in the statsDiv

function displayStatsOnPage(stats, dataPageNumber) {
    const currentPage = document.querySelector('.workout.is-active');
    if (!setNumberObj.hasOwnProperty(dataPageNumber)) {
        setNumberObj[dataPageNumber] = 1;
    }
    var setNumber = setNumberObj[dataPageNumber];
    var statsElement = document.createElement('div');
    statsElement.innerHTML = `<p><strong>Set ${setNumber}:</strong> ${stats}</p>`;
    setNumber++;
    setNumberObj[dataPageNumber] = setNumber;
    var statsDivs = currentPage.getElementsByClassName('statsDiv');
    for (var i = 0; i < statsDivs.length; i++) {
        statsDivs[i].appendChild(statsElement.cloneNode(true));
    }
}

// This function handles input data for the exercise, validates it, save the stats in local storage, and displays them in the statsDiv

const setNumberObj = {};

function showData(exerciseName, setNumber) {
    var reps = getRepsData(exerciseName, setNumber);
    var weight = getWeightData(exerciseName, setNumber);

    if (validateInput(reps)) {
        var stats = formatStats(reps, weight);

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);

        var nextSetNumber = getNextSetNumber(formattedDate, exerciseName);

        saveStatsToLocalStorage(formattedDate, exerciseName, nextSetNumber, stats);

        const currentPage = document.querySelector('.workout.is-active');
        const dataPageNumber = currentPage.dataset.page;

        displayStatsOnPage(stats, dataPageNumber);
    } else {
        var exerciseDiv = document.getElementById(exerciseName);
        var form = exerciseDiv.querySelector(`form[data-set="${setNumber}"]`);
        var errorElement = form.querySelector('.error');
        if (errorElement) {
            errorElement.textContent = 'Error: Please enter a valid number of reps.';
        }
    }
}



// This function saves the input data on submit and displays it in the statsDiv

function saveData(event, exerciseName, setNumber) {
    event.preventDefault();
    showData(exerciseName, setNumber);
}

// This function creates a collapsible button for the stats page.

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// This function allows the user to switch to the next form after submitting the current form.

const formNumbers = {};

function switchForm() {
    const currentPage = document.querySelector('.workout.is-active');
    const dataPageNumber = currentPage.dataset.page;

    if (!formNumbers.hasOwnProperty(dataPageNumber)) {
        formNumbers[dataPageNumber] = 1;
    }

    var currentFormNumber = formNumbers[dataPageNumber];

    var formHide = currentPage.querySelector(`.form${currentFormNumber}`);
    formHide.style.display = "none";

    currentFormNumber++;
    var formShow = currentPage.querySelector(`.form${currentFormNumber}`);
    formShow.style.display = "block";

    formNumbers[dataPageNumber] = currentFormNumber;
}

// This function creates an interactive menu when viewing on mobile or tablet

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.querySelector('.links');
    const openMenu = document.querySelector('.openMenu');
    const closeMenu = document.querySelector('.closeMenu');

    openMenu.addEventListener('click', show);
    closeMenu.addEventListener('click', close);

    function show() {
        mainMenu.style.display = "flex";
        mainMenu.style.top = "0";
    }

    function close() {
        mainMenu.style.top = "-150%";
    }
});

