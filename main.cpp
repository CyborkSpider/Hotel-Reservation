#include <iostream>
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

static string toString(RoomType t) {
    switch (t) {
        case RoomType::Standard: return "Standard";
        case RoomType::Deluxe: return "Deluxe";
        case RoomType::Suite: return "Suite";
    }
    return "Unknown";
}

struct Date {
    int y = 0;
    int m = 0;
    int d = 0;
};

static bool isLeapYear(int y) {
    if (y % 400 == 0) return true;
    if (y % 100 == 0) return false;
    return (y % 4 == 0);
}

static int daysInMonth(int y, int m) {
    static const int days[] = { 31,28,31,30,31,30,31,31,30,31,30,31 };
    if (m < 1 || m > 12) return 0;
    if (m == 2) return days[m - 1] + (isLeapYear(y) ? 1 : 0);
    return days[m - 1];
}

static bool isValidDate(const Date& dt) {
    if (dt.y < 1) return false;
    if (dt.m < 1 || dt.m > 12) return false;
    const int dim = daysInMonth(dt.y, dt.m);
    if (dt.d < 1 || dt.d > dim) return false;
    return true;
}

static int compareDate(const Date& a, const Date& b) {
    if (a.y != b.y) return (a.y < b.y) ? -1 : 1;
    if (a.m != b.m) return (a.m < b.m) ? -1 : 1;
    if (a.d != b.d) return (a.d < b.d) ? -1 : 1;
    return 0;
}

static bool parseDateYYYYMMDD(const string& s, Date& out) {
    if (s.size() != 10) return false;
    if (s[4] != '-' || s[7] != '-') return false;
    for (size_t i = 0; i < s.size(); i++) {
        if (i == 4 || i == 7) continue;
        if (!isdigit(static_cast<unsigned char>(s[i]))) return false;
    }

    out.y = stoi(s.substr(0, 4));
    out.m = stoi(s.substr(5, 2));
    out.d = stoi(s.substr(8, 2));
    return isValidDate(out);
}

static bool rangesOverlapInclusive(const Date& aStart, const Date& aEnd, const Date& bStart, const Date& bEnd) {
    return compareDate(aStart, bEnd) <= 0 && compareDate(bStart, aEnd) <= 0;
}

static bool isValidRoomNumber(int roomNumber) {
    return roomNumber >= 1 && roomNumber <= 30;
}

static RoomType roomTypeFromNumber(int roomNumber) {
    if (roomNumber <= 10) return RoomType::Standard;
    if (roomNumber <= 20) return RoomType::Deluxe;
    return RoomType::Suite;
}

static string trim(const string& s) {
    size_t i = 0;
    while (i < s.size() && isspace(static_cast<unsigned char>(s[i]))) i++;
    size_t j = s.size();
    while (j > i && isspace(static_cast<unsigned char>(s[j - 1]))) j--;
    return s.substr(i, j - i);
}

static string toLowerCopy(string s) {
    for (char& c : s) c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
    return s;
}

static string csvEscape(const string& s) {
    bool needQuotes = false;
    for (char c : s) {
        if (c == ',' || c == '"' || c == '\n' || c == '\r') {
            needQuotes = true;
            break;
        }
    }
    if (!needQuotes) return s;
    string out;
    out.reserve(s.size() + 2);
    out.push_back('"');
    for (char c : s) {
        if (c == '"') out += "\"\"";
        else out.push_back(c);
    }
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
            if (c == '"') {
                if (i + 1 < line.size() && line[i + 1] == '"') {
                    field.push_back('"');
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field.push_back(c);
            }
        } else {
            if (c == ',') {
                fields.push_back(field);
                field.clear();
            } else if (c == '"') {
                inQuotes = true;
            } else {
                field.push_back(c);
            }
        }
    }
    fields.push_back(field);
    return fields;
}

class Booking {
public:
    Booking(int id, string guestName, int roomNumber, int nights, string startDate, string endDate)
        : id_(id),
          guestName_(std::move(guestName)),
          roomNumber_(roomNumber),
          nights_(nights),
          startDate_(std::move(startDate)),
          endDate_(std::move(endDate)) {
        parseDateYYYYMMDD(startDate_, start_);
        parseDateYYYYMMDD(endDate_, end_);
    }

    int id() const { return id_; }

    const string& guestName() const { return guestName_; }
    int roomNumber() const { return roomNumber_; }
    int nights() const { return nights_; }
    const string& startDate() const { return startDate_; }
    const string& endDate() const { return endDate_; }

    const Date& start() const { return start_; }
    const Date& end() const { return end_; }

