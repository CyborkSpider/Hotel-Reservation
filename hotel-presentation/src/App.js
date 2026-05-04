import React from 'react';
import './App.css';

// ─── SlideCard: شرح شمال / كود يمين ───────────────
const SlideCard = ({ title, subtitle, explanation, codeContent, id }) => (
  <div className="slide-card" id={id}>
    <div className="explanation-side">
      <div className="block-badge">{subtitle}</div>
      <h2>{title}</h2>
      <div className="text-content">
        {explanation.map((item, i) =>
          item.type === 'bullet'
            ? <p key={i} className="bullet-item">→ {item.text}</p>
            : item.type === 'func'
            ? <div key={i} className="func-tag"><span className="func-name">{item.name}</span>{item.desc}</div>
            : <p key={i} className="para-item">{item.text}</p>
        )}
      </div>
    </div>
    <div className="code-side-scrollable">
      <div className="code-header">
        <span className="lang-dot"></span> main.cpp
      </div>
      <pre><code>{codeContent}</code></pre>
    </div>
  </div>
);

// ─── ConsoleCard: شرح شمال / terminal يمين ──────────
const ConsoleCard = ({ title, subtitle, explanation, output, id }) => (
  <div className="slide-card console-card" id={id}>
    <div className="explanation-side">
      <div className="block-badge console-badge">{subtitle}</div>
      <h2>{title}</h2>
      <div className="text-content">
        {explanation.map((item, i) =>
          item.type === 'bullet'
            ? <p key={i} className="bullet-item">→ {item.text}</p>
            : <p key={i} className="para-item">{item.text}</p>
        )}
      </div>
    </div>
    <div className="code-side-scrollable terminal-side">
      <div className="code-header terminal-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span style={{marginLeft:'10px'}}>Runtime Output</span>
      </div>
      <pre className="terminal-output"><code>{output}</code></pre>
    </div>
  </div>
);

// ─── DATA ───────────────────────────────────────────

const block1aExplanation = [
  { type: 'text', text: 'This part handles and validates booking dates to ensure accurate reservation management.' },
  { type: 'bullet', text: 'Checks year, month, and day values for correctness' },
  { type: 'bullet', text: 'Considers leap years to correctly handle February dates' },
  { type: 'bullet', text: 'Compares two dates to ensure check-out comes after check-in' },
  { type: 'bullet', text: 'Overlap Detection — prevents multiple guests booking the same room' },
  { type: 'func', name: 'isLeapYear()', desc: 'Checks 365 or 366 days' },
  { type: 'func', name: 'isValidDate()', desc: 'Ensures the entered date is correct' },
  { type: 'func', name: 'compareDate()', desc: 'Compares two dates chronologically' },
  { type: 'func', name: 'rangesOverlapInclusive()', desc: 'Prevents booking conflicts' },
];

const block1aCode = `#include <iostream>
#include <string>
#include <limits>
#include <vector>
#include <array>
#include <optional>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <cctype>
using namespace std;

enum class RoomType {
    Standard,
    Deluxe,
    Suite,
};

static bool isLeapYear(int y) {
    if (y % 400 == 0) return true;
    if (y % 100 == 0) return false;
    return (y % 4 == 0);
}

static int daysInMonth(int m, int y) {
    static int days[] = {31,28,31,30,31,30,31,31,30,31,30,31};
    if (m == 2) return isLeapYear(y) ? 29 : 28;
    return days[m - 1];
}

static bool isValidDate(const Date& dt) {
    if (dt.y < 1) return false;
    if (dt.m < 1 || dt.m > 12) return false;
    if (dt.d < 1 || dt.d > daysInMonth(dt.m, dt.y))
        return false;
    return true;
}

static int compareDate(const Date& a, const Date& b) {
    if (a.y != b.y) return (a.y < b.y) ? -1 : 1;
    if (a.m != b.m) return (a.m < b.m) ? -1 : 1;
    if (a.d != b.d) return (a.d < b.d) ? -1 : 1;
    return 0;
}

static bool rangesOverlapInclusive(
    const Date& aStart, const Date& aEnd,
    const Date& bStart, const Date& bEnd) {
    return compareDate(aStart, bEnd) <= 0
        && compareDate(bStart, aEnd) <= 0;
}`;

