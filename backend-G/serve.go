package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"google.golang.org/genai"
)

type FrontendRequest struct {
	DesignJson   json.RawMessage `json:"designJson"`
	Instructions string          `json:"instructions"`
}

type GeminiResponse struct {
	Completion string `json:"completion"`
}

func geminiHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req FrontendRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Println("Gemini client error:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	userPrompt := req.Instructions + "\n\n" + string(req.DesignJson)
	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text(userPrompt),
		nil,
	)
	if err != nil {
		log.Println("Gemini API error:", err)
		http.Error(w, "Failed to communicate with LLM service", http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(GeminiResponse{Completion: result.Text()})
}

func main() {
	http.HandleFunc("/api/gemini", geminiHandler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}
	log.Printf("Go Gemini backend server starting on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