    bool overlaps(const Date& s, const Date& e) const {
        return rangesOverlapInclusive(start_, end_, s, e);
    }

    string roomType() const { return toString(roomTypeFromNumber(roomNumber_)); }

private:
    int id_;
    string guestName_;
    int roomNumber_;
    int nights_;
    string startDate_;
    string endDate_;
    Date start_{};
    Date end_{};
};

class Hotel {
public:
    static constexpr int kMaxRooms = 30;
    static constexpr size_t kMaxBookings = 100;

    explicit Hotel(string persistencePath)
        : persistencePath_(std::move(persistencePath)) {
        load();
    }

    ~Hotel() {
        save();
    }

    bool addBooking(string name, int roomNumber, int nights, const string& start, const string& end, string& error) {
        if (bookings_.size() >= kMaxBookings) {
            error = "Sorry, bookings are full.";
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

        bookings_.emplace_back(nextId_++, std::move(name), roomNumber, nights, start, end);
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

    vector<Booking> searchByGuestName(const string& query) const {
        const string q = toLowerCopy(trim(query));
        vector<Booking> results;
        for (const auto& b : bookings_) {
            if (toLowerCopy(b.guestName()).find(q) != string::npos) results.push_back(b);
        }
        return results;
    }

    vector<Booking> searchByRoom(int roomNumber) const {
        vector<Booking> results;
        for (const auto& b : bookings_) {
            if (b.roomNumber() == roomNumber) results.push_back(b);
        }
        return results;
    }

    vector<int> availableRooms(const Date& s, const Date& e, optional<RoomType> filterType = nullopt) const {
        vector<int> rooms;
        for (int r = 1; r <= kMaxRooms; r++) {
            if (filterType.has_value() && roomTypeFromNumber(r) != *filterType) continue;
            bool ok = true;
            for (const auto& b : bookings_) {
                if (b.roomNumber() == r && b.overlaps(s, e)) {
                    ok = false;
                    break;
                }
            }
            if (ok) rooms.push_back(r);
        }
        return rooms;
    }

    const string& persistencePath() const { return persistencePath_; }

private:
    vector<Booking> bookings_;
    int nextId_ = 1;
    string persistencePath_;

    void load() {
        ifstream in(persistencePath_);
        if (!in.is_open()) return;

        string line;
        int maxId = 0;
        while (getline(in, line)) {
            const string t = trim(line);
            if (t.empty()) continue;
            if (t.rfind("id,", 0) == 0) continue;

            const auto fields = csvSplitLine(line);
            if (fields.size() < 6) continue;

            try {
                const int id = stoi(trim(fields[0]));
                const string name = fields[1];
                const int room = stoi(trim(fields[2]));
                const int nights = stoi(trim(fields[3]));
                const string start = trim(fields[4]);
                const string end = trim(fields[5]);

                Date s{}, e{};
                if (!isValidRoomNumber(room)) continue;
                if (nights <= 0) continue;
                if (!parseDateYYYYMMDD(start, s)) continue;
                if (!parseDateYYYYMMDD(end, e)) continue;
                if (compareDate(s, e) > 0) continue;

                bookings_.emplace_back(id, name, room, nights, start, end);
                if (id > maxId) maxId = id;
            } catch (...) {
                continue;
            }
        }
        nextId_ = maxId + 1;
    }

    void save() const {
        ofstream out(persistencePath_, ios::trunc);
        if (!out.is_open()) return;

        out << "id,name,room,nights,start,end\n";
        for (const auto& b : bookings_) {
            out << b.id() << ','
                << csvEscape(b.guestName()) << ','
                << b.roomNumber() << ','
                << b.nights() << ','
                << b.startDate() << ','
                << b.endDate() << "\n";
        }
    }
};

class ConsoleUI {
public:
    explicit ConsoleUI(Hotel& hotel) : hotel_(hotel) {}

    void run() {
        while (true) {
            cout << "\n===== Hotel Menu =====\n";
            cout << "1) Book a room\n";
            cout << "2) Show bookings\n";
            cout << "3) Cancel booking\n";
            cout << "4) Search bookings\n";
            cout << "5) Show available rooms\n";
            cout << "6) Exit\n";
            cout << "Choose: ";

            const int choice = readIntRetry("Invalid choice. Please enter a number.");
            if (choice == 1) {
                bookRoom();
            } else if (choice == 2) {
                showBookings(hotel_.bookings());
            } else if (choice == 3) {
                cancelBooking();
            } else if (choice == 4) {
                searchBookings();
            } else if (choice == 5) {
                showAvailableRooms();
            } else if (choice == 6) {
                cout << "Goodbye!\n";
                break;
            } else {
                cout << "Invalid option.\n";
            }
        }
    }

private:
    Hotel& hotel_;

    static void discardLine() {
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    static int readIntRetry(const string& errorMsg) {
        while (true) {
            int value;
            if (cin >> value) return value;
            cin.clear();
            discardLine();
            cout << errorMsg << "\n";
            cout << "Try again: ";
        }
    }

    static string readLineNonEmpty(const string& prompt) {
        while (true) {
            cout << prompt;
            string s;
            getline(cin, s);
            s = trim(s);
            if (!s.empty()) return s;
            cout << "Value cannot be empty.\n";
        }
    }

    static Date readDateRetry(const string& prompt) {
        while (true) {
            const string s = readLineNonEmpty(prompt);
            Date d{};
            if (parseDateYYYYMMDD(s, d)) return d;
            cout << "Invalid date. Use YYYY-MM-DD.\n";
        }
    }

    static optional<RoomType> readRoomTypeOptional() {
        cout << "Filter by room type? (0=All, 1=Standard, 2=Deluxe, 3=Suite): ";
        const int v = readIntRetry("Invalid number.");
        if (v == 0) return nullopt;
        if (v == 1) return RoomType::Standard;
        if (v == 2) return RoomType::Deluxe;
        if (v == 3) return RoomType::Suite;
        cout << "Unknown type. Using All.\n";
        return nullopt;
    }

    static void printRoomTypes() {
        cout << "Room types:\n";
        cout << " - Standard: rooms 1 to 10\n";
        cout << " - Deluxe:   rooms 11 to 20\n";
        cout << " - Suite:    rooms 21 to 30\n";
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

        const string startStr = readLineNonEmpty("Enter start date (YYYY-MM-DD): ");
        const string endStr = readLineNonEmpty("Enter end date (YYYY-MM-DD): ");

        string error;
        if (!hotel_.addBooking(name, roomNumber, nights, startStr, endStr, error)) {
            cout << error << "\n";
            return;
        }
        cout << "Booking successful\n";
    }

    static void showBookings(const vector<Booking>& bookings) {
        if (bookings.empty()) {
            cout << "No bookings yet.\n";
            return;
        }

        cout << "\n--- Bookings ---\n";
        for (const auto& b : bookings) {
            cout << "ID: " << b.id()
                 << " | Name: " << b.guestName()
                 << " | Room: " << b.roomNumber() << " (" << b.roomType() << ")"
                 << " | Nights: " << b.nights()
                 << " | From: " << b.startDate()
                 << " | To: " << b.endDate() << "\n";
        }
    }

    void cancelBooking() {
        if (hotel_.bookings().empty()) {
            cout << "No bookings yet.\n";
            return;
        }
        cout << "Enter booking ID to cancel: ";
        const int id = readIntRetry("Invalid id.");
        discardLine();

        if (hotel_.cancelBookingById(id)) {
            cout << "Booking canceled.\n";
        } else {
            cout << "Booking ID not found.\n";
        }
    }

    void searchBookings() {
        cout << "Search by: 1) Guest name  2) Room number\n";
        cout << "Choose: ";
        const int choice = readIntRetry("Invalid choice.");
        discardLine();

        if (choice == 1) {
            const string q = readLineNonEmpty("Enter name (partial allowed): ");
            const auto results = hotel_.searchByGuestName(q);
            showBookings(results);
        } else if (choice == 2) {
            cout << "Enter room number: ";
            const int r = readIntRetry("Invalid room.");
            discardLine();
            const auto results = hotel_.searchByRoom(r);
            showBookings(results);
        } else {
            cout << "Invalid option.\n";
        }
    }

    void showAvailableRooms() {
        discardLine();
        const Date s = readDateRetry("Enter start date (YYYY-MM-DD): ");
        const Date e = readDateRetry("Enter end date (YYYY-MM-DD): ");
        if (compareDate(s, e) > 0) {
            cout << "End date must be after start date.\n";
            return;
        }
        const auto filterType = readRoomTypeOptional();

        const auto rooms = hotel_.availableRooms(s, e, filterType);
        if (rooms.empty()) {
            cout << "No available rooms for this range.\n";
            return;
        }

        cout << "Available rooms: ";
        for (size_t i = 0; i < rooms.size(); i++) {
            if (i) cout << ", ";
            cout << rooms[i];
        }
        cout << "\n";
    }
};

int main() {
    Hotel hotel("bookings.csv");
    ConsoleUI ui(hotel);
    ui.run();
    return 0;
}