# ToolPool

ToolPool is a community-driven app for borrowing and lending tools. Users can:

- Register & login via Firebase Auth
- Add tools with description & location
- Browse available tools
- View tools on a map
- Request to borrow tools
- (Future) Pay for borrowing via Stripe

## Project Structure

- **frontend/**: HTML, CSS, JS, assets
- **functions/**: Firebase Cloud Functions for payment
- **firestore.rules**: Firestore security rules
- **firestore.indexes.json**: Firestore indexes

## Setup

1. Install dependencies in functions folder:

```bash
cd functions
npm install
