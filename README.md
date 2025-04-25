# 🩺 Doctor Listing Page

This is a responsive and feature-rich **Doctor Listing Page** built using the **React + Vite** stack for a campus assessment. It allows users to search for doctors, filter them by consultation mode and specialty, and sort them by fees or experience. All functionalities are handled **on the client side** after fetching data from a provided API.

## 📌 Features

- 🔍 **Autocomplete Search Bar** for doctor names (top 3 suggestions)
- 🏥 **Filter Panel** with:
  - ✅ Consultation Type (Video / In-Clinic)
  - ✅ Multiple Specialties (Checkboxes)
- 🔃 **Sort Options**:
  - By Consultation Fees (ascending)
  - By Experience (descending)
- 📋 **Doctor Cards** displaying:
  - Photo, Name, Specialties
  - Experience, Fee, Clinic Name
- 🌐 **URL Query Parameters**:
  - Filters/search state is synced to URL
  - Back/forward browser navigation preserved

## 🧑‍💻 Tech Stack

| Tech         | Description                        |
|--------------|------------------------------------|
| React        | UI library for building components |
| Vite         | Lightning-fast frontend build tool |
| Tailwind CSS | Utility-first styling framework    |
| React Router | Routing + URL param syncing        |
| Heroicons    | Icon pack for UI elements          |

## 🗂️ Folder Structure

doctor-listing/ ├── public/ ├── src/ │ ├── components/ │ │ ├── AutocompleteSearch.jsx │ │ ├── FilterPanel.jsx │ │ └── DoctorCard.jsx │ ├── pages/ │ │ └── DoctorListing.jsx │ ├── utils/ │ │ └── queryHelpers.js │ ├── App.jsx │ └── main.jsx ├── tailwind.config.js ├── postcss.config.cjs └── README.md


## 📡 API Integration

- API URL: `https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json`
- Data is fetched once on load and stored in state
- All searching, filtering, and sorting is handled **client-side only**

## 🧪 Test Coverage

All interactive and dynamic components are covered with the required `data-testid` attributes, such as:

- `autocomplete-input`, `suggestion-item`
- `doctor-card`, `doctor-name`, `doctor-fee`, etc.
- `filter-video-consult`, `filter-specialty-*`
- `sort-fees`, `sort-experience`

## 🧭 How to Run Locally

```bash
git clone https://github.com/Sunil-0507/doctor-listing.git
cd doctor-listing
npm install
npm run dev


images
![image](https://github.com/user-attachments/assets/a8b518b7-4684-4d00-8b4f-cc3c9bdd40de)
![image](https://github.com/user-attachments/assets/dafe6402-8074-461e-a6d2-fd664702e34d)


