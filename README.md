# Hotel Reservation (C++ Console)

![Language](https://img.shields.io/badge/language-C%2B%2B11-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Simple console-based hotel reservation program written in C++ for first-year students. The app uses only arrays (no structs/classes) and basic I/O/control flow.

## Features
- 3 room types: Standard, Deluxe, Suite.
- Multiple bookings using arrays only.
- Checks room availability and prints:
  - "Room is already booked" if taken.
  - "Booking successful" if free.
- Menu:
  1) Book a room
  2) Show bookings
  3) Exit

## How it works
- Stores room state and bookings in simple arrays.
- On booking: validates room number, checks if already booked, then saves guest name, nights, start/end dates.
- Uses cin for numbers and getline for strings; clears the input buffer after numeric input to avoid skipping lines.

## Build & Run (Windows)

### Using g++ (MinGW)
`
g++ -std=c++11 -O2 -o hotel.exe main.cpp
./hotel.exe
`

### Using Microsoft cl
`
cl /EHsc /O2 main.cpp /Fe:hotel.exe
hotel.exe
`

## Input Format
- Guest name (string)
- Room number (int)
- Number of nights (int)
- Start date (YYYY-MM-DD)
- End date (YYYY-MM-DD)

Note: After reading numbers, input buffering is handled so that date inputs via getline work correctly.

## Repo
GitHub: https://github.com/CyborkSpider/Hotel-Reservation

## Notes
- Build artifacts are ignored via .gitignore (e.g., .exe, .obj, .pdb).
- Keep code simple and readable for learning purposes.