const block1bExplanation = [
  { type: 'text', text: 'Handles room classification, input formatting, and data storage operations.' },
  { type: 'bullet', text: 'Validates room numbers — must be within 1 to 30' },
  { type: 'bullet', text: 'Auto-assigns category: Standard 1–10, Deluxe 11–20, Suite 21–30' },
  { type: 'bullet', text: 'Removes unnecessary spaces and converts to lowercase for consistent search' },
  { type: 'bullet', text: 'CSV formatting — escapes special characters and splits lines into fields' },
  { type: 'func', name: 'isValidRoomNumber()', desc: 'Checks 1–30 range' },
  { type: 'func', name: 'roomTypeFromNumber()', desc: 'Assigns correct room category' },
  { type: 'func', name: 'trim() / toLowerCopy()', desc: 'Cleans and standardizes input' },
  { type: 'func', name: 'csvEscape() / csvSplitLine()', desc: 'Safe CSV read/write' },
];

const block1bCode = `static bool isValidRoomNumber(int roomNumber) {
    return roomNumber >= 1 && roomNumber <= 30;
}

static RoomType roomTypeFromNumber(int roomNumber) {
    if (roomNumber <= 10) return RoomType::Standard;
    if (roomNumber <= 20) return RoomType::Deluxe;
    return RoomType::Suite;
}

static string trim(const string& s) {
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    size_t j = s.size();
    while (j > i && isspace((unsigned char)s[j-1])) j--;
    return s.substr(i, j - i);
}

static string toLowerCopy(string s) {
    for (char& c : s)
        c = (char)tolower((unsigned char)c);
    return s;
}

static string csvEscape(const string& s) {
    bool needQuotes = false;
    for (char c : s)
        if (c == ',' || c == '"' || c == '\\n')
            { needQuotes = true; break; }
    if (!needQuotes) return s;
    string out;
    out.reserve(s.size() + 2);
    out.push_back('"');
    for (char c : s)
        c == '"' ? out += "\\"\\""" : out.push_back(c);
    out.push_back('"');
    return out;
}

static vector<string> csvSplitLine(const string& line) {
    vector<string> fields;
    string field;
    bool inQuotes = false;
    for (size_t i = 0; i < line.size(); i++) {
        const char c = line[i];
        if (inQuotes) {
            if (c == '"' && i+1 < line.size() && line[i+1] == '"')
                { field.push_back('"'); i++; }
            else if (c == '"') inQuotes = false;
            else field.push_back(c);
        } else {
            if (c == '"') inQuotes = true;
            else if (c == ',') { fields.push_back(field); field.clear(); }
            else field.push_back(c);
        }
    }
    fields.push_back(field);
    return fields;
}`;

const consoleMenu = [
  { type: 'text', text: 'The run() function is the main execution loop of the system. It displays the menu and handles user choices continuously.' },
  { type: 'bullet', text: 'Book a Room — Create a new reservation for a guest' },
  { type: 'bullet', text: 'Show Bookings — Display all current booking records' },
  { type: 'bullet', text: 'Cancel Booking — Remove a reservation by booking ID' },
  { type: 'bullet', text: 'Search Bookings — Search by guest name or room number' },
  { type: 'bullet', text: 'Show Available Rooms — Display rooms for a date range' },
  { type: 'bullet', text: 'Exit — Close the system safely' },
];

const consoleMenuOutput = `===== Hotel Menu =====
1) Book a room
2) Show bookings
3) Cancel booking
4) Search bookings
5) Show available rooms
6) Exit
Choose: _`;

const block2aExplanation = [
  { type: 'text', text: 'The Booking class is the core data structure of the system. Each booking object stores all reservation details.' },
  { type: 'bullet', text: 'Booking ID — Unique identifier for each reservation' },
  { type: 'bullet', text: 'Guest Name — The name of the customer' },
  { type: 'bullet', text: 'Room Number — The assigned room for the booking' },
  { type: 'bullet', text: 'Number of Nights — The duration of the stay' },
  { type: 'bullet', text: 'Check-in and Check-out Dates — Reservation period' },
  { type: 'func', name: 'Getters', desc: 'Access all booking details' },
  { type: 'func', name: 'overlaps()', desc: 'Detects reservation conflicts' },
  { type: 'func', name: 'roomType()', desc: 'Identifies room category from number' },
];

