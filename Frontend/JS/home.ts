
interface AttendanceRecord {
  status: "Present" | "Absent";
  count: string;  // comes as string from DB
}

interface AttendanceSummaryResponse {
  date: string;
  summary: AttendanceRecord[];
}

document.addEventListener("DOMContentLoaded", () => {
  fetchLatestAttendanceSummary();
});

async function fetchLatestAttendanceSummary(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/count`);
    if (!response.ok) throw new Error(`Failed to load attendance summary: ${response.statusText}`);

    const data: {
      totalStudents: number;
      present: number;
      absent: number;
      percentage: string;
    } = await response.json();

    populateDashboard(data);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    alert("Unable to load attendance summary. Please try again later.");
  }
}

function populateDashboard(data: { totalStudents: number; present: number; absent: number; percentage: string }): void {
  const totalStudentsEl = document.getElementById("totalStudents");
  const presentEl = document.getElementById("present");
  const absentEl = document.getElementById("absent");
  const percentageEl = document.getElementById("percentage");

  if (totalStudentsEl) totalStudentsEl.innerText = `Total Students: ${data.totalStudents}`;
  if (presentEl) presentEl.innerText = `Present: ${data.present}`;
  if (absentEl) absentEl.innerText = `Absent: ${data.absent}`;
  if (percentageEl) percentageEl.innerText = `Percentage: ${parseFloat(data.percentage).toFixed(2)}%`;
}
