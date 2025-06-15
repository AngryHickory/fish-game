const canvas = document.getElementById('fishCanvas');
const ctx = canvas.getContext('2d');


canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const fishCount = 5; // Number of fish to animate
let fishArray = [];

// Base constants for fish dimensions
const baseBodyRadiusX = 25; // Half length of the fish body ellipse
const baseBodyRadiusY = 10; // Half height of the fish body ellipse
const baseTailLength = 15; // Length of the tail triangle

// Function to generate a realistic fish color
function getRandomFishColor() {
    const colors = [
        'hsl(120, 59.30%, 23.10%)',
        'hsl(140, 72.60%, 32.90%)', 
        'hsl(17, 60.90%, 17.10%)',
        'hsl(30, 60.50%, 33.70%)',
        'hsl(20, 45.40%, 53.30%)',
        'hsl(210, 30%, 70%)',
        'hsl(0, 0.00%, 21.20%)',
        'hsl(180, 50%, 60%)',
        'hsl(0, 0.00%, 74.50%)',
        'hsl(216, 60.50%, 33.70%)'   
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize fish with random positions, speeds, heights, colors, and now sizes/shapes
for (let i = 0; i < fishCount; i++) {
    const direction = Math.random() < 0.5 ? 1 : -1; // Randomly choose direction (1 for right, -1 for left)
    const scaleX = Math.random() * 0.8 + 0.6; // Random scale for length (0.6 to 1.4)
    const scaleY = Math.random() * 0.8 + 0.6; // Random scale for height (0.6 to 1.4)

    // Calculate individual fish dimensions based on scale
    const fishBodyRadiusY = baseBodyRadiusY * scaleY;
    const fishTotalLength = (baseBodyRadiusX * 2 * scaleX) + (baseTailLength * scaleX);

    fishArray.push({
        // Start completely off-screen based on direction and its calculated total length
        x: direction === 1 ? -fishTotalLength : canvas.width + fishTotalLength,
        speed: Math.random() * 1.5 + 1, // Random speed between 1 and 2.5
        // Ensure height is within canvas bounds considering the scaled body height
        height: Math.random() * (canvas.height - (fishBodyRadiusY * 2) - 10) + fishBodyRadiusY + 5,
        color: getRandomFishColor(), // Use realistic color function
        opacity: 1, // Start fully visible
        direction: direction, // Assign direction
        scaleX: scaleX, // Individual horizontal scale
        scaleY: scaleY // Individual vertical scale
    });
}

// Function to draw the fish
function drawFish(fish) {
    ctx.fillStyle = fish.color;
    ctx.globalAlpha = fish.opacity; // Set the opacity for the fish

    // Calculate current fish dimensions based on its scale factors
    const currentBodyRadiusX = baseBodyRadiusX * fish.scaleX;
    const currentBodyRadiusY = baseBodyRadiusY * fish.scaleY;
    const currentTailLength = baseTailLength * fish.scaleX;

    // Draw the body (ellipse)
    ctx.beginPath();
    if (fish.direction === 1) { // If swimming right
        // Nose is at fish.x, body extends left from fish.x
        // Ellipse center is at fish.x - currentBodyRadiusX
        ctx.ellipse(fish.x - currentBodyRadiusX, fish.height, currentBodyRadiusX, currentBodyRadiusY, 0, 0, Math.PI * 2);
    } else { // If swimming left (fish.direction === -1)
        // Nose is at fish.x, body extends right from fish.x
        // Ellipse center is at fish.x + currentBodyRadiusX
        ctx.ellipse(fish.x + currentBodyRadiusX, fish.height, currentBodyRadiusX, currentBodyRadiusY, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Draw the tail (triangle)
    ctx.beginPath();
    const overlapAmount = 5 * fish.scaleX; // Scale overlap amount too for consistency

    if (fish.direction === 1) { // If swimming right
        // Tail starts slightly inside the body ellipse
        ctx.moveTo(fish.x - (currentBodyRadiusX * 2) + overlapAmount, fish.height);
        ctx.lineTo(fish.x - (currentBodyRadiusX * 2) - currentTailLength + overlapAmount, fish.height - currentBodyRadiusY); // Tail tip top
        ctx.lineTo(fish.x - (currentBodyRadiusX * 2) - currentTailLength + overlapAmount, fish.height + currentBodyRadiusY); // Tail tip bottom
    } else { // If swimming left (fish.direction === -1)
        // Tail starts slightly inside the body ellipse
        ctx.moveTo(fish.x + (currentBodyRadiusX * 2) - overlapAmount, fish.height);
        ctx.lineTo(fish.x + (currentBodyRadiusX * 2) + currentTailLength - overlapAmount, fish.height - currentBodyRadiusY); // Tail tip top
        ctx.lineTo(fish.x + (currentBodyRadiusX * 2) + currentTailLength - overlapAmount, fish.height + currentBodyRadiusY); // Tail tip bottom
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1; // Reset opacity for the next draw
}

// Function to animate the fish
function swim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    const fadeThreshold = 1; // Pixels from the edge where fading begins

    fishArray.forEach(fish => {
        const currentFishTotalLength = (baseBodyRadiusX * 3 * fish.scaleX) + (baseTailLength * fish.scaleX);

        fish.x += fish.speed * fish.direction; // Move the fish according to its direction

        // Check if the fish is going off-screen and apply fade-out
        if (fish.direction === 1) { // If swimming right
            // Start fading when the nose is within fadeThreshold from the right edge
            if (fish.x > canvas.width - fadeThreshold) {
                fish.opacity -= 0.001; // Decrease opacity for fade-out effect 
                if (fish.opacity <= 0) {
                    // Reset fish properties when fully faded out and off-screen
                    fish.direction = Math.random() < 0.5 ? 1 : -1; // Randomly flip direction
                    fish.scaleX = Math.random() * 0.8 + 0.6; // New random scale for length
                    fish.scaleY = Math.random() * 0.8 + 0.6; // New random scale for height
                    fish.speed = Math.random() * 1.5 + 1; // New random speed

                    const newFishBodyRadiusY = baseBodyRadiusY * fish.scaleY;
                    const newFishTotalLength = (baseBodyRadiusX * 2 * fish.scaleX) + (baseTailLength * fish.scaleX);

                    fish.x = fish.direction === 1 ? -newFishTotalLength : canvas.width + newFishTotalLength; // Reset to far off-screen
                    // Ensure height is within canvas bounds considering the new scaled body height
                    fish.height = Math.random() * (canvas.height - (newFishBodyRadiusY * 2) - 10) + newFishBodyRadiusY + 5;
                    fish.color = getRandomFishColor(); // Random color on reset
                    fish.opacity = 1; // Reset opacity
                }
            } else {
                fish.opacity = 1; // Ensure fish is fully visible while on-screen
            }
        } else { // If swimming left (fish.direction === -1)
            // Start fading when the nose is within fadeThreshold from the left edge
            if (fish.x < fadeThreshold) {
                fish.opacity -= 0.001; // Decrease opacity for fade-out effect
                if (fish.opacity <= 0) {
                    // Reset fish properties when fully faded out and off-screen
                    fish.direction = Math.random() < 0.5 ? 1 : -1; // Randomly flip direction
                    fish.scaleX = Math.random() * 0.8 + 0.6; // New random scale for length
                    fish.scaleY = Math.random() * 0.8 + 0.6; // New random scale for height
                    fish.speed = Math.random() * 1.5 + 1; // New random speed

                    const newFishBodyRadiusY = baseBodyRadiusY * fish.scaleY;
                    const newFishTotalLength = (baseBodyRadiusX * 2 * fish.scaleX) + (baseTailLength * fish.scaleX);

                    fish.x = fish.direction === 1 ? -newFishTotalLength : canvas.width + newFishTotalLength; // Reset to far off-screen
                    // Ensure height is within canvas bounds considering the new scaled body height
                    fish.height = Math.random() * (canvas.height - (newFishBodyRadiusY * 2) - 10) + newFishBodyRadiusY + 5;
                    fish.color = getRandomFishColor(); // Random color on reset
                    fish.opacity = 1; // Reset opacity
                }
            } else {
                fish.opacity = 1; // Ensure fish is fully visible while on-screen
            }
        }

        drawFish(fish); // Draw each fish
    });

    requestAnimationFrame(swim); // Request the next frame
}

// Handle window resizing to make the canvas responsive
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Re-initialize fish positions if needed, or simply let them continue and reset when off-screen
    // For simplicity, we'll let them reset naturally when they go off-screen.
});

// Start the animation automatically
swim();