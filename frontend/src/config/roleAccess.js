export const ROLE = {
  ADMIN: "ADMIN",
  FACULTY: "FACULTY",
  STUDENT: "STUDENT"
};

export const ROLE_ACCESS = {
  [ROLE.ADMIN]: [
    { label: "Manage Users", path: "/manage-users" },
    { label: "Create Exam", path: "/create-exam" },
    { label: "Publish Results", path: "/publish-results" }
  ],
  [ROLE.FACULTY]: [
    { label: "Create Exam", path: "/create-exam" },
    { label: "Add Questions", path: "/add-question" },
    { label: "Evaluate Answers", path: "/evaluate-answers" }
  ],
  [ROLE.STUDENT]: [
    { label: "View Exams", path: "/view-exams" },
    { label: "Attempt Exam", path: "/attempt-exam" },
    { label: "View Result", path: "/result" }
  ]
};

function normalizeRole(role) {
  return typeof role === "string" ? role.toUpperCase() : "";
}

export function getAuthFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
}

export function getRoleFromAuth(auth) {
  return normalizeRole(auth?.role);
}

export function getRoleFromStorage() {
  return getRoleFromAuth(getAuthFromStorage());
}

export function getDefaultRouteForRole(role) {
  const normalizedRole = normalizeRole(role);
  const allowedItems = ROLE_ACCESS[normalizedRole] || [];
  return allowedItems[0]?.path || "/login";
}
