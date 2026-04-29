# Hotel Reservation (C++ Console)

![Language](https://img.shields.io/badge/language-C%2B%2B17-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Console-based hotel reservation program written in C++. Refactored to OOP with a simple CLI and CSV persistence.

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
  1) Book a room
  2) Show bookings
  3) Cancel booking (by ID)
  4) Search bookings (by guest name / room number)
  5) Show available rooms (for a date range + optional room type filter)
  6) Exit
- Auto save/load:
  - Saves bookings to `bookings.csv`.
  - Loads `bookings.csv` on startup.

## How it works
- On startup, `Hotel` loads bookings from `bookings.csv` (if it exists).
- When booking, it validates input then checks room availability by detecting date range overlaps.
- After add/cancel operations, it writes the updated state to `bookings.csv`.
- Input is robust:
  - Wrong numeric input doesn't crash the program; it asks again.

## Build & Run (Windows)

### Using g++ (MinGW)
```bash
g++ -std=c++17 -O2 -Wall -Wextra -pedantic main.cpp -o hotel.exe
./hotel.exe
```

### Using Microsoft cl
```bat
cl /std:c++17 /EHsc /W4 main.cpp /Fe:hotel.exe
hotel.exe
```

## Input Format
- Guest name (string)
- Room number (int)
- Number of nights (int)
- Start date (YYYY-MM-DD)
- End date (YYYY-MM-DD)

Note: Dates are validated, and a booking is rejected if it overlaps with an existing booking for the same room.

## Repo
GitHub: https://github.com/CyborkSpider/Hotel-Reservation

## Notes
- Build artifacts are ignored via .gitignore (e.g., .exe, .obj, .pdb).
- Keep code simple and readable for learning purposes.
