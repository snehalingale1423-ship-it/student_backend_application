/**
 * Student data helper utilities
 */

export const getStudentInitials = (name) => {
  if (!name || typeof name !== 'string') return '--';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const generateNextStudentId = (students = []) => {
  if (!students.length) return "STU001";
  const numericIds = students
    .map(s => {
      const match = s.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  
  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
  const nextNum = maxId + 1;
  return `STU${String(nextNum).padStart(3, '0')}`;
};

export const filterStudents = (students = [], { searchQuery = '', branchFilter = 'all', yearFilter = 'all' } = {}) => {
  const query = (searchQuery || '').trim().toLowerCase();

  return students.filter(student => {
    // Search query matches ID, Name, or Email
    const matchesSearch =
      !query ||
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);

    // Branch filter
    const matchesBranch = branchFilter === 'all' || student.branch === branchFilter;

    // Academic year filter
    const matchesYear = yearFilter === 'all' || student.year === yearFilter;

    return matchesSearch && matchesBranch && matchesYear;
  });
};

export const getStudentMetrics = (students = []) => {
  const total = students.length;
  const compEngCount = students.filter(s => s.branch === "Computer Engineering").length;
  const firstYearCount = students.filter(s => s.year === "First Year").length;
  const secondYearCount = students.filter(s => s.year === "Second Year").length;

  return {
    total,
    compEngCount,
    firstYearCount,
    secondYearCount
  };
};
