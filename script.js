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
            var exerciseDiv = document.getElementById(exerciseDivs[i].divId);
            if (!exerciseDiv) {
                console.error(`Element with ID ${exerciseDivs[i].divId} not found.`);
                continue;
            }

            var exerciseName = exerciseDivs[i].exerciseName;
            var spacelessExerciseName = exerciseName.split(" ").join("");

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

            var statisticsForExercise = [];

            Object.keys(setsByDateAndExercise).forEach(function (date) {
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

                    statisticsForExercise.push(dateOfExercise);
                }
            });

            exerciseDiv.innerHTML = '';
            statisticsForExercise.forEach(function (stat) {
                exerciseDiv.appendChild(stat);
            });
        }
    }

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

function switchPage(pageId) {
    activePage = pageId;
    showWorkoutForms();
}


function showData(exerciseName, setNumber) {
    var exerciseDiv = document.getElementById(exerciseName);
    var form = exerciseDiv.querySelector(`form[data-set="${setNumber}"]`);
    var repsInput = form.querySelector('.repsData');
    var weightInput = form.querySelector('.weightData');
    var errorElement = form.querySelector('.error');

    var reps = repsInput.value;
    var weight = weightInput.value;

    if (reps > 0) {
        var stats = `Reps: ${reps}. Weight: ${weight}kg.`;

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().slice(0, 10);

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

        var nextSetNumber = exerciseSets.length > 0 ? Math.max(...exerciseSets) + 1 : 1;

        var key = `${formattedDate} ${exerciseName} Set: ${nextSetNumber}`;
        localStorage.setItem(key, stats);

        var statsElement = document.createElement('div');
        statsElement.textContent = stats;
        form.replaceWith(statsElement);
    } else {
        if (errorElement) {
            errorElement.textContent = 'Error: Please enter a valid number of reps.';
        }
    }
}


function saveData(event, exerciseName, setNumber) {
    event.preventDefault();
    showData(exerciseName, setNumber);
}


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
