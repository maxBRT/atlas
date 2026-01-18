# Makefile for starting frontend and backend concurrently

.PHONY: start dev

start: dev

dev:
	@echo "Starting backend and frontend in development mode..."
	(cd backend && bun run dev) &
	(cd frontend && bun run dev) &
	wait