const block2aCode = `class Booking {
public:
    Booking(int id, string guestName,
            int roomNumber, int nights,
            string startDate, string endDate)
        : id_(id),
          guestName_(std::move(guestName)),
          roomNumber_(roomNumber),
          nights_(nights),
          startDate_(std::move(startDate)),
          endDate_(std::move(endDate)) {
        parseDateYYYYMMDD(startDate_, start_);
        parseDateYYYYMMDD(endDate_, end_);
    }

    int           id()         const { return id_; }
    const string& guestName()  const { return guestName_; }
    int           roomNumber() const { return roomNumber_; }
    int           nights()     const { return nights_; }
    const string& startDate()  const { return startDate_; }
    const string& endDate()    const { return endDate_; }
    const Date&   start()      const { return start_; }
    const Date&   end()        const { return end_; }

    bool overlaps(const Date& s, const Date& e) const {
        return rangesOverlapInclusive(start_, end_, s, e);
    }

    string roomType() const {
        return toString(roomTypeFromNumber(roomNumber_));
    }

private:
    int    id_;
    string guestName_;
    int    roomNumber_;
    int    nights_;
    string startDate_, endDate_;
    Date   start_, end_;
};`;

const block2bExplanation = [
  { type: 'text', text: 'The Hotel class is the core business logic. It manages all booking operations and controls the reservation process.' },
  { type: 'bullet', text: 'Manages a maximum of 30 rooms and 100 bookings' },
  { type: 'bullet', text: 'Handles data loading and saving automatically' },
  { type: 'func', name: 'addBooking()', desc: 'Creates reservation after full validation' },
  { type: 'func', name: 'cancelBookingById()', desc: 'Removes reservation by unique ID' },
  { type: 'func', name: 'searchByGuestName()', desc: 'Search bookings by name' },
  { type: 'func', name: 'searchByRoom()', desc: 'Search bookings by room number' },
  { type: 'func', name: 'availableRooms()', desc: 'Filter by date range and room type' },
  { type: 'func', name: 'load() / save()', desc: 'CSV data persistence' },
];

const block2bCode = `class Hotel {
public:
    static constexpr int kMaxRooms    = 30;
    static constexpr int kMaxBookings = 100;

    explicit Hotel(string persistencePath)
        : persistencePath_(std::move(persistencePath)) {
        load();
    }

    bool addBooking(string name, int roomNumber,
                    int nights, string start,
                    string end, string& error) {
        if (bookings_.size() >= kMaxBookings) {
            error = "Bookings are full.";
            return false;
        }
        if (!isValidRoomNumber(roomNumber)) {
            error = "Invalid room number.";
            return false;
        }
        if (nights <= 0) {
            error = "Invalid nights.";
            return false;
        }
        Date s{}, e{};
        if (!parseDateYYYYMMDD(start, s)) {
            error = "Invalid start date.";
            return false;
        }
        if (!parseDateYYYYMMDD(end, e)) {
            error = "Invalid end date.";
            return false;
        }
        if (compareDate(s, e) > 0) {
            error = "End date must be after start date.";
            return false;
        }
        for (const auto& b : bookings_) {
            if (b.roomNumber() == roomNumber && b.overlaps(s, e)) {
                error = "Room is not available for the selected date range.";
                return false;
            }
        }
        bookings_.emplace_back(nextId_++, std::move(name),
                                roomNumber, nights, start, end);
        save();
        return true;
    }

    bool cancelBookingById(int id) {
        for (size_t i = 0; i < bookings_.size(); i++) {
            if (bookings_[i].id() == id) {
                bookings_.erase(bookings_.begin() + i);
                save();
                return true;
            }
        }
        return false;
    }

    const vector<Booking>& bookings() const { return bookings_; }

private:
    vector<Booking> bookings_;
    int    nextId_ = 1;
    string persistencePath_;
};`;

const consolBookingExplanation = [
  { type: 'text', text: 'The system first displays all available room categories, then collects booking information and validates every field before confirming.' },
  { type: 'bullet', text: 'Displays room types with their number ranges' },
  { type: 'bullet', text: 'Accepts room number, guest name, nights, check-in and check-out dates' },
  { type: 'bullet', text: 'Validates room availability and date correctness' },
  { type: 'bullet', text: 'Confirms with "Booking successful" message on success' },
];

const consoleBookingOutput = `Room types:
  - Standard: rooms 1 to 10
  - Deluxe:   rooms 11 to 20
  - Suite:    rooms 21 to 30

Enter room number: 9
Enter guest name: Ziad
Enter number of nights: 6
Enter start date (YYYY-MM-DD): 2026-05-02
Enter end date   (YYYY-MM-DD): 2026-05-08

Booking successful`;

