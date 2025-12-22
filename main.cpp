#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    // تعريف نطاق الغرف: 1-10 Standard, 11-20 Deluxe, 21-30 Suite
    const int MAX_ROOMS = 30;
    bool roomBooked[MAX_ROOMS + 1]; // فهرسة من 1..30
    for (int i = 1; i <= MAX_ROOMS; i++) roomBooked[i] = false;

    // مصفوفات لتخزين الحجوزات (حتى 100 حجز)
    const int MAX_BOOKINGS = ;
    string names[MAX_BOOKINGS];
    int roomNums[MAX_BOOKINGS];
    int nightsArr[MAX_BOOKINGS];
    string startDates[MAX_BOOKINGS];
    string endDates[MAX_BOOKINGS];
    int count = 0;

    // طباعة أنواع الغرف (تعليمية فقط)
    auto printTypes = [](){
        cout << "Room types:\n";
        cout << " - Standard: rooms 1 to 10\n";
        cout << " - Deluxe:   rooms 11 to 20\n";
        cout << " - Suite:    rooms 21 to 30\n";
    };

    while (true) {
        // قائمة بسيطة
        cout << "\n===== Hotel Menu =====\n";
        cout << "1) Book a room\n";
        cout << "2) Show bookings\n";
        cout << "3) Exit\n";
        cout << "Choose: ";

        int choice;
        if (!(cin >> choice)) return 0;

        if (choice == 1) {
            // تحقق من السعة
            if (count >= MAX_BOOKINGS) {
                cout << "Sorry, bookings are full.\n";
                continue;
            }

            printTypes();
            cout << "Enter room number: ";
            int r; cin >> r;

            // تحقق من صحة رقم الغرفة
            if (r < 1 || r > MAX_ROOMS) {
                cout << "Invalid room number.\n";
                continue;
            }

            // تحقق هل الغرفة محجوزة
            if (roomBooked[r]) {
                cout << "Room is already booked\n";
                continue;
            }

            // إدخال بيانات الحجز
            cout << "Enter guest name: ";
            cin.ignore(); // تنظيف المخزن قبل getline
            string name; getline(cin, name);

            cout << "Enter number of nights: ";
            int nights; cin >> nights;
            if (nights <= 0) {
                cout << "Invalid nights.\n";
                continue;
            }

            // امسح نهاية السطر المتبقية قبل استخدام getline للتاريخين
            cin.ignore(numeric_limits<streamsize>::max(), '\n');

            cout << "Enter start date (YYYY-MM-DD): ";
            string start; getline(cin, start);

            cout << "Enter end date (YYYY-MM-DD): ";
            string endd; getline(cin, endd);

            // تخزين الحجز وتحديث حالة الغرفة
            names[count] = name;
            roomNums[count] = r;
            nightsArr[count] = nights;
            startDates[count] = start;
            endDates[count] = endd;
            roomBooked[r] = true;
            count++;

            cout << "Booking successful\n";
        }
        else if (choice == 2) {
            // عرض كل الحجوزات
            if (count == 0) {
                cout << "No bookings yet.\n";
            } else {
                cout << "\n--- Bookings ---\n";
                for (int i = 0; i < count; i++) {
                    // تحديد نوع الغرفة من رقمها (من غير struct)
                    string type = (roomNums[i] <= 10) ? "Standard" :
                                  (roomNums[i] <= 20) ? "Deluxe"   : "Suite";
                    cout << i+1 << ") "
                         << "Name: " << names[i]
                         << " | Room: " << roomNums[i] << " (" << type << ")"
                         << " | Nights: " << nightsArr[i]
                         << " | From: " << startDates[i]
                         << " | To: " << endDates[i] << "\n";
                }
            }
        }
        else if (choice == 3) {
            // خروج
            cout << "Goodbye!\n";
            break;
        }
        else {
            // اختيار غير صحيح
            cout << "Invalid option.\n";
        }
    }
    return 0;
}
