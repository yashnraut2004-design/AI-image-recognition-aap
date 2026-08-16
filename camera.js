let cameraModel = null;

let cameraStream = null;


const video =
    document.getElementById(
        "cameraVideo"
    );

const canvas =
    document.getElementById(
        "cameraCanvas"
    );

const startButton =
    document.getElementById(
        "startCamera"
    );

const captureButton =
    document.getElementById(
        "captureBtn"
    );

const stopButton =
    document.getElementById(
        "stopCamera"
    );

const placeholder =
    document.getElementById(
        "cameraPlaceholder"
    );

const prediction =
    document.getElementById(
        "cameraPrediction"
    );

const status =
    document.getElementById(
        "cameraModelStatus"
    );


// ===============================
// LOAD MODEL
// ===============================

async function loadCameraModel() {

    try {

        status.textContent =
            "Loading AI Model...";

        cameraModel =
            await mobilenet.load();

        status.textContent =
            "✓ AI Model Ready";

        status.style.color =
            "#20a85b";

    } catch (error) {

        console.error(error);

        status.textContent =
            "Model Loading Failed";
    }
}


// ===============================
// START CAMERA
// ===============================

startButton.addEventListener(
    "click",
    async function () {

        try {

            cameraStream =
                await navigator.mediaDevices
                    .getUserMedia({

                        video: {
                            facingMode: "environment"
                        },

                        audio: false

                    });


            video.srcObject =
                cameraStream;

            video.style.display =
                "block";

            placeholder.style.display =
                "none";

            startButton.disabled =
                true;

            captureButton.disabled =
                false;

            stopButton.disabled =
                false;

        } catch (error) {

            console.error(error);

            alert(
                "Camera access denied or unavailable."
            );
        }
    }
);


// ===============================
// CAPTURE & RECOGNIZE
// ===============================

captureButton.addEventListener(
    "click",
    async function () {

        if (!cameraModel) {

            alert(
                "AI model is still loading."
            );

            return;
        }


        if (!cameraStream) {

            alert(
                "Please start the camera."
            );

            return;
        }


        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const context =
            canvas.getContext("2d");


        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        prediction.textContent =
            "Analyzing...";


        try {

            const results =
                await cameraModel.classify(
                    canvas,
                    5
                );


            if (
                results &&
                results.length > 0
            ) {

                const top =
                    results[0];

                const name =
                    formatName(
                        top.className
                    );

                const confidence =
                    (
                        top.probability * 100
                    ).toFixed(2);


                prediction.innerHTML = `

                    <strong>
                        ${name}
                    </strong>

                    <br>

                    <span style="font-size:16px;color:#20a85b;">
                        Confidence: ${confidence}%
                    </span>

                `;


                saveCameraHistory(
                    name,
                    confidence
                );
            }


        } catch (error) {

            console.error(error);

            prediction.textContent =
                "Recognition failed.";

        }

    }
);


// ===============================
// STOP CAMERA
// ===============================

stopButton.addEventListener(
    "click",
    function () {

        stopCamera();

    }
);


function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream = null;
    }


    video.srcObject =
        null;

    video.style.display =
        "none";

    placeholder.style.display =
        "flex";

    startButton.disabled =
        false;

    captureButton.disabled =
        true;

    stopButton.disabled =
        true;
}


// ===============================
// FORMAT NAME
// ===============================

function formatName(name) {

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

function saveCameraHistory(
    name,
    confidence
) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "recognitionHistory"
            )
        ) || [];


    history.unshift({

        id: Date.now(),

        prediction: name,

        confidence: confidence,

        date:
            new Date().toLocaleString()

    });


    if (history.length > 50) {

        history.pop();

    }


    localStorage.setItem(
        "recognitionHistory",
        JSON.stringify(history)
    );
}


// ===============================
// START
// ===============================

loadCameraModel();