const block3aExplanation = [
  { type: 'text', text: 'Saves and loads all booking data using CSV file storage. Ensures records survive program restarts.' },
  { type: 'bullet', text: 'load() — Reads records on startup, validates each one (room, nights, dates)' },
  { type: 'bullet', text: 'save() — Writes all current bookings to CSV file (truncates first)' },
  { type: 'bullet', text: 'Automatic ID Management — Tracks highest ID and generates the next one' },
  { type: 'bullet', text: 'Corrupted or invalid lines are skipped gracefully' },
  { type: 'func', name: 'load()', desc: 'Reads + validates CSV records at startup' },
  { type: 'func', name: 'save()', desc: 'Stores all bookings to CSV file' },
];

const block3aCode = `void load() {
    ifstream in(persistencePath_);
    if (!in.is_open()) return;

    string line;
    int maxId = 0;
    while (getline(in, line)) {
        const string t = trim(line);
        if (t.empty()) continue;
        if (t.rfind("id,", 0) == 0) continue; // skip header

        const auto fields = csvSplitLine(line);
        if (fields.size() < 6) continue;

        try {
            const int id     = stoi(trim(fields[0]));
            string    name   = fields[1];
            const int room   = stoi(trim(fields[2]));
            const int nights = stoi(trim(fields[3]));
            string    start  = trim(fields[4]);
            string    end    = trim(fields[5]);

            Date s{}, e{};
            if (!isValidRoomNumber(room)) continue;
            if (nights <= 0) continue;
            if (!parseDateYYYYMMDD(start, s)) continue;
            if (!parseDateYYYYMMDD(end, e))   continue;
            if (compareDate(s, e) > 0)         continue;

            bookings_.emplace_back(id, name, room, nights, start, end);
            if (id > maxId) maxId = id;
        } catch (...) { continue; }
    }
    nextId_ = maxId + 1;
}

void save() const {
    ofstream out(persistencePath_, ios::trunc);
    if (!out.is_open()) return;
    out << "id,name,room,nights,start,end\\n";
    for (const auto& b : bookings_)
        out << b.id() << ','
            << csvEscape(b.guestName()) << ','
            << b.roomNumber() << ','
            << b.nights()     << ','
            << b.startDate()  << ','
            << b.endDate()    << "\\n";
}`;

const block3bExplanation = [
  { type: 'text', text: 'The ConsoleUI class acts as the bridge between the user and the Hotel management logic.' },
  { type: 'bullet', text: 'Holds a reference to the Hotel object to perform all operations' },
  { type: 'bullet', text: 'Provides a continuous menu-driven loop until exit' },
  { type: 'bullet', text: 'Validates all user input before passing to the Hotel class' },
  { type: 'bullet', text: 'Each menu option cleanly linked to a specific hotel function' },
  { type: 'func', name: 'run()', desc: 'Main loop — runs until Exit is chosen' },
];

const block3bCode = `class ConsoleUI {
public:
    explicit ConsoleUI(Hotel& hotel) : hotel_(hotel) {}

    void run() {
        while (true) {
            cout << "\\n===== Hotel Menu =====\\n";
            cout << "1) Book a room\\n";
            cout << "2) Show bookings\\n";
            cout << "3) Cancel booking\\n";
            cout << "4) Search bookings\\n";
            cout << "5) Show available rooms\\n";
            cout << "6) Exit\\n";
            cout << "Choose: ";

            const int choice = readIntRetry(
                "Invalid choice. Please enter a number.");

            if      (choice == 1) bookRoom();
            else if (choice == 2) showBookings(hotel_.bookings());
            else if (choice == 3) cancelBooking();
            else if (choice == 4) searchBookings();
            else if (choice == 5) showAvailableRooms();
            else if (choice == 6) {
                cout << "Goodbye!\\n";
                break;
            } else {
                cout << "Invalid option.\\n";
            }
        }
    }

private:
    Hotel& hotel_;
};`;

