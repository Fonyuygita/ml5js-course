// script.js
let classifier;

async function setupClassifier() {
    classifier = await ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/fVnAC0K0w/');
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('image-preview');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

async function classifyImage(imageElement) {
    const results = await classifier.classify(imageElement);
    console.log(results[0])
    return results[0];
}

document.addEventListener('DOMContentLoaded', setupClassifier);

document.getElementById('registration-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
    const imageElement = document.getElementById('image-preview');

    try {
        const result = await classifyImage(imageElement);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('accuracy').classList.remove('hidden');
        document.getElementById('accuracy').innerText = `Model Accuracy: ${(result.confidence * 100).toFixed(2)}%`;

        if (result.confidence >= 0.7) {
            const name = document.getElementById('name').value;
            document.getElementById('welcome-message').innerText = `Welcome, ${name}!`;
            document.getElementById('welcome-message').style.display = 'block';
        } else {
            document.getElementById('error-message').classList.remove('hidden');
            document.getElementById('error-message').innerText = 'Image not recognized as a valid ID. Please try again.';
        }
    } catch (error) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-message').innerText = `Error: ${error.message}`;
    }
});
