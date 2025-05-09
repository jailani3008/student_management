"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/Frontend/HTML/login.html";
}
function fetchLatestAttendanceSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:3000/latest-attendance-summary");
            const data = yield response.json();
            let total = 0;
            let present = 0;
            let absent = 0;
            data.summary.forEach((record) => {
                const count = parseInt(record.count);
                total += count;
                if (record.status === "Present") {
                    present = count;
                }
                else if (record.status === "Absent") {
                    absent = count;
                }
            });
            const percentage = total > 0 ? parseFloat(((present / total) * 100).toFixed(2)) : 0;
            const totalStudentsEl = document.getElementById("totalStudents");
            const presentCountEl = document.getElementById("presentCount");
            const absentCountEl = document.getElementById("absentCount");
            const percentageEl = document.getElementById("attendancePercentage");
            if (totalStudentsEl && presentCountEl && absentCountEl && percentageEl) {
                totalStudentsEl.innerText = `Total Students: ${total}`;
                presentCountEl.innerText = `Present: ${present}`;
                absentCountEl.innerText = `Absent: ${absent}`;
                percentageEl.innerText = `Percentage: ${percentage}%`;
            }
        }
        catch (error) {
            console.error("Error fetching latest attendance summary:", error);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetchLatestAttendanceSummary();
});
