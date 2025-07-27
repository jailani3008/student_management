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
document.addEventListener("DOMContentLoaded", () => {
    fetchLatestAttendanceSummary();
});
function fetchLatestAttendanceSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/attendance/count`);
            if (!response.ok)
                throw new Error(`Failed to load attendance summary: ${response.statusText}`);
            const data = yield response.json();
            populateDashboard(data);
        }
        catch (error) {
            console.error("Error fetching attendance summary:", error);
            alert("Unable to load attendance summary. Please try again later.");
        }
    });
}
function populateDashboard(data) {
    const totalStudentsEl = document.getElementById("totalStudents");
    const presentEl = document.getElementById("present");
    const absentEl = document.getElementById("absent");
    const percentageEl = document.getElementById("percentage");
    if (totalStudentsEl)
        totalStudentsEl.innerText = `Total Students: ${data.totalStudents}`;
    if (presentEl)
        presentEl.innerText = `Present: ${data.present}`;
    if (absentEl)
        absentEl.innerText = `Absent: ${data.absent}`;
    if (percentageEl)
        percentageEl.innerText = `Percentage: ${parseFloat(data.percentage).toFixed(2)}%`;
}
