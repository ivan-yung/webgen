// backend/internal/groq/client.go
package groq

import (
	"bytes"
	"encoding/json"
	"net/http"
)

// Structs to build the request payload for the Groq API
type Request struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Struct to parse the response from the Groq API (we only need the message content)
type Response struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
}

// CallGroqAPI sends a request to the Groq API and returns the response content.
func CallGroqAPI(apiKey, instructions string, designJson json.RawMessage) (string, error) {
	groqAPIURL := "https://api.groq.com/openai/v1/chat/completions"
	
	// Combine instructions and the raw JSON design into a single user prompt
	userContent := instructions + "\n\n" + string(designJson)

	// Prepare the request payload       gemma model: gemma2-9b-it  	llama model:   llama3-8b-8192
	payload := Request{
		Model: "llama3-8b-8192",
		Messages: []Message{
			{Role: "system", Content: "You are an expert react developer that processes design JSON into react code"},
			{Role: "user", Content: userContent},
		},
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err // Failed to encode our request
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", groqAPIURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return "", err
	}

	// Set the necessary headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Decode the JSON response from Groq
	var groqResponse Response
	if err := json.NewDecoder(resp.Body).Decode(&groqResponse); err != nil {
		return "", err
	}

	// Extract the message content and return it
	if len(groqResponse.Choices) > 0 {
		return groqResponse.Choices[0].Message.Content, nil
	}

	return "No response content received.", nil
}