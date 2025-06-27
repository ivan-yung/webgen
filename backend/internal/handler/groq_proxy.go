// backend/internal/handler/groq_proxy.go
package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"webproducer/backend/internal/groq" // Import your internal Groq client
)

// Struct to decode the JSON coming from your React frontend
type FrontendRequest struct {
	DesignJson    json.RawMessage `json:"designJson"`
	Instructions  string          `json:"instructions"`
}

// GroqProxyHandler is the main handler for the /api/groq endpoint
func GroqProxyHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Only allow POST requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Decode the request body from the frontend
	var req FrontendRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// 3. Get the API key securely from an environment variable
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		log.Println("Error: GROQ_API_KEY environment variable not set.")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// 4. Call the Groq API using our internal client
	completion, err := groq.CallGroqAPI(apiKey, req.Instructions, req.DesignJson)
	if err != nil {
		log.Printf("Error calling Groq API: %v", err)
		http.Error(w, "Failed to communicate with LLM service", http.StatusServiceUnavailable)
		return
	}

	// 5. Send the successful response back to the React frontend
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"completion": completion})
}