package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/alecsavvy/shreddr/server"
)

func main() {
	fmt.Println("Hello, Shreddr 🎸")

	s, err := server.NewServer()
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-signalChan
		log.Println("Received signal to stop server")
	}()

	go func() {
		if err := s.Start(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
		log.Println("Server started")
	}()

	<-signalChan

	if err := s.Stop(); err != nil {
		log.Fatalf("Failed to stop server: %v", err)
	}
	log.Println("Server stopped")
}
