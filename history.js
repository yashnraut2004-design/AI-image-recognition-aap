const historyList =
    document.getElementById(
        "historyList"
    );

const noHistory =
    document.getElementById(
        "noHistory"
    );

const clearHistoryButton =
    document.getElementById(
        "clearHistory"
    );


// ===============================
// LOAD HISTORY
// ===============================

function loadHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "recognitionHistory"
            )
        ) || [];


    historyList.innerHTML =
        "";


    if (history.length === 0) {

        noHistory.style.display =
            "block";

        return;
    }


    noHistory.style.display =
        "none";


    history.forEach(
        function (item) {

            const historyItem =
                document.createElement(
                    "div"
                );

            historyItem.className =
                "history-item";


            historyItem.innerHTML = `

                <div class="history-info">

                    <h3>
                        🤖 ${item.prediction}
                    </h3>

                    <p>
                        ${item.date}
                    </p>

                </div>


                <div class="history-confidence">

                    ${item.confidence}%

                </div>


                <button
                    class="delete-history"
                    onclick="deleteHistory(${item.id})">

                    🗑️ Delete

                </button>

            `;


            historyList.appendChild(
                historyItem
            );

        }
    );
}


// ===============================
// DELETE ONE
// ===============================

function deleteHistory(id) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "recognitionHistory"
            )
        ) || [];


    history =
        history.filter(
            item => item.id !== id
        );


    localStorage.setItem(
        "recognitionHistory",
        JSON.stringify(history)
    );


    loadHistory();
}


// ===============================
// CLEAR ALL
// ===============================

clearHistoryButton.addEventListener(
    "click",
    function () {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "recognitionHistory"
                )
            ) || [];


        if (history.length === 0) {

            alert(
                "History is already empty."
            );

            return;
        }


        const confirmDelete =
            confirm(
                "Are you sure you want to delete all history?"
            );


        if (!confirmDelete) {
            return;
        }


        localStorage.removeItem(
            "recognitionHistory"
        );


        loadHistory();
    }
);


// ===============================
// START
// ===============================

loadHistory();