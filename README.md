# Jewelry Rental

Comprehensive repository for the Jewelry Rental project. This repository contains a frontend (React + Vite) and a backend (Java Spring / Maven). The `BackEnd` folder currently contains its own Git repository (a nested repo). See "Pushing the BackEnd" below for safe options to push and publish it.

## Repository layout

- `BackEnd/` — Java Spring Boot application (Maven). NOTE: this directory contains a nested `.git` directory (its own repo).
- `dhara/` — project metadata and configuration files.
- `FrontEnd/` — frontend projects (Vite + React) — main app in `FrontEnd/Dhara/`.
- `dhara.dmd`, other tool-specific files.

## Tech stack

- Backend: Java, Spring Boot, Maven
- Frontend: React, Vite, Tailwind CSS
- Containerization: Docker (there's a `Dockerfile` inside `BackEnd/dharaEccormmerce`)

---

## Quick start — Frontend (development)

From the repository root, run the frontend dev server (example for the `FrontEnd/Dhara` app):

```zsh
cd FrontEnd/Dhara
# install deps if needed
npm install
# run dev server
npm run dev
```

To create a production build:

```zsh
npm run build
```

---

## Quick start — Backend (development)

The backend is a Spring Boot Maven project located at `BackEnd/dharaEccormmerce`.

From the repo root:

```zsh
cd BackEnd/dharaEccormmerce
# build
./mvnw clean package
# run (or run from your IDE)
./mvnw spring-boot:run
```

If you want to run the JAR directly (after package):

```zsh
java -jar target/dharaEccormmerce-0.0.1-SNAPSHOT.jar
```

There is also a `Dockerfile` in the backend module if you want to build a container image.

---

## Pushing the `BackEnd` folder

Important: `BackEnd/dharaEccormmerce` currently contains its own `.git` directory (it's a nested Git repository). When a folder inside a Git repo contains another `.git`, the parent repo treats it like a submodule/gitlink and `git add` may fail with messages like "does not have a commit checked out". You have three safe options depending on your intended workflow:

1) Keep `BackEnd` as a separate repository (recommended if it already has its own history and remote)

- Use a submodule: this keeps `BackEnd` as its own repository and the main repo references a commit.

	```zsh
	# from repo root
	git submodule add <backend-repo-ssh-or-https-url> BackEnd/dharaEccormmerce
	# Jewelry Rental

	A small full-stack project demonstrating a jewelry rental storefront: a React + Vite frontend and a Spring Boot backend. This README is focused on getting the project running and giving visitors a clear overview of the code and development steps.

	If you are viewing this repository on GitHub, the backend was added on the `backend-changes` branch. The original nested Git metadata was backed up at `BackEnd/dharaEccormmerce/.git.backup` before the backend was merged into the parent repository.

	---

	## Repository structure

	- `BackEnd/dharaEccormmerce` — Spring Boot (Maven) backend with APIs for products, orders, and admin functions.
	- `FrontEnd/Dhara` — React + Vite frontend demonstrating product listing and basic UI flows.
	- `dhara/` — development tooling / metadata used by the team.

	---

	## Key features

	- REST APIs for product, order, and admin management (backend).
	- Client-side product listing and demo checkout UI (frontend).
	- Dockerfile included for the backend for easy containerization.

	---

	## Backend — Quick start (development)

	Prerequisites: Java 17+, Docker (optional)

	From the repository root:

	```zsh
	cd BackEnd/dharaEccormmerce
	./mvnw clean package
	./mvnw spring-boot:run
	```

	Application will be available on `http://localhost:8080` by default.

	Run tests:

	```zsh
	./mvnw test
	```

	Build and run with Docker:

	```zsh
	docker build -t dhara-backend:latest BackEnd/dharaEccormmerce
	docker run -p 8080:8080 dhara-backend:latest
	```

	Configuration: update `src/main/resources/application.properties` or use environment variables for production secrets (DB/S3 credentials, etc.).

	---

	## Frontend — Quick start (development)

	From the repository root:

	```zsh
	cd FrontEnd/Dhara
	npm install
	npm run dev
	```

	Open the dev server URL shown by Vite (usually `http://localhost:5173`).

	Build for production:

	```zsh
	npm run build
	```

	---

	## Pull request & merge notes

	- A PR was opened from `backend-changes` into `main` to add the backend files to the repository. Merging that PR will bring the backend into the `main` branch.
	- If you'd rather keep the backend as a separate repository, restore the backup at `BackEnd/dharaEccormmerce/.git.backup` to recreate the original nested repo.

	---

	## Contributing

	- Create a branch from `main` or `backend-changes` and open a PR with a clear description.
	- Keep commits small and descriptive.

	---

	## Restore backup

	To restore the original nested Git repo (undo inclusion):

	```zsh
	mv BackEnd/dharaEccormmerce/.git.backup BackEnd/dharaEccormmerce/.git
	```

	---

	If you want, I can add badges, screenshots, a short demo GIF, or CI instructions (GitHub Actions) — tell me which you'd like and I will update the README and push the changes.
