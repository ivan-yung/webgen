// backend/cmd/web/main.go
package main

import (
	"log"
	"net/http"

	// Import the handler
	"webproducer/backend/internal/handler"

	// A helper library to load .env files
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from a .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, loading from environment")
	}

	// Set up the API endpoint to use our handler
	http.HandleFunc("/api/groq", handler.GroqProxyHandler)

	port := "3002"
	log.Printf("Go backend server starting on http://localhost:%s", port)
	
	// Start the web server
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}