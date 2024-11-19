// Function to handle the image upload and prediction
async function uploadImage() {
    const input = document.getElementById("imageInput");
    const predictionResult = document.getElementById("predictionResult");
    const resultText = document.getElementById("resultText");
    const foodRecommendations = document.getElementById("foodRecommendations");

    if (!input.files[0]) {
        alert("Please upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.error) {
            throw new Error(data.error);
        }

        const prediction = data.prediction; // Should map to "Vitamin A", "Vitamin B", etc.

        // Display prediction result
        predictionResult.classList.remove("hidden");
        predictionResult.style.display = "block"; // Ensure visibility
        resultText.textContent = `Detected deficiency: ${prediction}`;

        // Display food recommendations
        const foods = getFoodRecommendations(prediction);
        foodRecommendations.innerHTML = foods;
    } catch (error) {
        alert("An error occurred while predicting. Please try again.");
        console.error("Error:", error.message);
    }
}

// Function to fetch food recommendations based on the detected vitamin deficiency
function getFoodRecommendations(vitamin) {
    const foodMap = {
        "Vitamin A": [
            { name: "Carrots", image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg" },
            { name: "Spinach", image: "https://media.istockphoto.com/id/1006196472/photo/bunch-of-spinach-leaves-on-isolated-white-background.jpg?s=612x612&w=0&k=20&c=OAIswtUC1aMNDwtMEFIaZv6fSIftsoAV-cgJZSGLJ7A=" },
            { name: "Sweet Potatoes", image: "https://cdn.pixabay.com/photo/2016/09/13/08/51/sweet-potato-1666707_640.jpg" },
        ],
        "Vitamin B": [
            { name: "Eggs", image: "https://media.istockphoto.com/id/451505631/photo/two-eggs-isolated-on-white.jpg?s=612x612&w=0&k=20&c=0_4dr9YjsXEIp8UuvrLFksCpzBwbpgfS1Q7PAXBbcSE=" },
            { name: "Whole Grains", image: "https://static9.depositphotos.com/1625039/1110/i/450/depositphotos_11106625-stock-photo-whole-grains.jpg" },
            { name: "Milk", image: "https://www.heritagefoods.in/blog/wp-content/uploads/2020/12/shutterstock_539045662.jpg" },
        ],
        "Vitamin C": [
            { name: "Oranges", image: "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg" },
            { name: "Strawberries", image: "https://cdn.pixabay.com/photo/2022/05/27/10/35/strawberry-7224875_1280.jpg" },
            { name: "Broccoli", image: "https://domf5oio6qrcr.cloudfront.net/medialibrary/5390/h1218g16207258089583.jpg" },
        ],
        "Vitamin D": [
            { name: "Salmon", image: "https://t3.ftcdn.net/jpg/00/56/24/26/360_F_56242669_ZAzbHYnWEWr8YEle6Za4vExbHAmaioF7.jpg" },
            { name: "Mushrooms", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAl6dMFyzcTpVV5sXKfDqtgA8ytZmgmwZ9yQ&s" },
            { name: "Fortified Milk", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNO8NbSMqyHChKPQ9O-LUDHgdoWJUcC6r9yg&s" },
        ],
        "Vitamin E": [
            { name: "Almonds", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNO8NbSMqyHChKPQ9O-LUDHgdoWJUcC6r9yg&s" },
            { name: "Sunflower Seeds", image: "https://media.post.rvohealth.io/wp-content/uploads/2020/06/sunflower-seeds-1200x628-facebook-1200x628.jpg" },
            { name: "Spinach", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0TLQ-TatGslPnS8LwNMnQzkymUZI3Q-_-gw&s" },
        ],
    };

    const foods = foodMap[vitamin] || [];
    if (foods.length === 0) {
        return "<p>No recommendations available for this deficiency.</p>";
    }

    return foods
        .map(
            (food) => `
        <div class="food-item">
            <img src="${food.image}" alt="${food.name}" class="food-image">
            <p>${food.name}</p>
        </div>
    `
        )
        .join("");
}

// Add event listener to button after the page has loaded
window.addEventListener("DOMContentLoaded", () => {
    const predictButton = document.getElementById("predictButton");
    predictButton.addEventListener("click", uploadImage);
});