const block3cExplanation = [
  { type: 'text', text: 'These helper functions make ConsoleUI robust by ensuring every user input is clean and valid before being processed.' },
  { type: 'func', name: 'discardLine()', desc: 'Clears input buffer to avoid errors' },
  { type: 'func', name: 'readIntRetry()', desc: 'Reads integers safely, retries on failure' },
  { type: 'func', name: 'readLineNonEmpty()', desc: 'Ensures non-empty text input' },
  { type: 'func', name: 'readDateRetry()', desc: 'Validates YYYY-MM-DD format' },
  { type: 'func', name: 'readRoomTypeOptional()', desc: 'Filters by Standard / Deluxe / Suite / All' },
  { type: 'func', name: 'bookRoom()', desc: 'Full booking flow with all validations' },
  { type: 'func', name: 'cancelBooking()', desc: 'Cancel by ID with confirmation' },
  { type: 'func', name: 'searchBookings()', desc: 'Search by name or room number' },
];

const block3cCode = `static void discardLine() {
    cin.ignore(numeric_limits<streamsize>::max(), '\\n');
}

static int readIntRetry(const string& errMsg) {
    int v;
    while (!(cin >> v)) {
        cin.clear();
        discardLine();
        cout << errMsg << '\\n';
    }
    return v;
}

static string readLineNonEmpty(const string& prompt) {
    string line;
    while (true) {
        cout << prompt;
        getline(cin, line);
        line = trim(line);
        if (!line.empty()) return line;
        cout << "Input cannot be empty.\\n";
    }
}

void bookRoom() {
    printRoomTypes();
    cout << "Enter room number: ";
    const int roomNumber = readIntRetry("Invalid room number.");
    discardLine();
    const string name = readLineNonEmpty("Enter guest name: ");
    cout << "Enter number of nights: ";
    const int nights = readIntRetry("Invalid nights.");
    discardLine();
    const string startStr = readLineNonEmpty(
        "Enter start date (YYYY-MM-DD): ");
    const string endStr = readLineNonEmpty(
        "Enter end date (YYYY-MM-DD): ");

    string error;
    if (hotel_.addBooking(name, roomNumber, nights,
                           startStr, endStr, error))
        cout << "Booking successful\\n";
    else
        cout << "Error: " << error << '\\n';
}`;

const block3dExplanation = [
  { type: 'text', text: 'The main() function is the entry point of the entire program — just 6 lines that tie everything together.' },
  { type: 'bullet', text: 'Hotel hotel("bookings.csv") — Creates the Hotel object and auto-loads saved bookings' },
  { type: 'bullet', text: 'ConsoleUI ui(hotel) — Creates the UI layer linked to the hotel data' },
  { type: 'bullet', text: 'ui.run() — Launches the main menu loop' },
  { type: 'bullet', text: 'return 0 — Program ended successfully' },
];

const block3dCode = `int main() {
    Hotel     hotel("bookings.csv");
    ConsoleUI ui(hotel);
    ui.run();
    return 0;
}`;

const consoleOutputExplanation = [
  { type: 'text', text: 'Bookings Management & Cancellation (Runtime Output)' },
  { type: 'bullet', text: 'This screen shows the system displaying all current bookings with full details such as customer name, room number, booking duration, and dates.' },
  { type: 'bullet', text: 'It also demonstrates the cancellation feature, where the user selects a booking by its ID and successfully removes it from the system.' },
  { type: 'text', text: 'This reflects the system’s ability to:' },
  { type: 'bullet', text: 'Display real-time booking data' },
  { type: 'bullet', text: 'Manage reservations dynamically' },
  { type: 'bullet', text: 'Allow safe cancellation with user confirmation' },
  { type: 'text', text: 'Overall, it proves that the system handles both data retrieval and modification efficiently.' },
];

const runtimeRunOutput = `--- Bookings ---
ID: 1 | Name: ziad | Room: 5 (Standard) | Nights: 3 | From: 2026-05-02 | To: 2026-05-05
ID: 2 | Name: Ziad | Room: 9 (Standard) | Nights: 6 | From: 2026-05-02 | To: 2026-05-08

===== Hotel Menu =====
1) Book a room
2) Show bookings
3) Cancel booking
4) Search bookings
5) Show available rooms
6) Exit

Choose: 3
Enter booking ID to cancel: 1
Booking canceled.`;

const consoleRuntimeExplanation = [
  { type: 'text', text: 'This demonstrates the complete booking lifecycle — creating, viewing, canceling, and searching reservations in real time.' },
  { type: 'bullet', text: 'Shows all current bookings with ID, name, room, type, nights, and dates' },
  { type: 'bullet', text: 'Cancels booking by entering its ID — immediately confirmed' },
  { type: 'bullet', text: 'Searches by room number and returns matching records' },
  { type: 'bullet', text: 'Proves data retrieval and modification work correctly' },
];

