# Collaborative Story Writing - Backend

This is the backend for a collaborative story writing platform. Users can create stories, request contributions, approve/reject contributions, mark stories as completed, and download completed stories as PDFs.

---

## **User Stories / Features**

- I can start a story post.
- I can request a story author to contribute to their stories.
- I can approve/reject the contribution request.
- I can mark a story as completed.
- I can download the completed story as PDF.

---

## **Project Structure**

storyapp/
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── db.js             # MongoDB connection
    │   ├── middleware/
    │   │   └── auth.js           # Authentication middleware
    │   ├── models/
    │   │   ├── User.js           # User model
    │   │   ├── Story.js          # Story model
    │   │   └── Contribution.js   # Contribution model
    │   └── routes/
    │       ├── auth.js           # Auth routes
    │       ├── stories.js        # Story routes
    │       └── contributions.js  # Contribution routes
    ├── .env                      # Environment variables (not committed)
    ├── package.json               # Project dependencies & scripts
    └── README.md                  # Project documentation




