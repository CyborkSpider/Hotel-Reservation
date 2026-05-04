# Hotel Reservation (C++ Console)

![Language](https://img.shields.io/badge/language-C%2B%2B17-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Console-based hotel reservation program written in C++. Refactored to OOP with a simple CLI and CSV persistence.

---

## Features

- 3 room types: Standard, Deluxe, Suite.
- OOP design:
  - `Booking` holds booking data.
  - `Hotel` handles business logic + persistence.
  - `ConsoleUI` handles input/output.

- Date-based availability:
  - Validates `YYYY-MM-DD` format.
  - Prevents booking the same room if date ranges overlap.

- Menu:
  1. Book a room  
  2. Show bookings  
  3. Cancel booking (by ID)  
  4. Search bookings (by guest name / room number)  
  5. Show available rooms  
  6. Exit  

- Auto save/load:
  - Saves bookings to `bookings.csv`
  - Loads `bookings.csv` on startup

---

## UML Diagram

<p align="center">
  <img src="https://raw.githubusercontent.com/CyborkSpider/Hotel-Reservation/main/hotel-presentation/public/assets/uml.jpg" width="900" alt="UML Diagram">
</p>

---

## System Explanation Video

Click below to watch the explanation video:

<p align="center">
  <a href="https://github.com/CyborkSpider/Hotel-Reservation/raw/main/hotel-presentation/video%20presentation%20for%20system.mp4">
    <img src="https://raw.githubusercontent.com/CyborkSpider/Hotel-Reservation/main/hotel-presentation/public/assets/uml.jpg" width="700" alt="Watch Demo">
  </a>
</p>

---

## How it Works

- On startup, `Hotel` loads bookings from `bookings.csv` (if it exists).
- When booking, it validates input then checks room availability by detecting date overlaps.
- After add/cancel operations, it automatically updates the CSV file.
- Wrong numeric input doesn't crash the program.

---

## Build & Run (Windows)

### Using g++

```bash
g++ -std=c++17 -O2 -Wall -Wextra -pedantic main.cpp -o hotel.exe
./hotel.exe
```

### Using Microsoft cl

```bat
cl /std:c++17 /EHsc /W4 main.cpp /Fe:hotel.exe
hotel.exe
```

---

## Input Format

- Guest name (string)
- Room number (int)
- Number of nights (int)
- Start date (`YYYY-MM-DD`)
- End date (`YYYY-MM-DD`)

> Dates are validated, and bookings are rejected if overlaps exist.

---

## Repository

GitHub: https://github.com/CyborkSpider/Hotel-Reservation

---

## Notes

- Build artifacts are ignored via `.gitignore`
- Code is kept simple and readable for learning purposes

---

## Author

Developed by: Ziad Elgohary