const consoleRuntimeOutput = `--- Bookings ---
ID: 1 | Name: ziad | Room: 5 (Standard) | Nights: 3 | From: 2026-05-02 | To: 2026-05-05
ID: 2 | Name: Ziad | Room: 9 (Standard) | Nights: 6 | From: 2026-05-02 | To: 2026-05-08

===== Hotel Menu =====
Choose: 3
Enter booking ID to cancel: 1
Booking canceled.

===== Hotel Menu =====
Choose: 4
Search by: 1) Guest name  2) Room number
Choose: 2
Enter room number: 9

--- Bookings ---
ID: 2 | Name: Ziad | Room: 9 (Standard) | Nights: 6 | From: 2026-05-02 | To: 2026-05-08`;

// ─── MAIN APP ────────────────────────────────────────
function App() {
  return (
    <div className="website-wrapper">

      {/* ── Hero ── */}
      <header className="main-hero">
        <div className="univ-info">
          <p>Faculty of Information &amp; Computers</p>
          <p>AI Department</p>
        </div>
        <h1>Hotel Reservation System</h1>
        <p className="hero-subtitle">C++ OOP Project · 554 Lines · 3 Room Types · 6 Features</p>
        <div className="team-grid">
          <div className="member">
            <img src="/assets/ziad.png" alt="Ziad" />
            <h3>Ziad Elgohary</h3>
            <p>Full-Stack python Developer</p>
          </div>
          <div className="member">
            <img src="/assets/omar.png" alt="Omar" />
            <h3>Omar Bahnasy</h3>
            <p>Data Analyst</p>
          </div>
          <div className="member">
            <img src="/assets/ebrahim.jpg" alt="Ebrahim" />
            <h3>Ebrahim Elsaeed</h3>
            <p>Developer</p>
          </div>
          <div className="member">
            <img src="/assets/adam.png" alt="Adam" />
            <h3>Adam Kamal</h3>
            <p>Developer</p>
          </div>
        </div>
        <div className="supervision">
          <span>Supervision:</span>
          <strong>Dr. Osama Ghoneim</strong>
          <span>&amp;</span>
          <strong>Eng. Omar Khaled</strong>
        </div>
      </header>

      {/* ── Introduction ── */}
      <section className="intro-section">
        <div className="section-label">02 — Introduction</div>
        <div className="intro-card">
          <div className="intro-text">
            <h2>What is this Project?</h2>
            <p>
              A <strong>Hotel Booking Management System</strong> developed in C++.
              Designed to simplify hotel reservation operations through an efficient,
              console-based management solution.
            </p>
            <ul className="intro-bullets">
              <li>→ Manage room reservations &amp; check availability</li>
              <li>→ Search booking records and cancel reservations</li>
              <li>→ Standard, Deluxe, and Suite room categories</li>
              <li>→ Automatic validation of dates and availability</li>
              <li>→ CSV file storage for data persistence</li>
              <li>→ Demonstrates OOP, file handling &amp; data validation</li>
            </ul>
          </div>
          <div className="intro-terminal">
            <div className="code-header terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span style={{marginLeft:'10px'}}>hotel_system.cpp</span>
            </div>
            <pre><code>{`int main() {
    Hotel     hotel("bookings.csv");
    ConsoleUI ui(hotel);
    ui.run();
    return 0;
}`}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Code Blocks Section ── */}
      <section className="blocks-section">
        <div className="section-label">03 — Code Walkthrough</div>

        <SlideCard
          id="block1a"
          title="Date Validation & Conflict Detection"
          subtitle="Block 1 · Lines 1–79"
          explanation={block1aExplanation}
          codeContent={block1aCode}
        />

        <SlideCard
          id="block1b"
          title="Room Management & Data Processing"
          subtitle="Block 1 · Lines 79–155"
          explanation={block1bExplanation}
          codeContent={block1bCode}
        />

        <ConsoleCard
          id="console1"
          title="System Execution & Main Menu"
          subtitle="Console Output"
          explanation={consoleMenu}
          output={consoleMenuOutput}
        />

        <SlideCard
          id="block2a"
          title="Booking Class Implementation"
          subtitle="Block 2 · Lines 156–196"
          explanation={block2aExplanation}
          codeContent={block2aCode}
        />

        <SlideCard
          id="block2b"
          title="Hotel Class — Main Controller"
          subtitle="Block 2 · Lines 197–297"
          explanation={block2bExplanation}
          codeContent={block2bCode}
        />

        <ConsoleCard
          id="console2"
          title="Booking Process Execution"
          subtitle="Console Output"
          explanation={consolBookingExplanation}
          output={consoleBookingOutput}
        />

        <SlideCard
          id="block3a"
          title="Data Storage & File Management"
          subtitle="Block 3 · Lines 304–356"
          explanation={block3aExplanation}
          codeContent={block3aCode}
        />

        <SlideCard
          id="block3b"
          title="ConsoleUI Class Overview"
          subtitle="Block 3 · Lines 357–390"
          explanation={block3bExplanation}
          codeContent={block3bCode}
        />
        
        <ConsoleCard
          id="console3"
          title="Bookings Management & Cancellation (Runtime Output)"
          subtitle="Console Output"
          explanation={consoleOutputExplanation}
          output={runtimeRunOutput}
        />

        <SlideCard
          id="block3c"
          title="Input Helpers & UI Actions"
          subtitle="Block 3 · Lines 392–548"
          explanation={block3cExplanation}
          codeContent={block3cCode}
        />

        <SlideCard
          id="block3d"
          title="Main Function — Program Entry Point"
          subtitle="Block 3 · Lines 549–554"
          explanation={block3dExplanation}
          codeContent={block3dCode}
        />

        <ConsoleCard
          id="console4"
          title="Full Runtime Demo"
          subtitle="Console Output"
          explanation={consoleRuntimeExplanation}
          output={consoleRuntimeOutput}
        />
      </section>

      {/* ── Conclusion ── */}
      <section className="conclusion-section" id="conclusion">
        <div className="section-label" style={{textAlign:'center', marginBottom:'40px'}}>04 — Conclusion</div>
        <div className="conclusion-grid">
          <div className="conclusion-text">
            <h2>What We Built</h2>
            <p>
              This Hotel Reservation System successfully demonstrates a complete and efficient
              solution for managing room bookings, cancellations, and availability tracking.
              It ensures data accuracy through strong validation of dates, room numbers, and
              booking constraints.
            </p>
            <p>
              The system supports multiple room types, prevents overlapping reservations,
              and maintains persistent storage using file handling. It also provides
              user-friendly search and filtering options to improve usability.
            </p>
            <p>
              Overall, the project showcases the practical application of
              <strong> object-oriented programming</strong>, data structures, and file
              management in C++, delivering a reliable and scalable solution.
            </p>
            <div className="thanks-note">
              🎓 Special thanks to <strong>Dr. Osama Ghoneim</strong> and{' '}
              <strong>Eng. Omar Khaled</strong> for their continuous support and guidance.
            </div>
          </div>
          <div className="feat-grid">
            {[
              { icon: '🏨', title: '30 Rooms',     desc: 'Standard, Deluxe & Suite' },
              { icon: '🔒', title: 'No Conflicts', desc: 'Overlap detection built-in' },
              { icon: '💾', title: 'Persistent',   desc: 'CSV storage across restarts' },
              { icon: '🔍', title: 'Searchable',   desc: 'By name or room number' },
              { icon: '✅', title: 'Validated',    desc: 'Every input verified' },
              { icon: '⚙️', title: 'OOP Design',   desc: 'Clean class hierarchy' },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thank You + LinkedIn ── */}
      <footer className="thankyou-section">
        <h1 className="ty-title">Thank You</h1>
        <p className="ty-sub">For your time and attention</p>
        <p className="linkedin-label">Connect with the team on LinkedIn</p>
        <div className="linkedin-btns">
          <a href="https://www.linkedin.com/in/ziad-elgohary4/" target="_blank" rel="noopener noreferrer" className="linkedin-btn">
            <LinkedInIcon /> Ziad Elgohary
          </a>
          <a href="https://www.linkedin.com/in/omar-bahnasy-dataanalyst/" target="_blank" rel="noopener noreferrer" className="linkedin-btn">
            <LinkedInIcon /> Omar Bahnasy
          </a>
        </div>
        <p className="ty-footer">
          Faculty of Information &amp; Computers · AI Department · C++ OOP Project 2026
        </p>
      </footer>

    </div>
  );
}

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default App;