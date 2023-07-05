
//Function for switching workout tabs//

window.onload = () => {
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
}

function switchPage(pageId) {
    const currentPage = document.querySelector('.upperWorkouts .workout.is-active');
    currentPage.classList.remove('is-active');

    const nextPage = document.querySelector(`.upperWorkouts .workout[data-page="${pageId}"]`);
    nextPage.classList.add('is-active');
}


function showData(setNumber) {
    var form = document.querySelector(`form[data-set="${setNumber}"]`);
    var repsInput = form.querySelector(".repsData");
    var weightInput = form.querySelector(".weightData");

    var reps = repsInput.value;
    var weight = weightInput.value;

    if (reps > 0) {
        var stats = document.createElement("div");
        stats.textContent = `Reps: ${reps}. Weight: ${weight}kg.`;

        form.replaceWith(stats);
    } else {
        var errorElement = form.querySelector(".error");
        if (errorElement) {
            errorElement.textContent = "Error: Please enter a valid number of reps.";
        }
    }

}

function saveData(event, setNumber) {
    event.preventDefault();
    showData(setNumber);

}





