# Train Component Management

This project allows users to manage train components through a table interface. It includes pagination, quantity assignment, validation, and a responsive user interface. Data is stored in the browser using `localStorage`, simulating an API.

> This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

---

## 🚀 Features

- View a list of train components in a paginated table
- View component details: ID, name, unique number, and quantity status
- Assign quantity to eligible components (positive integers only)
- Input validation with inline error messages
- Responsive layout and accessible design
- LocalStorage as a fake API for persistent data
- 404 Not Found Page for unmatched routes
- Unit tests for core functionality

---

## 🛠️ Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## 🧱 Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

---

## 🏗️ Building

To build the project for production, run:

```bash
ng build
```

The compiled artifacts will be stored in the `dist/` directory.

---

## ✅ Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
ng test
```

Unit tests cover:
- Component rendering
- Pagination logic
- Quantity assignment logic
- Validation logic
- Service methods (get/update data from `localStorage`)

---

## 🚧 Running end-to-end tests

For end-to-end (e2e) testing:

```bash
ng e2e
```

> Angular CLI no longer includes an e2e framework by default. You can add Cypress, Playwright, or another testing tool of your choice.

---

## 📁 Folder Structure (Simplified)

```
src/
├── app/
│   ├── components/
│   │   └── train-table/          # Main table UI
│   ├── pages/
│   │   └── not-found-page/       # 404 fallback
│   ├── models/
│   │   └── train-component.model.ts
│   ├── services/
│   │   └── train-component-management.service.ts
│   ├── data/
│   │   └── train-components.ts   # Initial local data
│   └── app.routes.ts             # Routing config
```

---

## 📌 System Requirements

- Node.js v18+
- Angular CLI 19.x

---

## 🧪 Test Task Summary

This project was created as a test assignment. It simulates an admin tool for managing train components using Angular 19 standalone components and signals. The focus was on validation, local data persistence, clean UI, and modular code.

---

## 📬 Feedback

If you find a bug or want to suggest an improvement, feel free to open an issue or submit a pull request!

---

## 🧾 License

This project is licensed under the MIT License.
urces

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
