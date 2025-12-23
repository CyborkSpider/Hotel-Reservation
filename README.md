# Hotel Reservation (C++ Console)

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
