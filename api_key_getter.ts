


// Sleep function to handle delay in between retries


// Sleep function to handle delay in between retries
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get the GPT response with retry logic
async function getGptResponse() {
    const apiKey = "..."  // Replace with your actual API key
    const apiUrl = "https://api.openai.com/v1/chat/completions";  // Correct URL

    // Exponential backoff implementation
    const maxRetries = 1;  // Max number of retries
    let retryCount = 0;

    // Loop to try multiple retries in case of a failure
    while (retryCount < maxRetries) {
        try {
            // Send the request to the GPT API
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,  // Authorization with the API key
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: "Hello, how are you?" }],
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse and log the GPT response
            const data = await response.json();
            console.log("GPT Response:", data.choices[0].message.content);
            return;  // If successful, exit the function

        } catch (error) {
            if (error.message.includes("429")) {
                // Handle rate limit (HTTP 429) with exponential backoff
                retryCount++;
                const delay = Math.pow(2, retryCount) * 1000;  // Exponential backoff (2^retryCount seconds)
                console.log(`Rate limited! Retrying after ${delay / 1000} seconds...`);
                await sleep(delay);  // Wait for the delay before retrying
            } else {
                // Handle other types of errors (e.g., network errors, invalid API key)
                console.error("Error:", error);
                return;
            }
        }
    }

    // If max retries are reached, log an error
    console.error("Max retries reached. Please try again later.");
}

// Call the function to get the GPT response
getGptResponse();
