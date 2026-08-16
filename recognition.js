let model = null;

let selectedImage = null;


// ===============================
// ELEMENTS
// ===============================

const imageInput =
    document.getElementById("imageInput");

const selectImageBtn =
    document.getElementById("selectImageBtn");

const previewImage =
    document.getElementById("previewImage");

const emptyPreview =
    document.getElementById("emptyPreview");

const recognizeBtn =
    document.getElementById("recognizeBtn");

const modelStatus =
    document.getElementById("modelStatus");

const predictionLoading =
    document.getElementById("predictionLoading");

const resultsSection =
    document.getElementById("resultsSection");

const topPrediction =
    document.getElementById("topPrediction");

const confidenceFill =
    document.getElementById("confidenceFill");

const confidenceText =
    document.getElementById("confidenceText");

const predictionList =
    document.getElementById("predictionList");

const clearResult =
    document.getElementById("clearResult");


// ===============================
// LOAD MODEL
// ===============================

async function loadModel() {

    try {

        modelStatus.textContent =
            "Loading AI Model...";

        model =
            await mobilenet.load();

        modelStatus.textContent =
            "✓ AI Model Ready";

        modelStatus.style.color =
            "#20a85b";

        console.log(
            "MobileNet loaded successfully."
        );

    } catch (error) {

        console.error(error);

        modelStatus.textContent =
            "Model Loading Failed";

        modelStatus.style.color =
            "#d32f2f";
    }
}


// ===============================
// SELECT IMAGE
// ===============================

selectImageBtn.addEventListener(
    "click",
    function () {

        imageInput.click();

    }
);


// ===============================
// IMAGE CHANGE
// ===============================

imageInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image."
            );

            return;
        }

        selectedImage = file;

        const imageURL =
            URL.createObjectURL(file);

        previewImage.src = imageURL;

        previewImage.style.display =
            "block";

        emptyPreview.style.display =
            "none";

        recognizeBtn.disabled = false;

        resultsSection.style.display =
            "none";
    }
);


// ===============================
// RECOGNIZE IMAGE
// ===============================

recognizeBtn.addEventListener(
    "click",
    async function () {

        if (!model) {

            alert(
                "AI model is still loading. Please wait."
            );

            return;
        }

        if (!selectedImage) {

            alert(
                "Please select an image first."
            );

            return;
        }

        predictionLoading.style.display =
            "block";

        resultsSection.style.display =
            "none";

        recognizeBtn.disabled = true;


        try {

            const predictions =
                await model.classify(
                    previewImage,
                    5
                );

            showPredictions(
                predictions
            );

            saveHistory(
                predictions
            );

        } catch (error) {

            console.error(error);

            alert(
                "Image recognition failed."
            );

        } finally {

            predictionLoading.style.display =
                "none";

            recognizeBtn.disabled = false;
        }

    }
);


// ===============================
// DISPLAY RESULTS
// ===============================

function showPredictions(predictions) {

    if (
        !predictions ||
        predictions.length === 0
    ) {

        topPrediction.textContent =
            "No object detected";

        confidenceText.textContent =
            "0%";

        return;
    }


    const top =
        predictions[0];

    const topName =
        formatPredictionName(
            top.className
        );

    const topProbability =
        top.probability * 100;


    topPrediction.textContent =
        topName;

    confidenceText.textContent =
        topProbability.toFixed(2) + "%";

    confidenceFill.style.width =
        topProbability + "%";


    predictionList.innerHTML = "";


    predictions.forEach(
        function (prediction) {

            const name =
                formatPredictionName(
                    prediction.className
                );

            const probability =
                prediction.probability * 100;


            const item =
                document.createElement("div");

            item.className =
                "prediction-item";


            item.innerHTML = `

                <div class="prediction-name">

                    <span>${name}</span>

                    <strong>
                        ${probability.toFixed(2)}%
                    </strong>

                </div>

                <div class="prediction-bar">

                    <div
                        class="prediction-fill"
                        style="width:${probability}%">
                    </div>

                </div>

            `;


            predictionList.appendChild(
                item
            );

        }
    );


    resultsSection.style.display =
        "block";
}


// ===============================
// FORMAT NAME
// ===============================

function formatPredictionName(name) {

    return name
        .split(",")[0]
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


// ===============================
// SAVE HISTORY
// ===============================

function saveHistory(predictions) {

    const top =
        predictions[0];

    const history =
        JSON.parse(
            localStorage.getItem(
                "recognitionHistory"
            )
        ) || [];


    const record = {

        id: Date.now(),

        prediction:
            formatPredictionName(
                top.className
            ),

        confidence:
            (top.probability * 100)
                .toFixed(2),

        date:
            new Date().toLocaleString()

    };


    history.unshift(record);


    if (history.length > 50) {

        history.pop();

    }


    localStorage.setItem(
        "recognitionHistory",
        JSON.stringify(history)
    );
}


// ===============================
// CLEAR RESULT
// ===============================

clearResult.addEventListener(
    "click",
    function () {

        resultsSection.style.display =
            "none";

        topPrediction.textContent =
            "--";

        confidenceText.textContent =
            "0%";

        confidenceFill.style.width =
            "0%";

        predictionList.innerHTML =
            "";

    }
);


// ===============================
// START
// ===============================

loadModel();