# SmartBank Express Backend

This repository contains the minimal Node.js/Express server required to support the SmartBank Neobank Prototype frontend application. This backend is dedicated to securely handling the payment processing workflow via the Stripe API.

### Primary Goal

The sole purpose of this server is to expose a single secure endpoint that the frontend can call to create a Stripe Checkout Session. This offloads the critical task of handling secret API keys and generating payment sessions from the frontend, ensuring security compliance.

### Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Runtime** | **Node.js / Express** | Minimal web server for routing and middleware. |
| **Payment API** | **Stripe SDK** (`stripe`) | Manages the creation of secure payment sessions. |
| **Security** | **CORS** (`cors`) | Allows the frontend (running on a different port) to access the API. |
| **Configuration** | **Dotenv** (`dotenv`) | Securely loads the `STRIPE_SECRET_KEY` from an environment file. |

### Key Files

| File | Description |
| :--- | :--- |
| **`server.js`** | The entry point that starts the Express application and listens on the configured port (defaulting to 3000). |
| **`app.js`** | Contains the core Express configuration, middleware setup, and API route definitions. |
| **`package.json`** | Defines project metadata and lists all required dependencies. |
| **`.env`** (Required) | **Must be created.** Stores the Stripe secret key. **This file should not be committed to version control.** |

---

### Running the Backend Locally

#### 1. Prerequisites

* Node.js (LTS version)
* A **Stripe Secret Key**.

#### 2. Setup

1.  Install the required Node.js dependencies:
    ```bash
    npm install
    ```

2.  **Create a `.env` file** in the root directory of the project.
    * This file is used by the `dotenv` package to load environment variables.
    * Add your Stripe secret key using the following format:
        ```
        # .env file
        STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        ```

#### 3. Start the Server

Run the start script defined in `package.json`:

```bash
npm start